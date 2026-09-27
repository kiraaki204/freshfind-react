import { useState, useMemo, useRef } from 'react';
import produceData from '../data/produce.json';
import Icon from './Icon.jsx';
import ProduceCard from './ProduceCard.jsx';
import ProductBrowseModal from './ProductBrowseModal.jsx';
import ProduceDetailModal from './ProduceDetailModal.jsx';
import { LeafSprig, Vine, TomatoDoodle, FlowerDoodle, Squiggle } from './Doodles.jsx';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Dairy', 'Baked Goods'];

export default function HomeProduceSection() {
  const [active, setActive] = useState('All');
  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseCategory, setBrowseCategory] = useState('All');
  const [browseSearch, setBrowseSearch] = useState('');
  const [detailProduce, setDetailProduce] = useState(null);
  const exploreRef = useRef(null);

  const items = useMemo(() => {
    const filtered = active === 'All' ? produceData : produceData.filter((p) => p.category === active);
    const sorted = [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
    return sorted.slice(0, 8);
  }, [active]);

  const openBrowse = () => {

    if (active !== 'All' && browseCategory === 'All' && !browseSearch) {
      setBrowseCategory(active);
    }
    setBrowseOpen(true);
  };

  const closeBrowse = () => {
    setBrowseOpen(false);

    setTimeout(() => exploreRef.current?.focus(), 60);
  };

  const handleSelect = (produce) => {
    setDetailProduce(produce);
  };




  return (
    <>
      <section id="produce" className="home-produce" aria-labelledby="produce-heading">

        <div className="produce-deco produce-deco--leaf" aria-hidden="true">
          <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="#8fae90" strokeWidth="1.2" strokeLinecap="round">
            <path d="M60 10 C30 28 18 52 60 108 C102 52 90 28 60 10Z" opacity="0.12" />
            <path d="M60 22 C42 38 36 58 60 78 C84 58 78 38 60 22Z" opacity="0.14" />
            <path d="M60 18 L60 96" opacity="0.10" />
            <path d="M38 44 Q50 48 60 52" opacity="0.10" />
            <path d="M82 44 Q70 48 60 52" opacity="0.10" />
          </svg>
        </div>
        <div className="produce-deco produce-deco--herb" aria-hidden="true">
          <svg viewBox="0 0 140 80" width="140" height="80" fill="none" stroke="#8fae90" strokeWidth="1.1">
            <path d="M10 70 Q30 20 70 36 T130 18" opacity="0.09" />
            <path d="M28 58 Q34 42 38 32" opacity="0.10" />
            <path d="M52 48 Q58 30 62 22" opacity="0.10" />
            <path d="M88 40 Q96 28 102 20" opacity="0.10" />
            <path d="M36 32 Q28 30 22 36" opacity="0.07" />
            <path d="M62 22 Q56 20 50 26" opacity="0.07" />
          </svg>
        </div>
        <div className="produce-deco produce-deco--tomato" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="90" height="90" fill="none" stroke="#d97706" strokeWidth="1.1">
            <circle cx="50" cy="58" r="22" opacity="0.08" />
            <path d="M42 36 Q50 28 58 36 L54 42 Q50 38 46 42Z" opacity="0.09" />
            <path d="M36 64 Q40 78 50 80 Q60 78 64 64" opacity="0.07" />
          </svg>
        </div>

        <div className="container" style={{ maxWidth: '80rem', position: 'relative', zIndex: 1 }}>
          <div className="produce-journal-head">
            <div className="produce-journal-label">
              <span className="produce-journal-line" aria-hidden="true" />
              <span>fresh from the stalls ~ No. 04</span>
              <span className="produce-journal-line" aria-hidden="true" />
            </div>
            <div className="produce-title-wrap">
              <h2 id="produce-heading" className="produce-title">
                <span className="produce-title-script">mmm, what&rsquo;s fresh</span>
                <span className="produce-title-main">near <span className="hl">you</span></span>
              </h2>
              <div className="produce-title-underline" aria-hidden="true">
                <Squiggle width={220} height={16} />
              </div>
              <p className="produce-subtitle">
                A small, curated selection from this week’s growers — not the whole catalogue, just the standouts we’d put on the market table.
              </p>
            </div>
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
            <span className="produce-filter-note" aria-hidden="true">
              <Icon name="leaf" size={12} /> {items.length} picks
            </span>
          </div>

          <div className="row g-3 g-md-4 produce-grid">
            {items.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProduceCard produce={p} onSelect={handleSelect} />
              </div>
            ))}
          </div>

          <div className="produce-foot">
            <p className="produce-foot-note">
              Showing <strong>{items.length}</strong> of <strong>{active === 'All' ? produceData.length : produceData.filter((x) => x.category === active).length}</strong>
              {active !== 'All' ? ` ${active.toLowerCase()}` : ' seasonal'} highlights
              {active !== 'All' && (
                <>
                  {' · '}
                  <button className="btn btn-link p-0 text-decoration-none small" style={{ color: 'var(--leaf)' }} onClick={() => setActive('All')}>
                    Show all
                  </button>
                </>
              )}
            </p>
            <button
              ref={exploreRef}
              className="btn-green produce-explore-btn"
              onClick={openBrowse}
              aria-haspopup="dialog"
            >
              <span className="produce-explore-icon"><Icon name="basket" size={18} /></span>
              Explore More Products
              <Icon name="chevron" size={16} />
            </button>
            <p className="produce-foot-hint">Opens the full browsing journal — no new page, just the collection.</p>
          </div>
        </div>
      </section>

      <ProductBrowseModal
        open={browseOpen}
        onClose={closeBrowse}
        search={browseSearch}
        setSearch={setBrowseSearch}
        category={browseCategory}
        setCategory={setBrowseCategory}
        onSelectProduce={(p) => {
          setDetailProduce(p);
        }}
      />
      <ProduceDetailModal produce={detailProduce} onClose={() => setDetailProduce(null)} />
    </>
  );
}
