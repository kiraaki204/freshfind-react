import markets from '../data/markets.json';
import { useProduceModal } from '../hooks/useProduceModal.jsx';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';

export default function ProduceCard({ produce }) {
  const { openProduce } = useProduceModal();
  const p = produce;
  const marketCount = markets.filter((m) => p.markets.includes(m.id)).length;

  return (
    <article
      className="m-card"
      onClick={(e) => { if (!e.target.closest('button, a')) openProduce(p.id); }}
      onKeyDown={(e) => { if (e.key === 'Enter' && !e.target.closest('button, a')) openProduce(p.id); }}
      tabIndex={0}
      aria-label={`View details for ${p.name}`}
    >
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
        {marketCount > 0 && (
          <p className="small text-muted">Available at {marketCount} market{marketCount > 1 ? 's' : ''}</p>
        )}
        <button className="btn-outline-green w-100 mt-auto" onClick={() => openProduce(p.id)}>
          View Details <Icon name="chevron" size={16} />
        </button>
      </div>
    </article>
  );
}
