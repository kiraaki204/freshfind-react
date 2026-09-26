import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import { getMarketStatus, getCurrentSeason } from '../utils/time.js';
import { useChat } from '../hooks/useChat.jsx';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import Icon from '../components/Icon.jsx';
import LiveClock from '../components/LiveClock.jsx';
import MarketCard from '../components/MarketCard.jsx';
import HomeProduceSection from '../components/HomeProduceSection.jsx';
import HomeJournalSection from '../components/HomeJournalSection.jsx';
import HomeContactSection from '../components/HomeContactSection.jsx';

const QUICK_ACTIONS = [
  { ico: 'pin', label: 'Find a Market', desc: 'Search nearby markets', to: '/markets', bg: '#16a34a' },
  { ico: 'store', label: 'Market Directory', desc: 'Browse all markets', to: '/markets', bg: '#059669' },
  { ico: 'basket', label: 'Produce Guide', desc: 'Explore seasonal produce', to: '/#produce', bg: '#0d9488' },
  { ico: 'chat', label: 'AI Chatbot', desc: 'Get instant answers', to: 'chat', bg: '#15803d' },
];

const SEASONS = [
  { name: 'Spring', ico: 'flower', color: '#fdf2f8', border: '#fbcfe8', accent: '#db2777', items: ['Leafy Greens', 'Radishes', 'Asparagus', 'Strawberries'], desc: 'Fresh spring greens and the first fruits of the year.' },
  { name: 'Summer', ico: 'sun', color: '#fffbeb', border: '#fde68a', accent: '#d97706', items: ['Tomatoes', 'Berries', 'Corn', 'Cucumbers', 'Peppers'], desc: 'Peak season for vibrant summer produce and stone fruits.' },
  { name: 'Autumn', ico: 'leaf', color: '#fff7ed', border: '#fed7aa', accent: '#ea580c', items: ['Pumpkins', 'Apples', 'Squash', 'Root Vegetables'], desc: 'Warm, hearty autumn harvest of roots and orchard fruits.' },
  { name: 'Winter', ico: 'snow', color: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', items: ['Citrus', 'Root Vegetables', 'Broccoli', 'Winter Greens'], desc: 'Citrus, brassicas and stored roots for the cool months.' },
];

const WHY = [
  { ico: 'checkc', t: 'Accurate Information', d: 'Market details, schedules and produce all in one place.' },
  { ico: 'leaf', t: 'Seasonal Guidance', d: "Know what's likely to be available before you visit." },
  { ico: 'users', t: 'Support Local', d: 'Discover local farmers and markets in your community.' },
  { ico: 'star', t: 'Easy to Use', d: 'Simple, accessible experience for everyone.' },
];

export default function HomePage({ visitorCount }) {
  const navigate = useNavigate();
  const { openChat } = useChat();
  const { update: updateDirFilters } = useDirectoryFilters();
  const [heroQuery, setHeroQuery] = useState('');

  const openNow = markets.filter((m) => getMarketStatus(m).status === 'open');
  const featured = markets.filter((m) => m.featured);
  const live = openNow.length
    ? `${openNow.length} market${openNow.length > 1 ? 's' : ''} open right now`
    : 'Markets open daily';
  const currentSeason = getCurrentSeason();

  const goQuickAction = (a) => {
    if (a.to === 'chat') openChat(true);
    else if (a.to.includes('#')) {
      const hash = a.to.split('#')[1];
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', a.to);
      } else navigate(a.to);
    } else navigate(a.to);
  };

  const submitHeroSearch = (e) => {
    e.preventDefault();
    updateDirFilters({ search: heroQuery });
    navigate('/markets');
  };

  return (
    <>
      <section className="hero" aria-label="Hero section">
        <img className="hero-bg" src="/images/hero-market.jpg" alt="Vibrant farmers market scene with fresh produce" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div style={{ maxWidth: '36rem' }}>
            <div className="live-pill">
              <span className="pulse-dot" style={{ background: '#bbf7d0' }} /> {live}
            </div>
            <h1>Find Farmers'<br /><span>Markets</span> Near You</h1>
            <p className="text-white mb-4" style={{ opacity: .85, maxWidth: '28rem' }}>
              Discover nearby markets, check schedules and locations, and see what's in season.
            </p>
            <form className="d-flex gap-2 mb-3" style={{ maxWidth: '36rem' }} onSubmit={submitHeroSearch}>
              <div className="search-wrap flex-grow-1">
                <span className="s-ico"><Icon name="search" size={18} /></span>
                <input
                  className="form-control"
                  placeholder="Search by market name, location or produce..."
                  style={{ height: 52, borderRadius: 12 }}
                  aria-label="Search markets"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                />
              </div>
              <button className="btn-green" style={{ borderRadius: 12, padding: '0 22px' }}>Search</button>
            </form>
            <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => navigate('/markets')}>
              <Icon name="pin" size={16} /> Find Markets Near Me <Icon name="chevron" size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="clock-bar">
        <div className="inner">
          <div>
            <Icon name="clock" size={16} /> <span style={{ color: '#bbf7d0' }}>Current Time:</span>{' '}
            <LiveClock />
          </div>
          <div style={{ color: '#86efac', fontSize: 12 }}>
            <Icon name="leaf" size={14} /> {visitorCount.toLocaleString()} visitors exploring FreshFind
          </div>
        </div>
      </div>

      <section className="py-5 bg-light">
        <div className="container" style={{ maxWidth: '80rem' }}>
          <div className="row g-3">
            {QUICK_ACTIONS.map((a) => (
              <div key={a.label} className="col-12 col-sm-6 col-lg-3">
                <button className="qa-card h-100" onClick={() => goQuickAction(a)}>
                  <div className="qa-ico" style={{ background: a.bg }}>
                    <Icon name={a.ico} size={22} />
                  </div>
                  <h3 className="h6 mb-1">{a.label}</h3>
                  <p className="small text-muted mb-0">{a.desc}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container" style={{ maxWidth: '80rem' }}>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="pulse-dot" style={{ width: 10, height: 10 }} />
                <h2 className="h4 mb-0">Open Right Now</h2>
              </div>
              <p className="text-muted small mb-0">Markets currently open — updated live</p>
            </div>
            <LiveClock className="small text-muted" />
          </div>
          {openNow.length ? (
            <div className="row g-4">
              {openNow.map((m) => (
                <div key={m.id} className="col-md-6 col-lg-4">
                  <MarketCard market={m} compact />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center rounded-4" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
              <Icon name="clock" size={40} />
              <h3 className="h6 mt-3" style={{ color: '#92400e' }}>No markets open right now</h3>
              <p className="small" style={{ color: '#b45309' }}>
                Check back during market hours or browse our directory to plan your next visit.
              </p>
              <button className="btn-green" style={{ background: '#d97706' }} onClick={() => navigate('/markets')}>
                View All Markets
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container" style={{ maxWidth: '80rem' }}>
          <div className="d-flex justify-content-between mb-4">
            <div>
              <h2 className="h4">Featured Markets</h2>
              <p className="small text-muted mb-0">Discover some of our favourite local farmers' markets</p>
            </div>
            <button className="btn btn-link text-decoration-none d-none d-sm-inline" style={{ color: '#15803d' }} onClick={() => navigate('/markets')}>
              View all markets <Icon name="chevron" size={16} />
            </button>
          </div>
          <div className="row g-4">
            {featured.slice(0, 6).map((m) => (
              <div key={m.id} className="col-md-6 col-lg-4">
                <MarketCard market={m} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn-green" onClick={() => navigate('/markets')}>Browse All Markets</button>
          </div>
        </div>
      </section>

      {/* Curated produce discovery — homepage anchor for Produce Guide */}
      <HomeProduceSection />

      <section className="py-5">
        <div className="container" style={{ maxWidth: '80rem' }}>
          <div className="text-center mb-4">
            <h2 className="h4">What's In Season</h2>
            <p className="text-muted">
              Discover what fresh produce is available throughout the year at your local farmers' markets.
            </p>
          </div>
          <div className="row g-3">
            {SEASONS.map((s) => (
              <div key={s.name} className="col-sm-6 col-lg-3">
                <div
                  className={`season-card${currentSeason === s.name ? ' current' : ''}`}
                  style={{ background: s.color, border: `1px solid ${s.border}` }}
                >
                  {currentSeason === s.name && (
                    <span className="chip position-absolute" style={{ top: 12, right: 12, background: '#16a34a', color: '#fff', border: 'none' }}>
                      Current
                    </span>
                  )}
                  <div className="rounded-3 bg-white d-inline-flex p-2 mb-2" style={{ opacity: .8, color: s.accent }}>
                    <Icon name={s.ico} size={22} />
                  </div>
                  <h3 className="h5" style={{ color: s.accent }}>{s.name}</h3>
                  <p className="small text-muted">{s.desc}</p>
                  <ul className="list-unstyled small mb-3">
                    {s.items.map((it) => (
                      <li key={it} className="mb-1"><span className="pulse-dot me-1" />{it}</li>
                    ))}
                  </ul>
                  <button className="btn btn-link p-0 text-decoration-none small" style={{ color: s.accent }} onClick={() => navigate('/#produce')}>
                    Explore {s.name} Produce <Icon name="chevron" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container" style={{ maxWidth: '80rem' }}>
          <div className="text-center mb-4">
            <h2 className="h4">Why FreshFind?</h2>
            <p className="text-muted">Everything you need to connect with local food</p>
          </div>
          <div className="row g-3">
            {WHY.map((w) => (
              <div key={w.t} className="col-sm-6 col-lg-3">
                <div className="ff-card p-4 why-card h-100">
                  <div className="why-ico"><Icon name={w.ico} size={20} /></div>
                  <h3 className="h6">{w.t}</h3>
                  <p className="small text-muted mb-0">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us now lives inside the Field Journal spread below */}

      {/* The FreshFind Field Journal — interactive scrapbook (#journal) */}
      <HomeJournalSection />

      <section className="cta-band">
        <h2 className="fw-bold mb-3">Good Food. Stronger Communities.</h2>
        <p className="mb-4" style={{ color: '#bbf7d0', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
          Discover fresh local produce and support the people who grow it.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button className="btn-green" style={{ background: '#fff', color: '#15803d' }} onClick={() => navigate('/markets')}>
            <Icon name="store" size={18} /> Find a Market
          </button>
          <button className="btn-green" style={{ background: '#16a34a', border: '2px solid rgba(255,255,255,.3)' }} onClick={() => navigate('/#produce')}>
            <Icon name="basket" size={18} /> Explore Produce
          </button>
        </div>
      </section>

      {/* Redesigned Contact — natural conclusion before footer */}
      <HomeContactSection />
    </>
  );
}
