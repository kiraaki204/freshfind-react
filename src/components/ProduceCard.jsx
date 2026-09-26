import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import { hasMeaningfulSeason } from '../utils/produce.js';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';

export default function ProduceCard({ produce }) {
  const navigate = useNavigate();
  const p = produce;
  const marketCount = markets.filter((m) => p.markets.includes(m.id)).length;

  return (
    <article className="m-card">
      <div className="p-thumb">
        <span>{p.emoji}</span>
        <div className="heart-abs">
          <SaveButton size="sm" item={{ id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category }} />
        </div>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
          <h3 className="h6 mb-0">{p.name}</h3>
          <span className="chip text-nowrap">{p.category}</span>
        </div>
        <p className="small text-muted line-2">{p.description}</p>
        {hasMeaningfulSeason(p) && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {p.season.map((s) => (
              <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
            ))}
          </div>
        )}
        {marketCount > 0 && (
          <p className="small text-muted">Available at {marketCount} market{marketCount > 1 ? 's' : ''}</p>
        )}
        <button className="btn-outline-green w-100 mt-auto" onClick={() => navigate(`/produce/${p.id}`)}>
          View Details <Icon name="chevron" size={16} />
        </button>
      </div>
    </article>
  );
}
