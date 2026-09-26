import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import Icon from '../components/Icon.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { update } = useDirectoryFilters();
  const [query, setQuery] = useState('');

  const searchMarkets = (e) => {
    e.preventDefault();
    update({ search: query });
    navigate('/markets');
  };

  return (
    <div className="wrap text-center py-5" style={{ maxWidth: '40rem' }}>
      <div
        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: 72, height: 72, background: '#f0fdf4', color: '#15803d' }}
      >
        <Icon name="search" size={30} />
      </div>
      <h1 className="h3">Page not found</h1>
      <p className="text-muted">
        Sorry, we couldn't find the page you were looking for. It may have moved, or the address
        might be mistyped.
      </p>

      <form className="d-flex gap-2 mx-auto mb-3" style={{ maxWidth: '26rem' }} onSubmit={searchMarkets}>
        <div className="search-wrap flex-grow-1">
          <span className="s-ico"><Icon name="search" size={18} /></span>
          <input
            className="form-control"
            style={{ borderRadius: 12 }}
            placeholder="Search markets instead..."
            aria-label="Search markets"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-green" type="submit">Search</button>
      </form>

      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <button className="btn-green" onClick={() => navigate('/')}>
          <Icon name="home" size={16} /> Go to Home
        </button>
        <button className="btn-outline-green" onClick={() => navigate('/markets')}>
          <Icon name="store" size={16} /> Browse Markets
        </button>
        <button className="btn-outline-green" onClick={() => navigate('/produce')}>
          <Icon name="carrot" size={16} /> Produce Guide
        </button>
      </div>
    </div>
  );
}
