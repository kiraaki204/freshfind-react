import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import produceData from '../data/produce.json';
import { formatTime } from '../utils/time.js';
import { nearbyMarkets, visibleMarkets, fmtDist } from '../utils/geo.js';
import { useGeolocation } from '../hooks/useGeolocation.jsx';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import Icon from './Icon.jsx';
import StatusBadge from './StatusBadge.jsx';

/* Self-contained, data-driven map: every marker is projected from the real
   lat/lng stored in the market data (no invented coordinates), the user's
   own position only ever comes from the browser geolocation API, and all
   cards / pop-ups render from the same market + produce data the rest of
   the site uses. The decorative street-map background makes no geographic
   claims. */

function computeMapView(list, user) {
  const lats = list.map((m) => m.lat);
  const lngs = list.map((m) => m.lng);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  let userNear = false;
  if (user) {
    // a granted live location is ALWAYS honoured: the frame includes the
    // user so the map is centred on their area with the markets in view
    userNear = nearbyMarkets(list, user).near.length > 0;
    minLat = Math.min(minLat, user.lat);
    maxLat = Math.max(maxLat, user.lat);
    minLng = Math.min(minLng, user.lng);
    maxLng = Math.max(maxLng, user.lng);
  }
  const padLat = Math.max((maxLat - minLat) * 0.22, 0.008);
  const padLng = Math.max((maxLng - minLng) * 0.22, 0.008);
  minLat -= padLat; maxLat += padLat;
  minLng -= padLng; maxLng += padLng;

  const cy = (minLat + maxLat) / 2;
  const kx = Math.cos((cy * Math.PI) / 180);
  const span = Math.max(maxLat - minLat, (maxLng - minLng) * kx);
  return { cx: (minLng + maxLng) / 2, cy, kx, span, userNear };
}

function MapBackground() {
  return (
    <svg className="ffmap-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect width="100" height="100" fill="#eaf3e7" />
      <ellipse cx="12" cy="86" rx="26" ry="20" fill="#dbeafe" opacity=".8" />
      <ellipse cx="88" cy="10" rx="20" ry="14" fill="#d1fae5" />
      <ellipse cx="70" cy="78" rx="16" ry="11" fill="#d1fae5" opacity=".8" />
      <g stroke="#ffffff" strokeWidth="2.6" opacity=".9">
        <path d="M -5 30 H 105" /><path d="M -5 62 H 105" /><path d="M 26 -5 V 105" /><path d="M 64 -5 V 105" /><path d="M -5 88 L 105 44" />
      </g>
      <g stroke="#ffffff" strokeWidth="1.1" opacity=".8">
        <path d="M -5 14 H 105" /><path d="M -5 46 H 105" /><path d="M -5 78 H 105" />
        <path d="M 10 -5 V 105" /><path d="M 44 -5 V 105" /><path d="M 82 -5 V 105" />
      </g>
      <g stroke="#fde68a" strokeWidth="1.6" opacity=".7">
        <path d="M -5 52 L 105 20" /><path d="M 48 -5 L 74 105" />
      </g>
    </svg>
  );
}

export default function MarketMap({ markets, popupRequest = null }) {
  const navigate = useNavigate();
  const { geo } = useGeolocation();
  const { toggleBookmark } = useBookmarks();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ dx: 0, dy: 0 });
  const [openId, setOpenId] = useState(popupRequest ? Number(popupRequest.id) : null);

  // the chatbot can ask for a specific market's pop-up ("map of riverside")
  useEffect(() => {
    if (popupRequest) setOpenId(Number(popupRequest.id));
  }, [popupRequest]);

  const boxRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClick = useRef(false);

  const user = geo.granted && geo.lat != null ? { lat: geo.lat, lng: geo.lng } : null;
  const { displayed, focused, nearInfo } = visibleMarkets(markets, user);
  const view = computeMapView(displayed, user);

  const project = (lat, lng) => {
    const cx = view.cx + pan.dx / zoom;
    const cy = view.cy + pan.dy / zoom;
    const span = view.span / zoom;
    return {
      x: 50 + (((lng - cx) * view.kx) / span) * 100,
      y: 50 - ((lat - cy) / span) * 100,
    };
  };

  const onPointerDown = (e) => {
    if (e.target.closest('button, .ffmap-popup')) return;
    dragRef.current = { x: e.clientX, y: e.clientY, dx: pan.dx, dy: pan.dy, moved: false };
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) drag.moved = true;
    if (!drag.moved) return;
    setPan({
      dx: drag.dx - ((e.clientX - drag.x) / rect.width) * (view.span / zoom),
      dy: drag.dy + ((e.clientY - drag.y) / rect.height) * (view.span / zoom),
    });
  };

  const onPointerUp = () => {
    if (dragRef.current && dragRef.current.moved) {
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 0);
    }
    dragRef.current = null;
  };

  const zoomBy = (kind) => {
    if (kind === 'in') setZoom((z) => Math.min(8, z * 1.5));
    else if (kind === 'out') setZoom((z) => Math.max(1, z / 1.5));
    else { setZoom(1); setPan({ dx: 0, dy: 0 }); }
  };

  // position markers, nudging visually-overlapping pins apart (display only —
  // the underlying coordinates stay exactly as stored in the data)
  const placed = [];
  const markers = displayed
    .map((m) => {
      let p = project(m.lat, m.lng);
      if (p.x < -4 || p.x > 104 || p.y < -4 || p.y > 104) return null;
      const dxs = [0, 4.5, -4.5, 0, 4.5, -4.5, 9, -9];
      const dys = [0, -6, -6, 7, 7, 7, 0, 0];
      for (let i = 0; i < dxs.length; i += 1) {
        const nx = p.x + dxs[i];
        const ny = p.y + dys[i];
        if (placed.every((o) => Math.abs(o.x - nx) > 4 || Math.abs(o.y - ny) > 4)) {
          p = { x: nx, y: ny };
          break;
        }
      }
      placed.push(p);
      return { m, p };
    })
    .filter(Boolean);

  const openMarket = openId != null ? displayed.find((m) => m.id === openId) : null;
  const closest = nearInfo ? nearInfo.sorted[0] : null;

  return (
    <div
      className="ffmap"
      id="ffmap"
      ref={boxRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => { dragRef.current = null; }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && openId != null) setOpenId(null);
      }}
      onClick={(e) => {
        if (suppressClick.current) return;
        if (!e.target.closest('button') && !e.target.closest('.ffmap-popup')) setOpenId(null);
      }}
    >
      <MapBackground />

      <div className="ffmap-ctl">
        <button aria-label="Zoom in" onClick={() => zoomBy('in')}>+</button>
        <button aria-label="Zoom out" onClick={() => zoomBy('out')}>−</button>
        <button aria-label="Reset view" style={{ fontSize: 12 }} onClick={() => zoomBy('reset')}>⌂</button>
      </div>

      <div className="ffmap-chip d-flex flex-column gap-1">
        <span>
          <Icon name="pin" size={13} />{' '}
          {displayed.length}
          {focused && displayed.length !== markets.length
            ? ` nearby market${displayed.length !== 1 ? 's' : ''} (of ${markets.length})`
            : ` market${displayed.length !== 1 ? 's' : ''}`}{' '}
          · tap a marker
        </span>
        <span className="ffmap-legend">
          <i className="lg-pin" /> Market{user ? <>&nbsp;<i className="lg-you" /> You</> : ''}
        </span>
        {geo.loading && (
          <span style={{ color: '#1d4ed8' }}><Icon name="nav" size={13} /> Requesting your location…</span>
        )}
        {!geo.loading && user && closest && (
          <span style={{ color: '#2563eb' }}>
            <Icon name="nav" size={13} /> centred on your location
            {view.userNear ? '' : ` · closest market ~${fmtDist(closest.d)} away`}
          </span>
        )}
        {!geo.loading && !user && geo.error && (
          <span style={{ color: '#b45309' }}><Icon name="alert" size={13} /> {geo.error} — showing all markets</span>
        )}
      </div>

      {markers.map(({ m, p }) => (
        <button
          key={m.id}
          className={`ffmap-marker${openId === m.id ? ' active' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={m.name}
          title={m.name}
          onClick={() => setOpenId(m.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C7.9 2 4.5 5.3 4.5 9.4c0 5.4 7.5 12.6 7.5 12.6s7.5-7.2 7.5-12.6C19.5 5.3 16.1 2 12 2z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="12" cy="9.4" r="2.7" fill="#fff" />
          </svg>
          <span className="ffmap-tag">{m.name.split(' ').slice(0, 2).join(' ')}</span>
        </button>
      ))}

      {user && (() => {
        const up = project(user.lat, user.lng);
        return (
          <div className="ffmap-user" style={{ left: `${up.x}%`, top: `${up.y}%` }} title="Your location">
            <span /><em className="ffmap-user-tag">You</em>
          </div>
        );
      })()}

      {openMarket && (() => {
        const pos = project(openMarket.lat, openMarket.lng);
        const items = produceData.filter((p) => openMarket.produce.includes(p.id));
        const below = pos.y < 46;
        const left = Math.max(18, Math.min(82, pos.x));
        return (
          <div
            className={`ffmap-popup${below ? ' below' : ''}`}
            style={{ left: `${left}%`, top: `${pos.y}%` }}
            role="dialog"
            aria-label={openMarket.name}
          >
            <button className="icon-btn position-absolute top-0 end-0 m-1 p-1" aria-label="Close pop-up" onClick={() => setOpenId(null)}>
              <Icon name="x" size={14} />
            </button>
            <h3 className="h6 mb-1 pe-3">{openMarket.name}</h3>
            <div className="mb-2"><StatusBadge market={openMarket} /></div>
            <div className="small text-muted mb-1"><Icon name="pin" size={13} /> {openMarket.address}</div>
            <div className="small text-muted mb-2">
              <Icon name="clock" size={13} /> {openMarket.days.join(', ')} · {formatTime(openMarket.openingTime)} – {formatTime(openMarket.closingTime)}
            </div>
            {items.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mb-2">
                {items.slice(0, 6).map((p) => (
                  <span key={p.id} className="chip" title={p.name}>{p.emoji} {p.name}</span>
                ))}
                {items.length > 6 && <span className="chip">+{items.length - 6}</span>}
              </div>
            )}
            <div className="d-flex gap-1">
              <button className="btn-green py-1 px-2 flex-grow-1" style={{ fontSize: 12 }} onClick={() => navigate(`/markets/${openMarket.id}`)}>
                View Details <Icon name="chevron" size={13} />
              </button>
              <button
                className="btn-outline-green py-1 px-2"
                style={{ fontSize: 12 }}
                onClick={() => toggleBookmark({ id: `market-${openMarket.id}`, type: 'market', name: openMarket.name, location: openMarket.location })}
              >
                <Icon name="heart" size={13} /> Save
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
