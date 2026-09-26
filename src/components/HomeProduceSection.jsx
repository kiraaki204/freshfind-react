import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import produceData from '../data/produce.json';
import Icon from './Icon.jsx';
import ProduceCard from './ProduceCard.jsx';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Dairy', 'Baked Goods'];

export default function HomeProduceSection() {
  const navigate = useNavigate();
  const [active, setActive] = useState('All');

  const items = useMemo(() => {
    const filtered = active === 'All' ? produceData : produceData.filter((p) => p.category === active);
    // prefer featured, then by name, limit to 8 for a compact homepage preview
    const sorted = [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
    return sorted.slice(0, 8);
  }, [active]);

  return (
    <section id="produce" className="home-produce" aria-labelledby="produce-heading">
      <div className="container" style={{ maxWidth: '80rem' }}>
        <div className="produce-head">
          <div className="produce-head-text">
            <div className="produce-eyebrow">
              <span className="produce-eyebrow-dot" aria-hidden="true" />
              Seasonal & local
            </div>
            <h2 id="produce-heading" className="produce-title">What&apos;s fresh near you</h2>
            <p className="produce-subtitle">
              From just-picked vegetables to artisan breads — explore what local growers bring to market each week.
            </p>
          </div>
          <button className="btn-outline-green produce-cta-desktop" onClick={() => navigate('/produce')}>
            View all produce <Icon name="chevron" size={16} />
          </button>
        </div>

        <div className="produce-filters" role="tablist" aria-label="Filter produce by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              className={`produce-tab${active === c ? ' on' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="row g-3 g-md-4">
          {items.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProduceCard produce={p} />
            </div>
          ))}
        </div>

        <div className="produce-foot">
          <p className="small text-muted mb-3" style={{ fontSize: 13 }}>
            Showing {items.length} of {active === 'All' ? produceData.length : produceData.filter((p) => p.category === active).length} {active === 'All' ? '' : active.toLowerCase()} items
            {active !== 'All' ? ` · ` : ' '}
            {active !== 'All' && (
              <button className="btn btn-link p-0 text-decoration-none small" style={{ color: '#15803d' }} onClick={() => setActive('All')}>Show all</button>
            )}
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <button className="btn-green" onClick={() => navigate('/produce')}>
              <Icon name="sprout" size={18} /> Browse the full Produce Guide
            </button>
            <button className="btn-outline-green produce-cta-mobile" onClick={() => navigate('/markets')}>
              <Icon name="store" size={18} /> Find markets that carry it
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
