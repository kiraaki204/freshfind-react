import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';
import { hasMeaningfulSeason } from '../utils/produce.js';

export default function ProduceCard({ produce, onSelect, variant = 'default' }) {
  const navigate = useNavigate();
  const p = produce;
  const marketCount = markets.filter((m) => p.markets.includes(m.id)).length;
  const [imgError, setImgError] = useState(false);
  const showImage = p.image && !imgError;

  const handleSelect = () => {
    if (onSelect) onSelect(p);
    else navigate(`/produce/${p.id}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <article
      className={`ff-produce-card${variant === 'browse' ? ' browse' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${p.name}`}
      onClick={handleSelect}
      onKeyDown={handleKey}
    >
      <div className="produce-img-wrap">
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
        <div className="produce-img-shade" aria-hidden="true" />
        <span className="produce-cat-chip">{p.category}</span>
        <div className="heart-abs">
          <SaveButton size="sm" item={{ id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category }} />
        </div>
        {hasMeaningfulSeason(p) && p.season.length <= 2 && (
          <div className="produce-season-dot" aria-hidden="true" title={p.season.join(', ')}>
            <Icon name={p.season[0] === 'Spring' ? 'flower' : p.season[0] === 'Summer' ? 'sun' : p.season[0] === 'Autumn' ? 'leaf' : 'snow'} size={12} />
          </div>
        )}
      </div>
      <div className="produce-card-body">
        <h3 className="produce-card-title">{p.name}</h3>
        <p className="produce-card-desc">{p.description}</p>
        {marketCount > 0 && (
          <p className="produce-card-meta">
            <Icon name="pin" size={12} /> Available at {marketCount} market{marketCount > 1 ? 's' : ''}
          </p>
        )}
        <span className="produce-card-cta" aria-hidden="true">
          View details <Icon name="chevron" size={14} />
        </span>
      </div>
    </article>
  );
}
