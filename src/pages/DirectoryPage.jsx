import { useEffect, useRef, useState } from 'react';
import markets from '../data/markets.json';
import { applyMarketFilters } from '../utils/markets.js';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import { useGeolocation } from '../hooks/useGeolocation.jsx';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import MarketCard from '../components/MarketCard.jsx';
import MarketMap from '../components/MarketMap.jsx';
import FilterSelect from '../components/FilterSelect.jsx';
import { LeafSprig, Vine } from '../components/Doodles.jsx';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PRODUCE_TYPES = ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Organic', 'Flowers', 'Other'];
const SORTS = [
  ['alpha', 'Alphabetically'],
  ['proximity', 'By Proximity'],
  ['next-open', 'By Next Opening'],
  ['rating', 'By Rating'],
];

export default function DirectoryPage() {
  const { filters, update, popupRequest, clearPopupRequest } = useDirectoryFilters();
  const { geo, locate } = useGeolocation();
  const [showFilters, setShowFilters] = useState(false);
  const [selection, setSelection] = useState(null); // { id, nonce }
  const cardRefs = useRef({});

  const list = applyMarketFilters(markets, filters, geo);
  const areas = [...new Set(markets.map((m) => m.area))].sort();
  const activeCount = [filters.area, filters.day, filters.produce].filter(Boolean).length;

  // drop the selection when filters/search hide the selected market
  useEffect(() => {
    if (selection && !list.some((m) => m.id === selection.id)) setSelection(null);
  }, [list, selection]);

  // marker clicked (or chatbot request) → highlight the card and reveal it;
  // the nonce makes each selection a one-shot "focus the map" instruction
  const selectMarket = (id) => {
    setSelection({ id, nonce: Date.now() });
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const renderCards = (selectable) => (
    <div className="row g-3">
      {list.map((m) => (
        <div key={m.id} className="col-sm-6 col-lg-4 col-xl-3" ref={(el) => { cardRefs.current[m.id] = el; }}>
          <MarketCard
            market={m}
            selected={selectable && selection != null && m.id === selection.id}
            onSelect={selectable ? () => selectMarket(m.id) : undefined}
          />
        </div>
      ))}
    </div>
  );

  const clearAll = () => {
    update({ search: '', area: '', day: '', produce: '', sort: 'alpha', view: 'list' });
    setShowFilters(true);
  };

  const nearMe = () => {
    locate((user) => {
      if (user) update({ sort: 'proximity' });
    });
  };

  return (
    <div className="wrap">
      <Breadcrumb items={[{ label: 'Market Directory' }]} />
      <h1 className="h3 mt-3">Market Directory</h1>
      <p className="text-muted">Find and explore farmers' markets in your area.</p>

      <div className="ff-card p-3 mb-4">
        <div className="d-flex flex-column flex-sm-row gap-2 mb-2">
          <div className="search-wrap flex-grow-1">
            <span className="s-ico"><Icon name="search" size={18} /></span>
            <input
              className="form-control"
              aria-label="Search the market directory"
              value={filters.search}
              placeholder="Search markets, locations or produce..."
              style={{ borderRadius: 12 }}
              onChange={(e) => update({ search: e.target.value })}
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn-outline-green" onClick={() => setShowFilters((s) => !s)}>
              <Icon name="sliders" size={16} /> Filters{' '}
              {activeCount > 0 && <span className="count-badge position-static d-inline-flex">{activeCount}</span>}
            </button>
            <button className="btn-outline-green" onClick={nearMe}>
              <Icon name="nav" size={16} /> {geo.loading ? 'Finding...' : 'Near Me'}
            </button>
          </div>
        </div>

        {geo.error && <div className="alert alert-warning py-2 small">{geo.error}</div>}
        {geo.granted && <div className="alert alert-success py-2 small">Location found! Markets sorted by proximity.</div>}

        {showFilters && (
          <div className="row g-2 pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
            <div className="col-12 col-sm-6 col-lg-3">
              <FilterSelect
                label="Location / Area"
                value={filters.area}
                options={[{ value: '', label: 'All Areas' }, ...areas.map((a) => ({ value: a, label: a }))]}
                onChange={(v) => update({ area: v })}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <FilterSelect
                label="Day of Week"
                value={filters.day}
                options={[{ value: '', label: 'All Days' }, ...DAYS.map((d) => ({ value: d, label: d }))]}
                onChange={(v) => update({ day: v })}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <FilterSelect
                label="Produce Type"
                value={filters.produce}
                options={[{ value: '', label: 'All Types' }, ...PRODUCE_TYPES.map((p) => ({ value: p, label: p }))]}
                onChange={(v) => update({ produce: v })}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <FilterSelect
                label="Sort By"
                value={filters.sort}
                options={SORTS.map(([value, label]) => ({ value, label }))}
                onChange={(v) => update({ sort: v })}
              />
            </div>
            {activeCount > 0 && (
              <div className="col-12">
                <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>
                  <Icon name="x" size={14} /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="small text-muted mb-0">
          <strong className="text-dark">{list.length}</strong> market{list.length !== 1 ? 's' : ''} found
          {filters.search.trim() ? ` for "${filters.search.trim().toLowerCase()}"` : ''}
        </p>
        <div>
          <button
            className={`icon-btn${filters.view === 'list' ? ' text-white' : ''}`}
            style={filters.view === 'list' ? { background: '#16a34a' } : undefined}
            aria-label="Show market list"
            aria-pressed={filters.view === 'list'}
            onClick={() => update({ view: 'list' })}
          >
            <Icon name="list" size={16} />
          </button>
          <button
            className={`icon-btn${filters.view === 'map' ? ' text-white' : ''}`}
            style={filters.view === 'map' ? { background: '#16a34a' } : undefined}
            aria-label="Show market map"
            aria-pressed={filters.view === 'map'}
            onClick={() => update({ view: 'map' })}
          >
            <Icon name="map" size={16} />
          </button>
        </div>
      </div>

      {filters.view === 'map' ? (
        <>
          <MarketMap
            markets={list}
            popupRequest={popupRequest}
            onPopupConsumed={clearPopupRequest}
            selection={selection}
            onSelectMarket={selectMarket}
          />
          {list.length > 0 ? (
            <div className="mt-4">{renderCards(true)}</div>
          ) : (
            <div className="text-center py-5">
              <h3 className="h5">No markets found</h3>
              <p className="text-muted">Try adjusting your search or filters.</p>
              <button className="btn-green" onClick={clearAll}>Clear Search</button>
            </div>
          )}
        </>
      ) : list.length > 0 ? (
        renderCards(false)
      ) : (
        <div className="text-center py-5">
          <h3 className="h5">No markets found</h3>
          <p className="text-muted">Try adjusting your search or filters.</p>
          <button className="btn-green" onClick={clearAll}>Clear Search</button>
        </div>
      )}
    </div>
  );
}
