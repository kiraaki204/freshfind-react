import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import produceData from '../data/produce.json';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import { useProduceFilters } from '../hooks/useProduceFilters.jsx';
import Icon from '../components/Icon.jsx';

/* Small flat illustration of a market stall, drawn in the site palette. */
function StallIllustration() {
  const stripes = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 250 160" width="230" height="147" aria-hidden="true" focusable="false">
      <circle cx="130" cy="84" r="72" fill="#f0fdf4" />
      <ellipse cx="130" cy="140" rx="72" ry="6" fill="#dcfce7" />
      {/* stall posts and counter */}
      <rect x="68" y="58" width="6" height="76" rx="2" fill="#a16207" />
      <rect x="186" y="58" width="6" height="76" rx="2" fill="#a16207" />
      <rect x="80" y="110" width="6" height="26" rx="2" fill="#a16207" />
      <rect x="174" y="110" width="6" height="26" rx="2" fill="#a16207" />
      <rect x="74" y="100" width="112" height="10" rx="3" fill="#ca8a04" />
      {/* crates of produce */}
      <circle cx="90" cy="79" r="5" fill="#22c55e" />
      <circle cx="97" cy="78" r="5" fill="#16a34a" />
      <circle cx="104" cy="79" r="5" fill="#22c55e" />
      <rect x="82" y="82" width="30" height="18" rx="3" fill="#d97706" />
      <circle cx="123" cy="79" r="5" fill="#ef4444" />
      <circle cx="130" cy="78" r="5" fill="#dc2626" />
      <circle cx="137" cy="79" r="5" fill="#ef4444" />
      <rect x="115" y="82" width="30" height="18" rx="3" fill="#d97706" />
      <polygon points="151,72 159,72 155,82" fill="#ea580c" />
      <polygon points="159,71 167,71 163,82" fill="#f97316" />
      <polygon points="167,72 175,72 171,82" fill="#ea580c" />
      <rect x="148" y="82" width="30" height="18" rx="3" fill="#d97706" />
      {/* striped awning */}
      {stripes.map((i) => (
        <g key={i} fill={i % 2 === 0 ? '#16a34a' : '#ffffff'}>
          <rect x={58 + i * 24} y="34" width="24" height="16" />
          <circle cx={70 + i * 24} cy="50" r="12" />
        </g>
      ))}
      <rect x="54" y="28" width="152" height="8" rx="4" fill="#15803d" />
      {/* signpost pointing back to the stall */}
      <rect x="232" y="64" width="5" height="74" rx="2" fill="#a16207" />
      <path d="M236 70h-30l-9 8 9 8h30z" fill="#16a34a" />
      <text x="216" y="81.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" letterSpacing="0.5">
        MARKET
      </text>
    </svg>
  );
}

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { update: updateDirectory } = useDirectoryFilters();
  const { replace: replaceProduce } = useProduceFilters();
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const lower = q.toLowerCase();
    // a produce name match lands on the Produce Guide, anything else on the Directory
    const produceHit = produceData.some((p) => p.name.toLowerCase().indexOf(lower) !== -1);
    if (produceHit) {
      replaceProduce({ search: q });
      navigate('/produce');
    } else {
      updateDirectory({ search: q });
      navigate('/markets');
    }
  };

  return (
    <div className="wrap">
      <section className="nf-page" aria-labelledby="nf-heading">
        <div className="nf-art">
          <StallIllustration />
        </div>
        <h1 id="nf-heading" className="h3">
          <span className="nf-code">404</span> — Oops! Wrong turn.
        </h1>
        <p className="nf-tag">Looks like this page wandered off the market.</p>
        <p className="text-muted nf-copy">
          We couldn't find the page you're looking for. Let's get you back to something fresh.
        </p>

        <form
          className="nf-search d-flex flex-column flex-sm-row gap-2"
          role="search"
          aria-label="Search markets or produce"
          onSubmit={submitSearch}
        >
          <div className="search-wrap flex-grow-1">
            <span className="s-ico"><Icon name="search" size={18} /></span>
            <input
              className="form-control"
              type="text"
              placeholder="Try “riverside” or “tomatoes”..."
              aria-label="Search markets or produce"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="btn-green" type="submit">Search</button>
        </form>

        <div className="nf-actions d-flex flex-wrap gap-2 justify-content-center">
          <button className="btn-green" onClick={() => navigate('/')}>
            <Icon name="home" size={16} /> Back to Home
          </button>
          <Link className="btn-outline-green" to="/markets">
            <Icon name="store" size={16} /> Market Directory
          </Link>
          <Link className="btn-outline-green" to="/produce">
            <Icon name="sprout" size={16} /> Produce Guide
          </Link>
        </div>
      </section>
    </div>
  );
}
