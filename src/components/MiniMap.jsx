import Icon from './Icon.jsx';

/** Embedded Google map for a market address (no API key needed) plus a
    link out to Google Maps for directions. */
export default function MiniMap({ name, address }) {
  const q = encodeURIComponent(address);
  return (
    <>
      <div className="mini-map">
        <iframe
          title={`Map of ${name}`}
          src={`https://maps.google.com/maps?q=${q}&z=14&output=embed`}
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </div>
      <div className="mt-2">
        <a
          className="btn-green btn-sm"
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noopener"
        >
          <Icon name="nav" size={14} /> Get Directions
        </a>
      </div>
    </>
  );
}
