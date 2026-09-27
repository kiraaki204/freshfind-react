import { useState } from 'react';
import markets from '../data/markets.json';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';
import { useProduceDetailModal } from '../hooks/useProduceDetailModal.jsx';

export default function ProduceCard({ produce, onSelect, variant = 'default' }) {
  const { openProduce } = useProduceDetailModal();
  const p = produce;
  const marketCount = markets.filter((m) => p.markets.includes(m.id)).length;
  const [imgError, setImgError] = useState(false);
  const showImage = p.image && !imgError;

  const handleSelect = () => {
    // details open in the shared produce modal, not a separate page
    if (onSelect) onSelect(p);
    else openProduce(p.id);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(); } }}
      className={`ff-produce-card${variant === 'browse' ? ' browse' : ''}`}
      data-cat={p.category}
      onClick={(e) => { if (!e.target.closest('button, a')) handleSelect(); }}
    >
      <div className="produce-img-wrap">
        <span className="tape produce-tape tape-lime" aria-hidden="true" />
        {showImage ? (
          <img
            src={p.image}
            alt=""
            loading="lazy"
            className="produce-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="produce-emoji-fallback" aria-hidden="true">
            <span>{p.emoji}</span>
          </div>
        )}
        <button
          type="button"
          className="image-details-overlay"
          aria-label={`View more details about ${p.name}`}
          onClick={handleSelect}
        >
          <span>View more details <Icon name="chevron" size={18} /></span>
        </button>
        <div className="heart-abs">
          <SaveButton size="sm" item={{ id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category }} />
        </div>
        <span className="produce-cat-chip">{p.category}</span>
      </div>
      <div className="produce-card-body">
        <div className="produce-card-head-row">
          <h3 className="produce-card-title"><span aria-hidden="true">{p.emoji}</span> {p.name}</h3>
        </div>
        <p className="produce-card-desc">{p.description}</p>
        {marketCount > 0 && (
          <p className="produce-card-meta">
            <Icon name="pin" size={12} /> Available at {marketCount} market{marketCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </article>
  );
}
