import { useState } from 'react';
import markets from '../data/markets.json';
import { applyMarketFilters } from '../utils/markets.js';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import { useGeolocation } from '../hooks/useGeolocation.jsx';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import MarketCard from '../components/MarketCard.jsx';
import MarketMap from '../components/MarketMap.jsx';

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

  const list = applyMarketFilters(markets, filters, geo);
  const areas = [...new Set(markets.map((m) => m.area))].sort();
  const activeCount = [filters.area, filters.day, filters.produce].filter(Boolean).length;

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
            <div className="col-sm-6 col-lg-3">
              <label className="small text-muted">Location / Area</label>
              <select className="form-select" value={filters.area} onChange={(e) => update({ area: e.target.value })}>
                <option value="">All Areas</option>
                {areas.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="small text-muted">Day of Week</label>
              <select className="form-select" value={filters.day} onChange={(e) => update({ day: e.target.value })}>
                <option value="">All Days</option>
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="small text-muted">Produce Type</label>
              <select className="form-select" value={filters.produce} onChange={(e) => update({ produce: e.target.value })}>
                <option value="">All Types</option>
                {PRODUCE_TYPES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="small text-muted">Sort By</label>
              <select className="form-select" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
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
            onClick={() => update({ view: 'list' })}
          >
            <Icon name="list" size={16} />
          </button>
          <button
            className={`icon-btn${filters.view === 'map' ? ' text-white' : ''}`}
            style={filters.view === 'map' ? { background: '#16a34a' } : undefined}
            onClick={() => update({ view: 'map' })}
          >
            <Icon name="map" size={16} />
          </button>
        </div>
      </div>

      {filters.view === 'map' ? (
        <MarketMap markets={list} popupRequest={popupRequest} onPopupConsumed={clearPopupRequest} />
      ) : list.length > 0 ? (
        <div className="row g-3">
          {list.map((m) => (
            <div key={m.id} className="col-sm-6 col-lg-4 col-xl-3">
              <MarketCard market={m} />
            </div>
          ))}
        </div>
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
