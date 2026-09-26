import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import produceData from '../data/produce.json';
import { useProduceFilters, DEFAULT_PRODUCE_FILTERS } from '../hooks/useProduceFilters.jsx';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import ProduceCard from '../components/ProduceCard.jsx';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Flowers', 'Other'];
const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter'];
const SEASON_ICONS = { All: 'sprout', Spring: 'flower', Summer: 'sun', Autumn: 'leaf', Winter: 'snow' };

export default function ProducePage() {
  const { filters, update, replace } = useProduceFilters();
  const [searchParams, setSearchParams] = useSearchParams();

  // deep links such as /produce?category=Meat (used by market badges) select
  // the category once; the parameter is then consumed so ordinary category
  // clicks keep working without fighting the URL
  useEffect(() => {
    const raw = searchParams.get('category');
    if (!raw) return;
    const match = CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
    replace({ category: match || 'All' });
    setSearchParams({}, { replace: true });
  }, [searchParams, replace, setSearchParams]);

  let items = produceData.slice();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((p) =>
      (p.name + p.category + p.description).toLowerCase().indexOf(q) !== -1);
  }
  if (filters.category !== 'All') items = items.filter((p) => p.category === filters.category);
  if (filters.season !== 'All') items = items.filter((p) => p.season.includes(filters.season));

  return (
    <div className="wrap">
      <Breadcrumb items={[{ label: 'Produce Guide' }]} />
      <h1 className="h3 mt-3">Produce Guide</h1>
      <p className="text-muted">Explore seasonal fruits, vegetables, herbs and local products.</p>

      <div className="ff-card p-4 mb-4">
        <div className="search-wrap mb-3">
          <span className="s-ico"><Icon name="search" size={18} /></span>
          <input
            className="form-control"
            value={filters.search}
            placeholder="e.g. tomatoes, carrots..."
            style={{ borderRadius: 12 }}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>
        <p className="small text-muted mb-2">Category</p>
        <div className="d-flex flex-wrap gap-1 mb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-tab${filters.category === c ? ' on' : ''}`}
              onClick={() => update({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="small text-muted mb-2">Season</p>
        <div className="d-flex flex-wrap gap-1">
          {SEASONS.map((s) => (
            <button
              key={s}
              className={`filter-tab${filters.season === s ? ' on' : ''}`}
              onClick={() => update({ season: s })}
            >
              <Icon name={SEASON_ICONS[s]} size={14} /> {s}
            </button>
          ))}
        </div>
      </div>

      <p className="small text-muted">
        <strong className="text-dark">{items.length}</strong> produce items
      </p>

      {items.length > 0 ? (
        <div className="row g-3">
          {items.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProduceCard produce={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <h3 className="h5">No produce found</h3>
          <button className="btn-green" onClick={() => replace(DEFAULT_PRODUCE_FILTERS)}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
