import { useState } from 'react';
import produceData from '../data/produce.json';
import { getCurrentSeason } from '../utils/time.js';
import { PRODUCE_CATEGORIES } from '../utils/produce.js';
import { useProduceFilters } from '../hooks/useProduceFilters.jsx';
import { useProduceModal } from '../hooks/useProduceModal.jsx';
import Icon from './Icon.jsx';
import ProduceCard from './ProduceCard.jsx';

const CURATED_COUNT = 8;

/** Curated produce discovery on the homepage; the shared ProduceFilters
    context drives category/search/season so chatbot and deep links work. */
export default function ProduceSection() {
  const { filters, update } = useProduceFilters();
  const { openProduce } = useProduceModal();
  const [expanded, setExpanded] = useState(false);

  const seasonNow = getCurrentSeason();
  const inSeason = produceData.filter((p) => p.season.includes(seasonNow));

  let items = produceData.slice();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((p) =>
      (p.name + p.category + p.description).toLowerCase().indexOf(q) !== -1);
  }
  if (filters.category !== 'All') items = items.filter((p) => p.category === filters.category);
  if (filters.season !== 'All') items = items.filter((p) => p.season.includes(filters.season));

  const filtered = Boolean(filters.search) || filters.category !== 'All' || filters.season !== 'All';
  if (!filtered) {
    items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
  const visible = expanded || filtered ? items : items.slice(0, CURATED_COUNT);
  const hasActiveRefinements = Boolean(filters.search) || filters.season !== 'All';

  return (
    <section id="produce-section" className="py-5" style={{ background: '#f0fdf4' }} aria-labelledby="produce-heading">
      <div className="container" style={{ maxWidth: '80rem' }}>
        <div className="mb-3">
          <h2 id="produce-heading" className="h4 mb-1">Fresh Finds, Just for You</h2>
          <p className="text-muted small mb-0">
            Explore seasonal produce and discover what's fresh at your local markets.
          </p>
        </div>

        {inSeason.length > 0 && (
          <p className="small mb-3 d-flex flex-wrap align-items-center gap-1">
            <span className="text-muted me-1"><Icon name="sun" size={14} /> In season now ({seasonNow}):</span>
            {inSeason.slice(0, 5).map((p) => (
              <button key={p.id} className="chip chip-link" onClick={() => openProduce(p.id)}>
                {p.emoji} {p.name}
              </button>
            ))}
            {inSeason.length > 5 && <span className="text-muted">+{inSeason.length - 5} more</span>}
          </p>
        )}

        <div className="d-flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter produce by category">
          {PRODUCE_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-tab${filters.category === c ? ' on' : ''}`}
              aria-pressed={filters.category === c}
              onClick={() => update({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>

        {hasActiveRefinements && (
          <p className="small mb-3">
            <span className="text-muted">
              Showing results{filters.search ? ` for "${filters.search}"` : ''}
              {filters.season !== 'All' ? ` in ${filters.season}` : ''}.
            </span>{' '}
            <button className="btn btn-link p-0 small" style={{ color: '#15803d' }} onClick={() => update({ search: '', season: 'All' })}>
              Clear
            </button>
          </p>
        )}

        {visible.length > 0 ? (
          <div className="row g-3">
            {visible.map((p) => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProduceCard produce={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h3 className="h6">No produce found</h3>
            <p className="small text-muted mb-2">Try a different search or category.</p>
            <button className="btn-green" onClick={() => update({ search: '', category: 'All', season: 'All' })}>
              Clear Filters
            </button>
          </div>
        )}

        {!filtered && items.length > visible.length && !expanded && (
          <div className="text-center mt-4">
            <button className="btn-outline-green" onClick={() => setExpanded(true)}>
              Explore All Produce <Icon name="chevron" size={16} />
            </button>
          </div>
        )}
        {expanded && !filtered && (
          <div className="text-center mt-4">
            <button className="btn-outline-green" onClick={() => setExpanded(false)}>
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
