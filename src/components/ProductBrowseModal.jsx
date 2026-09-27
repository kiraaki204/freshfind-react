import { useEffect, useRef } from 'react';
import produceData from '../data/produce.json';
import Icon from './Icon.jsx';
import ProduceCard from './ProduceCard.jsx';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Flowers', 'Other'];

export default function ProductBrowseModal({ open, onClose, search, setSearch, category, setCategory, onSelectProduce }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus search if empty, otherwise close button
    setTimeout(() => {
      if (searchRef.current && !search) searchRef.current.focus();
      else closeRef.current?.focus();
    }, 60);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = Array.from(dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [open, onClose, search]);

  if (!open) return null;

  const q = search.trim().toLowerCase();
  let items = produceData.slice();
  if (q) {
    items = items.filter((p) => (p.name + p.category + p.description).toLowerCase().includes(q));
  }
  if (category !== 'All') items = items.filter((p) => p.category === category);

  const clearAll = () => {
    setSearch('');
    setCategory('All');
  };

  return (
    <div className="mm-backdrop product-browse-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="mm-dialog product-browse-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="browse-title"
        ref={dialogRef}
      >
        <header className="browse-head">
          <div className="browse-head-text">
            <div className="browse-eyebrow"><span className="browse-dot" aria-hidden="true" /> FreshFind market journal</div>
            <h2 id="browse-title" className="browse-title">Explore All Produce</h2>
            <p className="browse-intro">Browse the full collection of {produceData.length} market finds — filtered by what you’re craving.</p>
          </div>
          <button ref={closeRef} className="icon-btn browse-close" aria-label="Close browsing" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="browse-toolbar">
          <div className="search-wrap browse-search">
            <span className="s-ico"><Icon name="search" size={18} /></span>
            <input
              ref={searchRef}
              className="form-control"
              placeholder="Search tomatoes, carrots, bread…"
              aria-label="Search produce"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 12 }}
            />
            {search && (
              <button className="browse-clear" aria-label="Clear search" onClick={() => setSearch('')}>
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
          <div className="browse-filters" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`produce-tab${category === c ? ' on' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="browse-count">
            <span className="small text-muted">
              <strong className="text-dark">{items.length}</strong> of <strong className="text-dark">{produceData.length}</strong> items
              {category !== 'All' || q ? (
                <button className="btn btn-link p-0 ms-2 text-decoration-none small" style={{ color: 'var(--leaf)' }} onClick={clearAll}>Clear filters</button>
              ) : null}
            </span>
          </div>
        </div>

        <div className="browse-body">
          {items.length > 0 ? (
            <div className="row g-3 g-md-4">
              {items.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProduceCard produce={p} variant="browse" onSelect={onSelectProduce} />
                </div>
              ))}
            </div>
          ) : (
            <div className="browse-empty">
              <div className="browse-empty-icon"><Icon name="search" size={28} /></div>
              <h3 className="h6 mt-3">No produce found</h3>
              <p className="small text-muted mb-3" style={{ maxWidth: '24rem', margin: '0 auto' }}>
                No items match “{search}”{category !== 'All' ? ` in ${category}` : ''}. Try a different search or clear the filters.
              </p>
              <button className="btn-green" onClick={clearAll}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
