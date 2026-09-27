import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import { getMarketStatus, getCurrentSeason } from '../utils/time.js';
import { useChat } from '../hooks/useChat.jsx';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import Icon from '../components/Icon.jsx';
import LiveClock from '../components/LiveClock.jsx';
import MarketCard from '../components/MarketCard.jsx';
import HomeProduceSection from '../components/HomeProduceSection.jsx';
import HomeJournalSection from '../components/HomeJournalSection.jsx';
import HomeContactSection from '../components/HomeContactSection.jsx';
import {
  Sparkle, StarDoodle, FlowerDoodle, LeafSprig, Vine, Squiggle,
  ArrowCurve, SunDoodle, TomatoDoodle, StrawberryDoodle, CarrotDoodle, SparkleCluster,
  DriftLeaf, DriftPetal,
} from '../components/Doodles.jsx';

const QUICK_ACTIONS = [
  { ico: 'pin', label: 'Find a Market', desc: 'Search nearby markets', to: '/markets', bg: 'var(--pistachio)', tint: 'var(--wash-pistachio)' },
  { ico: 'store', label: 'Market Directory', desc: 'Browse all markets', to: '/markets', bg: 'var(--peach)', tint: 'var(--wash-blush)' },
  { ico: 'basket', label: 'Produce Guide', desc: 'Explore seasonal produce', to: '/#produce', bg: 'var(--butter)', tint: 'var(--wash-butter)' },
  { ico: 'chat', label: 'AI Chatbot', desc: 'Get instant answers', to: 'chat', bg: 'var(--pink)', tint: 'var(--blush)' },
];

const SEASONS = [
  { name: 'Spring', ico: 'flower', color: '#fdf2f8', border: '#fbcfe8', accent: '#db2777', items: ['Leafy Greens', 'Radishes', 'Asparagus', 'Strawberries'], desc: 'Fresh spring greens and the first fruits of the year.', hand: 'first shoots & blossoms!' },
  { name: 'Summer', ico: 'sun', color: '#fffbeb', border: '#fde68a', accent: '#d97706', items: ['Tomatoes', 'Berries', 'Corn', 'Cucumbers', 'Peppers'], desc: 'Peak season for vibrant summer produce and stone fruits.', hand: 'sun-ripened & juicy!' },
  { name: 'Autumn', ico: 'leaf', color: '#fff7ed', border: '#fed7aa', accent: '#ea580c', items: ['Pumpkins', 'Apples', 'Squash', 'Root Vegetables'], desc: 'Warm, hearty autumn harvest of roots and orchard fruits.', hand: 'cosy harvest time!' },
  { name: 'Winter', ico: 'snow', color: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', items: ['Citrus', 'Root Vegetables', 'Broccoli', 'Winter Greens'], desc: 'Citrus, brassicas and stored roots for the cool months.', hand: 'bright citrus days!' },
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
      {/* ================= HERO : journal cover ================= */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-blob hero-blob--1" aria-hidden="true">
          <LeafSprig size={74} />
        </div>
        <div className="hero-blob hero-blob--2" aria-hidden="true">
          <Vine width={128} height={56} />
        </div>
        <div className="hero-blob hero-blob--3" aria-hidden="true">
          <SunDoodle size={48} />
        </div>

        {/* slow-drifting botanicals, kept to the open right-hand margin */}
        <span className="ff-drift ff-drift--hero-leaf" aria-hidden="true">
          <DriftLeaf size={26} />
        </span>
        <span className="ff-drift ff-drift--hero-petal" aria-hidden="true">
          <DriftPetal size={22} />
        </span>

        <div className="hero-copy">
          <div className="hero-grid">
            <div>
              <div className="live-pill">
                <span className="pulse-dot" /> {live}
              </div>
              <br />
              <span className="hero-kicker">
                the farmers-market journal <Squiggle width={64} height={10} />
              </span>
              <h1>
                <span className="hero-script">hey, hungry human —</span>
                Find Farmers&rsquo;<br />
                <span className="hero-hl">Markets</span> Near You
              </h1>
              <p className="hero-lede">
                Discover nearby markets, check <strong>schedules and locations</strong>, and see
                what&rsquo;s <strong>in season</strong> — all tucked into one tasty little guide.
              </p>
              <form className="hero-search" onSubmit={submitHeroSearch} role="search">
                <div className="search-wrap">
                  <span className="s-ico"><Icon name="search" size={19} /></span>
                  <input
                    className="form-control"
                    placeholder="Search by market name, location or produce..."
                    aria-label="Search markets"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                  />
                </div>
                <button className="btn-green" type="submit">Search</button>
              </form>
              <div>
                <button className="hero-alt" onClick={() => navigate('/markets')}>
                  <span className="hero-alt-arrow"><Icon name="pin" size={15} /></span>
                  Find Markets Near Me
                </button>
              </div>
              <p className="hero-hand-note">psst — the strawberries are *so* worth the trip</p>
              <div className="hero-stats" aria-label="FreshFind at a glance">
                <span className="hero-stat"><Icon name="store" size={15} /> {markets.length} local markets</span>
                <span className="hero-stat"><Icon name="basket" size={15} /> {produceData.length} seasonal finds</span>
                <span className="hero-stat"><Icon name="star" size={15} /> {featured.length} community faves</span>
              </div>
              <div className="hero-strip" aria-hidden="true">
                <img src="/images/seasonal-produce.jpg" alt="" loading="lazy" />
                <img src="/images/produce-carrots.jpg" alt="" loading="lazy" />
                <img src="/images/produce-flowers.jpg" alt="" loading="lazy" />
                <img src="/images/produce-bread.jpg" alt="" loading="lazy" />
              </div>
            </div>

            <div className="hero-collage" aria-hidden="true">
              <img className="hero-photo-main" src="/images/hero-market.jpg" alt="" />
              <figure className="hero-polaroid hero-polaroid--1">
                <img src="/images/produce-strawberries.jpg" alt="" loading="lazy" />
                <figcaption>berry cute, right?</figcaption>
              </figure>
              <figure className="hero-polaroid hero-polaroid--2">
                <img src="/images/produce-tomatoes.jpg" alt="" loading="lazy" />
                <figcaption>today&rsquo;s haul</figcaption>
              </figure>
              <span className="hero-doodle hero-doodle--1"><Sparkle size={34} /></span>
              <span className="hero-doodle hero-doodle--2"><FlowerDoodle size={40} /></span>
              <span className="hero-doodle hero-doodle--3"><TomatoDoodle size={42} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ticker tape ================= */}
      <div className="clock-bar">
        <div className="inner">
          <div>
            <Icon name="clock" size={16} /> <span className="tick-label">Current Time:</span>{' '}
            <LiveClock />
          </div>
          <div className="tick-visitors">
            <Icon name="leaf" size={14} /> {visitorCount.toLocaleString()} visitors exploring FreshFind
          </div>
        </div>
      </div>

      {/* ================= quick actions ================= */}
      <section className="home-quick band-flush" aria-label="Quick actions">
        <div className="container" style={{ maxWidth: '80rem', position: 'relative' }}>
          <div className="row g-3">
            {QUICK_ACTIONS.map((a) => (
              <div key={a.label} className="col-12 col-sm-6 col-lg-3">
                <button className="qa-card h-100" style={{ background: a.tint }} onClick={() => goQuickAction(a)}>
                  <div className="qa-ico" style={{ background: a.bg }}>
                    <Icon name={a.ico} size={24} />
                  </div>
                  <h3 className="h6 mb-1">{a.label}</h3>
                  <p className="small mb-0" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{a.desc}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= open right now ================= */}
      <section className="home-open band" aria-label="Markets open right now">
        <div className="band-doodle band-doodle--tr" aria-hidden="true">
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <StrawberryDoodle size={52} /><Sparkle size={26} />
          </span>
        </div>
        <div className="band-doodle band-doodle--bl" aria-hidden="true">
          <Vine width={120} height={52} />
        </div>
        <span className="ff-drift ff-drift--band-leaf" aria-hidden="true">
          <DriftLeaf size={24} />
        </span>
        <div className="container pt-4" style={{ maxWidth: '80rem', position: 'relative' }}>
          <div className="sec-head">
            <span className="kicker"><span className="k-line" /> live from the stalls</span>
            <h2>Open <span className="hl">Right Now</span></h2>
            <p>Markets currently open — updated live, so grab your tote bag.</p>
            <span className="sec-arrow" aria-hidden="true"><ArrowCurve width={86} height={52} /></span>
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
            <div className="open-empty p-5 text-center">
              <SunDoodle size={54} />
              <h3 className="h5 mt-3" style={{ color: 'var(--forest-deep)', fontWeight: 800 }}>No markets open right now</h3>
              <p className="small" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>
                Check back during market hours or browse our directory to plan your next visit.
              </p>
              <button className="btn-green" onClick={() => navigate('/markets')}>
                View All Markets
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= featured markets ================= */}
      <section className="home-featured band" aria-label="Featured markets">
        <div className="band-doodle band-doodle--tr" aria-hidden="true">
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <CarrotDoodle size={54} /><FlowerDoodle size={44} />
          </span>
        </div>
        <div className="container pt-4" style={{ maxWidth: '80rem', position: 'relative' }}>
          <div className="sec-head">
            <span className="kicker"><span className="k-line" /> community faves</span>
            <h2>Featured <span className="hl hl-butter">Markets</span></h2>
            <p>Discover some of our favourite local farmers&rsquo; markets.</p>
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
            <p className="hero-hand-note">all {markets.length} of &rsquo;em — go on, take a look</p>
          </div>
        </div>
      </section>

      {/* Curated produce discovery — homepage anchor for Produce Guide */}
      <HomeProduceSection />

      {/* ================= what's in season ================= */}
      <section className="home-seasons band" aria-labelledby="seasons-title">
        <div className="band-doodle band-doodle--tr" aria-hidden="true">
          <SparkleCluster />
        </div>
        <div className="container pt-4" style={{ maxWidth: '80rem', position: 'relative' }}>
          <div className="text-center mb-4">
            <span className="season-kicker">a year of tasty chapters</span>
            <h2 id="seasons-title">What&rsquo;s <span className="hl hl-pink">In Season</span></h2>
            <p>
              Discover what fresh produce is available throughout the year at your local farmers&rsquo; markets.
            </p>
          </div>
          <div className="row g-3">
            {SEASONS.map((s) => (
              <div key={s.name} className="col-sm-6 col-lg-3">
                <div
                  className={`season-card season-card--${s.name.toLowerCase()}${currentSeason === s.name ? ' current' : ''}`}
                >
                  {currentSeason === s.name && (
                    <span className="season-current">
                      ★ in season now
                    </span>
                  )}
                  <div className="season-emblem" aria-hidden="true">
                    <Icon name={s.ico} size={30} />
                  </div>
                  <span className="season-hand">{s.hand}</span>
                  <h3>{s.name}</h3>
                  <p className="season-description">{s.desc}</p>
                  <ul className="season-produce" role="list">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <button className="season-cta" onClick={() => navigate('/#produce')}>
                    Explore {s.name} Produce <Icon name="chevron" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The FreshFind Field Journal — interactive scrapbook (#journal) */}
      <HomeJournalSection />

      {/* ================= CTA ================= */}
      <section className="cta-band">
        <span className="cta-doodle cta-doodle--l" aria-hidden="true"><LeafSprig size={68} color="#8FAE90" /></span>
        <span className="cta-doodle cta-doodle--r" aria-hidden="true"><TomatoDoodle size={58} /></span>
        <span className="cta-doodle cta-doodle--s1" aria-hidden="true"><StarDoodle size={22} color="#D8B97A" /></span>
        <span className="cta-doodle cta-doodle--s2" aria-hidden="true"><Sparkle size={30} color="#D8B97A" /></span>
        <span className="cta-kicker">come hungry, leave happy ~</span>
        <h2>Good Food. <span className="hand">Stronger</span> Communities.</h2>
        <p>
          Discover fresh local produce and support the people who grow it.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center" style={{ position: 'relative' }}>
          <button className="btn-sun" onClick={() => navigate('/markets')}>
            <Icon name="store" size={18} /> Find a Market
          </button>
          <button className="btn-green" onClick={() => navigate('/#produce')}>
            <Icon name="basket" size={18} /> Explore Produce
          </button>
        </div>
      </section>

      {/* Redesigned Contact — natural conclusion before footer */}
      <HomeContactSection />
    </>
  );
}
