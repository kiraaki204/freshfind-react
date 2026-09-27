import { useEffect, useRef, useState } from 'react';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import allMarkets from '../data/markets.json';
import produceData from '../data/produce.json';
import { formatTime, getMarketStatus } from '../utils/time.js';
import { visibleMarkets, fmtDist } from '../utils/geo.js';
import { loadLeaflet, addBaseTiles, isValidCoord, marketPinIcon, userDotIcon } from '../utils/leaflet.js';
import { useGeolocation } from '../hooks/useGeolocation.jsx';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import Icon from './Icon.jsx';

/* Interactive street map (Leaflet + OpenStreetMap tiles). Every marker comes
   from the lat/lng stored in the market data — never invented — and the user
   dot only ever comes from the browser geolocation API. */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function popupHtml(m, saved) {
  const st = getMarketStatus(m);
  const stCls = st.status === 'open' ? 'status-open' : st.status === 'opens-today' ? 'status-soon' : 'status-closed';
  const items = produceData.filter((p) => m.produce.includes(p.id));
  const dirUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address)}`;
  return `
    <div class="ffpop">
      <h3 class="h6 mb-1">${esc(m.name)}</h3>
      <div class="mb-2"><span class="rounded-pill fw-medium d-inline-flex align-items-center ${stCls}" style="padding:2px 8px;font-size:12px">${st.status === 'open' ? '<span class="pulse-dot me-1"></span>' : ''}${esc(st.label)}</span></div>
      <div class="small text-muted mb-1">${esc(m.address)}</div>
      <div class="small text-muted mb-2">${m.days.map(esc).join(', ')} · ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)}</div>
      ${items.length > 0 ? `<div class="d-flex flex-wrap gap-1 mb-2">${items.slice(0, 6).map((p) => `<span class="chip">${esc(p.emoji)} ${esc(p.name)}</span>`).join('')}${items.length > 6 ? `<span class="chip">+${items.length - 6}</span>` : ''}</div>` : ''}
      <div class="d-flex gap-1">
        <button type="button" class="btn-green py-1 px-2 flex-grow-1" style="font-size:12px" data-ff-view="${m.id}">View Details</button>
        <button type="button" class="btn-outline-green py-1 px-2" style="font-size:12px" data-ff-save="${m.id}" aria-pressed="${saved}"><span class="ffpop-save-label">${saved ? 'Saved' : 'Save'}</span></button>
        <a class="btn-outline-green py-1 px-2" style="font-size:12px;text-decoration:none" href="${dirUrl}" target="_blank" rel="noopener">Directions</a>
      </div>
    </div>`;
}

/* Survives list↔map toggles (which remount the map) so a selection that was
   already focused — or whose popup the user closed — is not re-opened. */
let lastFocusNonce = null;

export default function MarketMap({ markets, popupRequest = null, onPopupConsumed, selection = null, onSelectMarket }) {
  const { openMarket } = useMarketModal();
  const { geo } = useGeolocation();
  const { bookmarks, toggleBookmark } = useBookmarks();

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const fitKeyRef = useRef(null);
  const pendingFocusRef = useRef(null);
  const [L, setL] = useState(null);
  const [mapStatus, setMapStatus] = useState('loading'); // loading | ready | error

  // latest values for listeners created once at map init
  const openMarketRef = useRef(openMarket);
  const toggleRef = useRef(toggleBookmark);
  const bookmarksRef = useRef(bookmarks);
  const marketsRef = useRef(markets);
  const onSelectRef = useRef(onSelectMarket);
  openMarketRef.current = openMarket;
  toggleRef.current = toggleBookmark;
  bookmarksRef.current = bookmarks;
  marketsRef.current = markets;
  onSelectRef.current = onSelectMarket;

  const user = geo.granted && geo.lat != null ? { lat: geo.lat, lng: geo.lng } : null;
  const { displayed, nearInfo } = visibleMarkets(markets, user);
  const displayKey = displayed.map((m) => m.id).join(',');
  const userKey = user ? `${user.lat},${user.lng}` : '';
  const selectedId = selection ? selection.id : null;

  // load Leaflet once (dynamic import keeps it SSR-safe)
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((leaflet) => { if (!cancelled) { setL(leaflet); setMapStatus('ready'); } })
      .catch(() => { if (!cancelled) setMapStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // create the map once Leaflet and the container are available
  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, { zoomControl: false, minZoom: 3, maxZoom: 18 });
    addBaseTiles(L, map);
    L.control.zoom({ position: 'topright' }).addTo(map); // same corner as the old controls
    mapRef.current = map;

    // one delegated listener serves every popup's buttons
    const onClick = (e) => {
      const viewBtn = e.target.closest('[data-ff-view]');
      if (viewBtn) {
        openMarketRef.current(viewBtn.dataset.ffView);
        return;
      }
      const saveBtn = e.target.closest('[data-ff-save]');
      if (saveBtn) {
        const id = Number(saveBtn.dataset.ffSave);
        const m = marketsRef.current.find((x) => x.id === id);
        if (!m) return;
        const wasSaved = bookmarksRef.current.some((b) => b.id === `market-${m.id}`);
        toggleRef.current({ id: `market-${m.id}`, type: 'market', name: m.name, location: m.location });
        const label = saveBtn.querySelector('.ffpop-save-label');
        if (label) label.textContent = wasSaved ? 'Save' : 'Saved';
        saveBtn.setAttribute('aria-pressed', String(!wasSaved));
      }
    };
    containerRef.current.addEventListener('click', onClick);

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      containerRef.current?.removeEventListener('click', onClick);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      userMarkerRef.current = null;
    };
  }, [L]);

  // keep markers in sync with the displayed markets
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !L || mapStatus !== 'ready') return;

    const existing = markersRef.current;
    const next = {};
    displayed.forEach((m) => {
      if (!isValidCoord(m.lat, m.lng)) return; // never place a marker at a guess
      let marker = existing[m.id];
      if (!marker) {
        marker = L.marker([m.lat, m.lng], {
          icon: marketPinIcon(L, m.id === selectedId),
          title: m.name,
          alt: m.name,
        });
        const saved = bookmarksRef.current.some((b) => b.id === `market-${m.id}`);
        marker.bindPopup(popupHtml(m, saved), { maxWidth: 300, minWidth: 240 });
        marker.on('click', () => onSelectRef.current && onSelectRef.current(m.id));
        marker.addTo(map);
      }
      next[m.id] = marker;
    });
    Object.keys(existing).forEach((id) => {
      if (!next[id]) existing[id].remove();
    });
    markersRef.current = next;

    // re-frame only when the set of displayed markets (or the user) changes,
    // so manual panning is never hijacked mid-interaction
    const key = `${displayKey}|${userKey}`;
    if (key !== fitKeyRef.current) {
      fitKeyRef.current = key;
      const frame = displayed.length ? displayed : allMarkets;
      const pts = frame.filter((m) => isValidCoord(m.lat, m.lng)).map((m) => [m.lat, m.lng]);
      // Frame all results, not a potentially distant visitor location.
      if (!displayed.length && user) pts.push([user.lat, user.lng]);
      if (pts.length) {
        // A fresh filter must win over a previous pan/fly animation.
        map.stop();
        map.fitBounds(pts, { padding: [48, 48], maxZoom: 14, animate: false });
      }
    }
  }, [L, mapStatus, displayKey, userKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // selected-market pin gets the green highlight
  useEffect(() => {
    if (!L) return;
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setIcon(marketPinIcon(L, Number(id) === selectedId));
    });
  }, [L, selectedId, displayKey]);

  // user location marker (blue dot, distinct from the red market pins)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !L || mapStatus !== 'ready') return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (user && isValidCoord(user.lat, user.lng)) {
      userMarkerRef.current = L.marker([user.lat, user.lng], {
        icon: userDotIcon(L),
        title: 'Your location',
        alt: 'Your location',
        zIndexOffset: 500,
      }).addTo(map);
    }
  }, [L, mapStatus, userKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // a fresh selection (card click, marker click or chatbot request) → fly to
  // the marker and open its popup; each nonce is consumed exactly once
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selection || selection.nonce === lastFocusNonce) return;
    const marker = markersRef.current[selection.id];
    if (!marker) return; // not ready yet — the nonce stays unconsumed
    lastFocusNonce = selection.nonce;
    if (!marker.isPopupOpen()) {
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.6 });
      marker.openPopup();
    }
  }, [selection, mapStatus, displayKey]);

  // the chatbot can ask for a specific market's popup ("map of riverside");
  // one-shot: apply and clear, so closing it or toggling views never re-opens it
  useEffect(() => {
    if (!popupRequest) return;
    const id = Number(popupRequest.id);
    if (mapStatus === 'ready') {
      if (onSelectRef.current) onSelectRef.current(id);
    } else {
      pendingFocusRef.current = id; // map still loading — apply once ready
    }
    if (onPopupConsumed) onPopupConsumed();
  }, [popupRequest, onPopupConsumed, mapStatus]);

  useEffect(() => {
    if (mapStatus === 'ready' && pendingFocusRef.current != null) {
      const id = pendingFocusRef.current;
      pendingFocusRef.current = null;
      if (onSelectRef.current) onSelectRef.current(id);
    }
  }, [mapStatus]);

  const closest = nearInfo ? nearInfo.sorted[0] : null;

  return (
    <div
      className="ffmap"
      id="ffmap"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && mapRef.current) mapRef.current.closePopup();
      }}
    >
      <div ref={containerRef} className="ffmap-canvas" role="application" aria-label="Map of farmers' markets" />

      {mapStatus === 'loading' && (
        <div className="ffmap-state"><Icon name="map" size={18} /> Loading map…</div>
      )}
      {mapStatus === 'error' && (
        <div className="ffmap-state"><Icon name="alert" size={18} /> The map could not be loaded. The market list below is still available.</div>
      )}

      {mapStatus === 'ready' && (
        <div className="ffmap-chip d-flex flex-column gap-1">
          <span>
            <Icon name="pin" size={13} />{' '}
            {displayed.length}
            {` matching market${displayed.length !== 1 ? 's' : ''}`}{' '}
            · tap a marker
          </span>
          <span className="ffmap-legend">
            <i className="lg-pin" /> Market{user ? <>&nbsp;<i className="lg-you" /> You</> : ''}
          </span>
          {geo.loading && (
            <span style={{ color: '#4e7357' }}><Icon name="nav" size={13} /> Requesting your location…</span>
          )}
          {!geo.loading && user && closest && (
            <span style={{ color: '#4e7357' }}>
              <Icon name="nav" size={13} /> closest match ~{fmtDist(closest.d)} away
            </span>
          )}
          {!geo.loading && !user && geo.error && (
            <span style={{ color: '#8c5a3c' }}><Icon name="alert" size={13} /> {geo.error} — showing matching markets</span>
          )}
        </div>
      )}
    </div>
  );
}
