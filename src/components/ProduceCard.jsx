import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
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
        <div className="org-abs">
          <span className="chip" style={{ background: 'rgba(255,255,255,.85)', color: '#4b5563' }}>{p.category}</span>
        </div>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h3 className="h6">{p.name}</h3>
        <p className="small text-muted line-2">{p.description}</p>
        <div className="d-flex flex-wrap gap-1 mb-2">
          {p.season.map((s) => (
            <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
          ))}
        </div>
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
