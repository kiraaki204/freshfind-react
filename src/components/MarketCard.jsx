import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/time.js';
import { imgPath } from '../utils/markets.js';
import Icon from './Icon.jsx';
import StatusBadge from './StatusBadge.jsx';
import SaveButton from './SaveButton.jsx';

export default function MarketCard({ market, compact = false }) {
  const navigate = useNavigate();
  const m = market;

  return (
    <article className="m-card">
      <div className={`thumb${compact ? ' compact' : ''}`}>
        <img src={imgPath(m.image)} alt={m.name} loading="lazy" />
        <div className="heart-abs">
          <SaveButton item={{ id: `market-${m.id}`, type: 'market', name: m.name, location: m.location }} />
        </div>
        <div className="status-abs">
          <StatusBadge market={m} />
        </div>
        {m.tags.includes('Organic') && (
          <div className="org-abs">
            <span className="chip" style={{ background: '#16a34a', color: '#fff', border: 'none' }}>Organic</span>
          </div>
        )}
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <h3 className="h6 mb-0 line-2">{m.name}</h3>
          <span className="small text-nowrap" style={{ color: '#d97706' }}>
            <Icon name="star" size={14} /> {m.rating}
          </span>
        </div>
        <div className="small text-muted mb-1">
          <Icon name="pin" size={14} /> {m.location}, {m.area}
        </div>
        <div className="small text-muted mb-2">
          <Icon name="clock" size={14} /> {m.days.join(', ')} · {formatTime(m.openingTime)} – {formatTime(m.closingTime)}
        </div>
        {!compact && <p className="small text-muted line-2">{m.shortDescription}</p>}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {m.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
        <button className="btn-green w-100 mt-auto" onClick={() => navigate(`/markets/${m.id}`)}>
          View Details <Icon name="chevron" size={16} />
        </button>
      </div>
    </article>
  );
}
