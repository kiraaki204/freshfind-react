import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/time.js';
import { imgPath, tagDestination } from '../utils/markets.js';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import Icon from './Icon.jsx';
import StatusBadge from './StatusBadge.jsx';
import SaveButton from './SaveButton.jsx';

export default function MarketCard({ market, compact = false, selected = false, onSelect }) {
  const navigate = useNavigate();
  const { openMarket } = useMarketModal();
  const m = market;

  // in the directory's map view a card click focuses the marker;
  // everywhere else it opens the market detail modal
  const cardAction = onSelect || (() => openMarket(m.id));

  return (
    <article
      className={`m-card${selected ? ' selected' : ''}${onSelect ? ' selectable' : ''}`}
      onClick={(e) => { if (!e.target.closest('button, a')) cardAction(); }}
      onKeyDown={(e) => { if (e.key === 'Enter' && !e.target.closest('button, a')) cardAction(); }}
      tabIndex={0}
      aria-label={onSelect ? `Show ${m.name} on the map` : `View details for ${m.name}`}
    >
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
            <button
              className="chip"
              style={{ background: '#16a34a', color: '#fff', border: 'none' }}
              aria-label="Browse the Produce Guide"
              onClick={(e) => { e.stopPropagation(); navigate(tagDestination('Organic')); }}
            >
              Organic
            </button>
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
            <button
              key={tag}
              className="chip chip-link"
              aria-label={`Browse ${tag} in the Produce Guide`}
              onClick={(e) => { e.stopPropagation(); navigate(tagDestination(tag)); }}
            >
              {tag}
            </button>
          ))}
        </div>
        <button className="btn-green w-100 mt-auto" onClick={() => openMarket(m.id)}>
          View Details <Icon name="chevron" size={16} />
        </button>
      </div>
    </article>
  );
}
