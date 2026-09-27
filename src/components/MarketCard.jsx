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
      role="button"
      className={`m-card${selected ? ' selected' : ''}${onSelect ? ' selectable' : ''}`}
      onClick={(e) => { if (!e.target.closest('button, a')) cardAction(); }}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); cardAction(); } }}
      tabIndex={0}
      aria-label={onSelect ? `Show ${m.name} on the map` : `View details for ${m.name}`}
    >
      <div className={`thumb${compact ? ' compact' : ''}`}>
        <img src={imgPath(m.image)} alt={m.name} loading="lazy" />
        <button
          type="button"
          className="image-details-overlay"
          aria-label={`View more details about ${m.name}`}
          onClick={(e) => { e.stopPropagation(); openMarket(m.id); }}
        >
          <span>View more details <Icon name="chevron" size={18} /></span>
        </button>
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
              style={{ background: 'var(--forest)', color: 'var(--on-accent)', border: 'none' }}
              aria-label="Browse the Produce Guide"
              onClick={(e) => { e.stopPropagation(); navigate(tagDestination('Organic')); }}
            >
              ✿ Organic
            </button>
          </div>
        )}
      </div>
      <div className="m-card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h3 className="h6 mb-0 line-2">{m.name}</h3>
          <span className="rating-burst" aria-label={`Rated ${m.rating} out of 5`}>
            <Icon name="star" size={13} /> {m.rating}
          </span>
        </div>
        <div className="m-card-loc mb-1">
          <Icon name="pin" size={14} /> {m.location}, {m.area}
        </div>
        <div className="m-card-hours mb-2">
          <Icon name="clock" size={14} /> {m.days.join(', ')} · {formatTime(m.openingTime)} – {formatTime(m.closingTime)}
        </div>
        {!compact && <p className="small line-2" style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>{m.shortDescription}</p>}
        <div className="d-flex flex-wrap gap-1 mb-1 mt-auto pt-2">
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
      </div>
    </article>
  );
}
