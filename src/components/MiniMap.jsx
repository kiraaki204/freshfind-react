import { useEffect, useRef, useState } from 'react';
import { loadLeaflet, addBaseTiles, isValidCoord, marketPinIcon } from '../utils/leaflet.js';
import Icon from './Icon.jsx';

/** Interactive Leaflet/OpenStreetMap map for a single address (no API key
    needed) plus a link out to Google Maps for directions. Coordinates must be
    supplied from existing app data; if they are missing/invalid the map is
    replaced by a clear notice instead of a wrong location. */
export default function MiniMap({ name, address, lat, lng }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const q = encodeURIComponent(address);

  useEffect(() => {
    if (!isValidCoord(lat, lng)) {
      setStatus('invalid');
      return undefined;
    }
    let cancelled = false;
    let map = null;
    let ro = null;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        map = L.map(containerRef.current, { scrollWheelZoom: false }); // don't trap page scrolling
        addBaseTiles(L, map);
        L.marker([lat, lng], { icon: marketPinIcon(L), title: name, alt: name })
          .addTo(map)
          .bindPopup(`<strong>${name}</strong><br>${address}`, { maxWidth: 260 });
        map.setView([lat, lng], 14);
        ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(containerRef.current);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (map) map.remove();
    };
  }, [lat, lng, name, address]);

  return (
    <>
      {status === 'invalid' ? (
        <div className="mini-map d-flex align-items-center justify-content-center text-center p-3">
          <p className="small text-muted mb-0">No valid coordinates available for this location.</p>
        </div>
      ) : (
        <div className="mini-map">
          <div ref={containerRef} className="mini-map-canvas" role="application" aria-label={`Map of ${name}`} />
          {status === 'loading' && (
            <div className="ffmap-state"><Icon name="map" size={16} /> Loading map…</div>
          )}
          {status === 'error' && (
            <div className="ffmap-state"><Icon name="alert" size={16} /> The map could not be loaded.</div>
          )}
        </div>
      )}
      <div className="mt-2">
        <a
          className="btn-green btn-sm"
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="nav" size={14} /> Get Directions
        </a>
      </div>
    </>
  );
}
