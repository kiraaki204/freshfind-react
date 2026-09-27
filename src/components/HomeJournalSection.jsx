import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import { getCurrentSeason, DAY_NAMES } from '../utils/time.js';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import { applyMarketFilters } from '../utils/markets.js';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import { useProduceDetailModal } from '../hooks/useProduceDetailModal.jsx';
import Icon from './Icon.jsx';

/* The FreshFind Field Journal — a hand-drawn botanical scrapbook embedded
   in the homepage. Pure React state + CSS: cover flip, 3D page turns for
   the desktop two-page spread, a single-sheet layout on mobile, and fully
   keyboard/touch accessible controls. All content derives from the shared
   markets/produce data — nothing is invented here. */

const SPREAD_TITLES = [
  'Our Story',
  'Notes from the Harvest',
  'Meet Your Local Markets',
  'A Year of Fresh Finds',
  'Your Market Field Guide',
];
const SPREAD_COUNT = SPREAD_TITLES.length;
/* two sheet-sides per spread: the desktop book shows them side by side while
   the mobile turnover pad walks through the same pages one at a time */
const PAGE_COUNT = SPREAD_COUNT * 2;

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const SEASON_STYLE = {
  Spring: { ink: 'var(--season-spring-ink)', wash: 'var(--season-spring-tint)', deco: 'flower' },
  Summer: { ink: 'var(--season-summer-ink)', wash: 'var(--season-summer-tint)', deco: 'sun' },
  Autumn: { ink: 'var(--season-autumn-ink)', wash: 'var(--season-autumn-tint)', deco: 'leaf' },
  Winter: { ink: 'var(--season-winter-ink)', wash: 'var(--season-winter-tint)', deco: 'snow' },
};

const dayAbbr = (days) => days.map((d) => d.slice(0, 3)).join(' · ');
const bySeason = (s) => produceData.filter((p) => p.season.includes(s));

/* ------------------------------------------------------- tiny doodles */
const DOODLE_PROPS = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false };

const Sprig = ({ color = 'var(--sage)', ...rest }) => (
  <svg viewBox="0 0 60 60" {...DOODLE_PROPS} stroke={color} strokeWidth="1.6" {...rest}>
    <path d="M30 54 C29 38 28 22 34 8" />
    <path d="M30 44 C20 40 15 32 15 25 C24 27 29 34 30 44Z" />
    <path d="M31 32 C40 28 44 20 43 14 C35 16 31 23 31 32Z" />
  </svg>
);

const StarDoodle = ({ color = 'var(--honey)', ...rest }) => (
  <svg viewBox="0 0 40 40" {...DOODLE_PROPS} stroke={color} strokeWidth="1.6" {...rest}>
    <path d="M20 6 L23.5 16 L34 16.5 L25.5 23 L28.5 33.5 L20 27.5 L11.5 33.5 L14.5 23 L6 16.5 L16.5 16 Z" />
  </svg>
);

const ArrowDoodle = ({ color = 'var(--leaf)', ...rest }) => (
  <svg viewBox="0 0 90 40" {...DOODLE_PROPS} stroke={color} strokeWidth="1.5" {...rest}>
    <path d="M6 30 C26 26 48 20 66 10" />
    <path d="M58 8 L68 8.5 L64 18" />
  </svg>
);

const SunDoodle = ({ color = 'var(--honey)', ...rest }) => (
  <svg viewBox="0 0 60 60" {...DOODLE_PROPS} stroke={color} strokeWidth="1.5" {...rest}>
    <circle cx="30" cy="30" r="12" />
    <path d="M30 8 v-5 M30 57 v-5 M8 30 H3 M57 30 h-5 M14 14 l-4 -4 M50 50 l-4 -4 M46 14 l4 -4 M10 50 l4 -4" />
  </svg>
);

const TomatoDoodle = ({ ...rest }) => (
  <svg viewBox="0 0 60 60" {...DOODLE_PROPS} strokeWidth="1.5" {...rest}>
    <circle cx="30" cy="34" r="17" stroke="var(--peach)" />
    <path d="M30 17 q-1 -7 5 -9 M30 17 q-8 -3 -11 3 M30 17 q8 -3 11 3 M24 14 q4 -4 12 0" stroke="var(--sage)" />
    <path d="M19 30 q11 -6 22 0" stroke="var(--peach)" opacity="0.6" />
  </svg>
);

const CarrotDoodle = ({ ...rest }) => (
  <svg viewBox="0 0 60 60" {...DOODLE_PROPS} strokeWidth="1.5" {...rest}>
    <path d="M26 20 L44 22 L30 52 C26 50 24 44 26 38 Z" stroke="var(--peach)" />
    <path d="M29 30 l6 1 M27 39 l5 1" stroke="var(--peach)" opacity="0.7" />
    <path d="M33 20 q-2 -8 -9 -9 M34 20 q1 -9 8 -10 M35 19 q6 -5 11 -2" stroke="var(--sage)" />
  </svg>
);

const SwirlDoodle = ({ color = 'var(--sage)', ...rest }) => (
  <svg viewBox="0 0 60 60" {...DOODLE_PROPS} stroke={color} strokeWidth="1.6" {...rest}>
    <path d="M30 46 C44 46 46 30 34 30 C25 30 26 40 33 39" />
    <path d="M30 46 C22 44 16 36 18 28" />
  </svg>
);

/* -------------------------------------------------- spread page parts */
function JournalHead({ eyebrow, title, children }) {
  return (
    <div className="fj-page-head">
      <span className="fj-eyebrow">{eyebrow}</span>
      <h3 className="fj-page-title">{title}</h3>
      <svg className="fj-title-rule" width="120" height="8" viewBox="0 0 120 8" aria-hidden="true">
        <path d="M3 5.5 C24 1.5 44 7 60 4 C78 1 100 6.5 117 3.5" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  );
}

/* Spread 1 — About Us: Our Story (reuses the homepage About copy) */
function StoryLeft() {
  return (
    <>
      <JournalHead eyebrow="about us" title="Our Story" />
      <p className="fj-body">
        FreshFind gathers your farmers&apos;-market essentials in one friendly place: a directory of
        sample markets with live open/closed status, a seasonal produce guide, and a way to keep
        your favourites saved right in your browser.
      </p>
      <p className="fj-body">
        Its purpose is simple — help people discover markets near them, see what&apos;s in season
        before they go, and plan a visit that supports local growers.
      </p>
      <div className="fj-margin-note">
        <span className="fj-script">field note:</span> FreshFind is a frontend demo — no accounts,
        no checkout, no server. Saved items and chat history stay in your browser&apos;s local storage.
      </div>
      <div className="fj-pressed-flower" aria-hidden="true"><Sprig width={58} height={58} /></div>
    </>
  );
}

function StoryRight() {
  const navigate = useNavigate();
  const { update } = useDirectoryFilters();
  const [area, setArea] = useState('');
  const [day, setDay] = useState('');
  const areas = [...new Set(markets.map((m) => m.area))].sort();
  const matches = applyMarketFilters(markets, { area, day }, {});
  const browse = (e) => {
    e.preventDefault();
    update({ area, day, search: '', produce: '', sort: 'alpha', view: 'map' });
    navigate('/markets');
  };
  return (
    <>
      <JournalHead eyebrow="make a little plan" title="Your next market morning" />
      <p className="fj-body fj-body-sm">Pick a place and a day. Find a fresh stop for your week.</p>
      <form className="journal-planner" onSubmit={browse}>
        <label htmlFor="plan-area">Where are you heading?</label>
        <select id="plan-area" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Any area</option>
          {areas.map((name) => <option key={name}>{name}</option>)}
        </select>
        <label htmlFor="plan-day">When would you like to go?</label>
        <select id="plan-day" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Any day</option>
          {DAY_NAMES.map((name) => <option key={name}>{name}</option>)}
        </select>
        <p className="fj-body fj-body-sm" role="status">
          {matches.length ? `${matches.length} market${matches.length === 1 ? '' : 's'} to explore.` : 'No markets on that day here. Try another day or area.'}
        </p>
        <button className="fj-stamp-btn" disabled={!matches.length}>
          <Icon name="map" size={15} /> See matches on the map
        </button>
      </form>
      <p className="fj-script fj-hint-line">a small outing, a basket of possibilities</p>
    </>
  );
}

/* Spread 2 — Notes from the Harvest (featured produce stickers) */
const FEATURED = produceData.filter((p) => p.featured);

function HarvestLeft({ selected, onPick }) {
  return (
    <>
      <JournalHead eyebrow="notes from the harvest" title="Produce, pressed & pinned" />
      <p className="fj-body fj-body-sm">
        Eight favourites from the catalogue, taped in for the season. Tap a sticker for its notes.
      </p>
      <div className="fj-sticker-grid">
        {FEATURED.slice(0, 4).map((p, i) => (
          <ProduceSticker key={p.id} p={p} i={i} selected={selected} onPick={onPick} />
        ))}
      </div>
      <div className="fj-corner-doodle" aria-hidden="true"><TomatoDoodle width={56} height={56} /></div>
    </>
  );
}

function HarvestRight({ selected, onPick }) {
  const sel = produceData.find((p) => p.id === selected);
  const { openProduce } = useProduceDetailModal();
  return (
    <>
      <div className="fj-sticker-grid fj-sticker-grid--tight">
        {FEATURED.slice(4).map((p, i) => (
          <ProduceSticker key={p.id} p={p} i={i + 1} selected={selected} onPick={onPick} />
        ))}
      </div>
      <div className="fj-annotation" role="region" aria-live="polite" aria-label="Produce annotation">
        {sel ? (
          <>
            <div className="fj-annotation-head">
              <span className="fj-annotation-emoji" aria-hidden="true">{sel.emoji}</span>
              <div>
                <div className="fj-annotation-name">{sel.name}</div>
                <div className="fj-annotation-meta">{sel.category} · {sel.season.join(' & ')}</div>
              </div>
            </div>
            <p className="fj-annotation-note">{sel.description}</p>
            <p className="fj-annotation-tip"><Icon name="bulb" size={13} /> {sel.storageHint}</p>
            <button className="fj-stamp-btn" onClick={() => openProduce(sel.id)}>
              <Icon name="pin" size={14} /> Details &amp; markets for {sel.name}
            </button>
          </>
        ) : (
          <p className="fj-script fj-annotation-empty">— pick a sticker and the field notes will appear here —</p>
        )}
      </div>
    </>
  );
}

function ProduceSticker({ p, i, selected, onPick }) {
  const rot = ((i % 2 === 0 ? -1 : 1) * (1.2 + (i % 3) * 0.7)).toFixed(1);
  return (
    <button
      className={`fj-sticker${selected === p.id ? ' picked' : ''}`}
      style={{ '--rot': `${rot}deg` }}
      aria-pressed={selected === p.id}
      aria-label={`${p.name} — show field notes`}
      onClick={() => onPick(selected === p.id ? null : p.id)}
    >
      <span className="fj-sticker-tape" aria-hidden="true" />
      <span className="fj-sticker-emoji" aria-hidden="true">{p.emoji}</span>
      <span className="fj-sticker-name">{p.name}</span>
      {selected === p.id && <span className="fj-sticker-check" aria-hidden="true"><Icon name="check" size={11} /></span>}
    </button>
  );
}

/* Spread 3 — Meet Your Local Markets (all 8, buttons open the market modal) */
function MarketEntry({ m }) {
  const { openMarket } = useMarketModal();
  return (
    <div className="fj-market">
      <div className="fj-market-info">
        <div className="fj-market-name">{m.name}</div>
        <div className="fj-market-meta">
          <Icon name="pin" size={11} /> {m.area} · {dayAbbr(m.days)}
        </div>
        <div className="fj-market-meta fj-market-meta--rating">
          <Icon name="star" size={11} /> {m.rating} · {m.vendors} vendors
        </div>
      </div>
      <button className="fj-stamp-btn fj-stamp-btn--sm" onClick={() => openMarket(m.id)} aria-label={`View details for ${m.name}`}>
        View
      </button>
    </div>
  );
}

function MarketsLeft() {
  const half = Math.ceil(markets.length / 2);
  return (
    <>
      <JournalHead eyebrow="meet your local markets" title={`The ${markets.length} stalls of FreshFind`} />
      <div className="fj-market-list">
        {markets.slice(0, half).map((m) => <MarketEntry key={m.id} m={m} />)}
      </div>
    </>
  );
}

function MarketsRight() {
  const half = Math.ceil(markets.length / 2);
  return (
    <>
      <div className="fj-market-list fj-market-list--top-pad">
        {markets.slice(half).map((m) => <MarketEntry key={m.id} m={m} />)}
      </div>
      <p className="fj-script fj-hint-line">
        sample data — pins mark demo areas, not verified businesses
        <span className="fj-corner-doodle" aria-hidden="true"><CarrotDoodle width={44} height={44} /></span>
      </p>
    </>
  );
}

/* Spread 4 — A Year of Fresh Finds (all derived from produce.json) */
function SeasonCard({ season }) {
  const st = SEASON_STYLE[season];
  const items = bySeason(season);
  const isNow = getCurrentSeason() === season;
  return (
    <div className="fj-season" style={{ '--fj-season-ink': st.ink, background: st.wash }}>
      {isNow && <span className="fj-season-now">in season now</span>}
      <div className="fj-season-head">
        <Icon name={st.deco} size={15} />
        <span className="fj-season-name">{season}</span>
        <span className="fj-season-count">{items.length} item{items.length === 1 ? '' : 's'}</span>
      </div>
      <ul className="fj-season-items">
        {items.slice(0, 6).map((p) => (
          <li key={p.id}><span aria-hidden="true">{p.emoji}</span> {p.name}</li>
        ))}
        {items.length > 6 && <li className="fj-season-more">+ {items.length - 6} more in the guide</li>}
      </ul>
    </div>
  );
}

function SeasonsLeft() {
  return (
    <>
      <JournalHead eyebrow="a year of fresh finds" title="The seasonal round" />
      <div className="fj-season-grid">
        <SeasonCard season="Spring" />
        <SeasonCard season="Summer" />
      </div>
    </>
  );
}

function SeasonsRight() {
  return (
    <>
      <div className="fj-season-grid fj-season-grid--top-pad">
        <SeasonCard season="Autumn" />
        <SeasonCard season="Winter" />
      </div>
      <p className="fj-script fj-hint-line">
        every list above comes straight from the produce guide · <Icon name="leaf" size={12} />
      </p>
    </>
  );
}

/* Spread 5 — Your Market Field Guide (tips + why FreshFind + ways back to the app) */
const WHY_FRESHFIND = [
  { ico: 'checkc', t: 'Accurate Information', d: 'Market details, schedules and produce all in one place.' },
  { ico: 'leaf', t: 'Seasonal Guidance', d: "Know what's likely to be available before you visit." },
  { ico: 'users', t: 'Support Local', d: 'Discover local farmers and markets in your community.' },
  { ico: 'star', t: 'Easy to Use', d: 'Simple, accessible experience for everyone.' },
];
const FIELD_TIPS = [
  'Arrive early for the best pick — or late for end-of-day bargains.',
  'Bring cash; some small growers don’t take cards.',
  'Carry your own bags or a basket.',
  'Talk to the growers — they’ll tell you what’s best that morning.',
  'Buy seasonal for the best flavour and price.',
  'Ask about refill and deposit schemes.',
];

function GuideLeft() {
  return (
    <>
      <JournalHead eyebrow="your market field guide" title="Pocket tips for market day" />
      <ul className="fj-tips">
        {FIELD_TIPS.map((t) => (
          <li key={t} className="fj-tip">
            <span className="fj-tip-check" aria-hidden="true"><Icon name="check" size={12} /></span>
            {t}
          </li>
        ))}
      </ul>
    </>
  );
}

function GuideRight({ onCloseBook }) {
  const navigate = useNavigate();
  return (
    <>
      <JournalHead eyebrow="a final field note" title="Why FreshFind?" />
      <p className="fj-body fj-body-sm">Everything you need to connect with local food.</p>
      <ul className="fj-benefits">
        {WHY_FRESHFIND.map((benefit) => (
          <li key={benefit.t} className="fj-benefit">
            <span className="fj-benefit-icon" aria-hidden="true"><Icon name={benefit.ico} size={17} /></span>
            <div>
              <h4>{benefit.t}</h4>
              <p>{benefit.d}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="fj-cta-stack">
        <button className="fj-stamp-btn fj-stamp-btn--big" onClick={() => navigate('/markets')}>
          <Icon name="store" size={16} /> Browse the Market Directory
        </button>
        <button className="fj-stamp-btn fj-stamp-btn--big fj-stamp-btn--alt" onClick={() => navigate('/#produce')}>
          <Icon name="basket" size={16} /> Explore the Produce Guide
        </button>
      </div>
      <div className="fj-end-mark" aria-hidden="true">
        <SunDoodle width={44} height={44} />
        <span className="fj-script">fresh all along · see you at the stalls</span>
        <StarDoodle width={26} height={26} />
      </div>
      <button className="fj-script fj-return-link" onClick={onCloseBook}>
        ← close the journal
      </button>
    </>
  );
}

/* page body lookup — keeps the book renderer declarative */
const LEFT_PAGES = [StoryLeft, HarvestLeft, MarketsLeft, SeasonsLeft, GuideLeft];
const RIGHT_PAGES = [StoryRight, HarvestRight, MarketsRight, SeasonsRight, GuideRight];

/* =============================================================== book */
export default function HomeJournalSection() {
  const [phase, setPhase] = useState('cover'); // cover | opening | open | closing
  const [page, setPage] = useState(0); // 0–9: the pad page the reader is on
  const spread = Math.floor(page / 2); // the book spread those pages belong to
  const [turning, setTurning] = useState(null); // { dir, target } while a leaf flips
  const [leafGo, setLeafGo] = useState(false);
  const [pick, setPick] = useState(null); // selected produce sticker id

  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767.98px)').matches);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const mm = window.matchMedia('(max-width: 767.98px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMobile = (e) => {
      setIsMobile(e.matches);
      // single pad pages fold back into a two-page spread on larger screens
      if (!e.matches) setPage((p) => Math.floor(p / 2) * 2);
    };
    const onMotion = (e) => setReducedMotion(e.matches);
    mm.addEventListener('change', onMobile);
    rm.addEventListener('change', onMotion);
    return () => {
      mm.removeEventListener('change', onMobile);
      rm.removeEventListener('change', onMotion);
      clearTimeout(timerRef.current);
    };
  }, []);

  const announce = (msg) => {
    if (sectionRef.current) {
      const live = sectionRef.current.querySelector('.fj-live');
      if (live) live.textContent = msg;
    }
  };

  const describePage = (p) =>
    isMobile
      ? `Page ${p + 1} of ${PAGE_COUNT}: ${SPREAD_TITLES[Math.floor(p / 2)]}.`
      : `Spread ${p / 2 + 1} of ${SPREAD_COUNT}: ${SPREAD_TITLES[p / 2]}.`;

  /* ---- cover open/close ------------------------------------------------ */
  const openBook = () => {
    if (phase !== 'cover') return;
    if (reducedMotion) {
      setPhase('open');
      announce(`The FreshFind Field Journal is open. ${describePage(0)}`);
      return;
    }
    setPhase('opening');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('open');
      announce(`The FreshFind Field Journal is open. ${describePage(0)}`);
    }, 700);
  };

  const closeBook = () => {
    if (phase !== 'open' || turning) return;
    if (reducedMotion) {
      setPhase('cover');
      setPage(0);
      announce('The FreshFind Field Journal is closed.');
      return;
    }
    setPhase('closing');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('cover');
      setPage(0);
      announce('The FreshFind Field Journal is closed.');
    }, 600);
  };

  /* ---- page turns ------------------------------------------------------ */
  const commitTurn = (target) => {
    clearTimeout(timerRef.current);
    setPage(target);
    setTurning(null);
    setLeafGo(false);
    announce(describePage(target));
  };

  const startTurn = (dir) => {
    if (phase !== 'open' || turning) return;
    // the book flips a full two-page spread; the pad turns one page
    const step = isMobile ? 1 : 2;
    const target = dir === 'next' ? page + step : page - step;
    if (target < 0 || target >= PAGE_COUNT) return;
    if (reducedMotion || isMobile) {
      commitTurn(target); // instant, safe for rapid interaction
      return;
    }
    setTurning({ dir, target });
    // mount the leaf at its start angle, then kick it to the end angle
    requestAnimationFrame(() => requestAnimationFrame(() => setLeafGo(true)));
    // safety net in case transitionend never fires
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commitTurn(target), 900);
  };

  const onLeafEnd = (e) => {
    if (e.propertyName !== 'transform' || !turning) return;
    commitTurn(turning.target);
  };

  const goTo = (i) => {
    if (phase !== 'open' || turning || i === spread) return;
    setPage(i * 2);
    announce(describePage(i * 2));
  };

  const onSectionKey = (e) => {
    if (phase !== 'open' || turning) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); startTurn('next'); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); startTurn('prev'); }
  };

  const bookOpen = phase === 'open' || phase === 'opening' || phase === 'closing';
  const busy = turning !== null || phase === 'opening' || phase === 'closing';

  /* page bodies — during a flip the base shows the incoming pages */
  const leftIdx = turning && turning.dir === 'prev' ? turning.target / 2 : spread;
  const rightIdx = turning && turning.dir === 'next' ? turning.target / 2 : spread;
  const LeftBody = LEFT_PAGES[leftIdx];
  const RightBody = RIGHT_PAGES[rightIdx];
  /* the turnover pad shows exactly one side of the current spread */
  const MobileBody = page % 2 === 0 ? LEFT_PAGES[spread] : RIGHT_PAGES[spread];
  let LeafFront = null;
  let LeafBack = null;
  if (turning) {
    if (turning.dir === 'next') { LeafFront = RIGHT_PAGES[spread]; LeafBack = LEFT_PAGES[turning.target / 2]; }
    else { LeafFront = RIGHT_PAGES[turning.target / 2]; LeafBack = LEFT_PAGES[spread]; }
  }
  const leafFrom = turning && turning.dir === 'prev' ? -165 : 0;
  const leafTo = turning && turning.dir === 'next' ? -165 : 0;
  const lastPage = isMobile ? PAGE_COUNT - 1 : PAGE_COUNT - 2;

  return (
    <section id="journal" className="home-journal band" aria-labelledby="journal-heading" ref={sectionRef} onKeyDown={onSectionKey}>
      <span className="visually-hidden fj-live" aria-live="polite" />
      <div className="fj-deco fj-deco--sprig" aria-hidden="true"><Sprig width={92} height={92} /></div>
      <div className="fj-deco fj-deco--swirl" aria-hidden="true"><SwirlDoodle width={110} height={110} color="var(--sage-dust)" /></div>

      <div className="container" style={{ maxWidth: '80rem' }}>
        <div className="fj-section-head">
          <span className="fj-eyebrow">
            <StarDoodle width={16} height={16} /> keep flipping, it’s alive
          </span>
          <h2 id="journal-heading" className="fj-section-title">
            <span className="fj-title-script">The FreshFind</span>
            <span className="fj-title-main">Field Journal</span>
          </h2>
          <svg className="about-title-underline" width="150" height="10" viewBox="0 0 150 10" aria-hidden="true">
            <path d="M4 7 C30 2 52 9 76 5 C100 1 126 8 146 4" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="fj-section-sub">
            A hand-drawn scrapbook of our markets, harvests and seasons — open the cover and turn the pages.
          </p>
        </div>

        {/* --------------------------------------------------- CLOSED COVER */}
        {phase === 'cover' && (
          <div className="fj-cover-stage">
            <button className="fj-cover" onClick={openBook} aria-label="Open The FreshFind Field Journal">
              <span className="fj-cover-edge" aria-hidden="true" />
              <span className="fj-cover-band" aria-hidden="true">
                <span className="fj-cover-band-mark"><Icon name="leaf" size={22} /></span>
              </span>
              <span className="fj-cover-inner">
                <span className="fj-cover-eyebrow">est. 2026 · market season edition</span>
                <span className="fj-cover-title-script">The FreshFind</span>
                <span className="fj-cover-title-main">Field Journal</span>
                <svg width="140" height="10" viewBox="0 0 140 10" aria-hidden="true">
                  <path d="M4 6 C28 1.5 48 8 72 4 C96 0.5 116 7 136 3.5" fill="none" stroke="var(--honey)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="fj-cover-doodles" aria-hidden="true">
                  <TomatoDoodle width={46} height={46} />
                  <Sprig width={46} height={46} />
                  <CarrotDoodle width={46} height={46} />
                </span>
                <span className="fj-cover-sub">notes, stickers &amp; stamps from the stalls</span>
                <span className="fj-cover-cta"><Icon name="chevron" size={14} /> Open the journal</span>
              </span>
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- BOOK */}
        {bookOpen && (
          <div className={`fj-book-stage${phase === 'opening' ? ' is-opening' : ''}${phase === 'closing' ? ' is-closing' : ''}`}>
            <div className={`fj-book${isMobile ? ' fj-book--mobile' : ''}`}>
              {isMobile ? (
                /* turnover pad — a single page at a time, same paper styling */
                <div className="fj-sheet" key={page}>
                  <div className="fj-sheet-page">
                    <MobileBody pick={pick} onPick={setPick} selected={pick} onCloseBook={closeBook} />
                  </div>
                </div>
              ) : (
                <div className="fj-pages">
                  <div className="fj-page fj-page--left">
                    <div className="fj-page-inner">
                      <LeftBody pick={pick} onPick={setPick} selected={pick} onCloseBook={closeBook} />
                    </div>
                  </div>
                  <div className="fj-spine" aria-hidden="true" />
                  <div className="fj-page fj-page--right">
                    <div className="fj-page-inner">
                      <RightBody pick={pick} onPick={setPick} selected={pick} onCloseBook={closeBook} />
                    </div>
                  </div>
                  <div className="fj-stack fj-stack--left" aria-hidden="true" />
                  <div className="fj-stack fj-stack--right" aria-hidden="true" />

                  {turning && (
                    <div
                      className="fj-leaf"
                      style={{ transform: `rotateY(${leafGo ? leafTo : leafFrom}deg)` }}
                      onTransitionEnd={onLeafEnd}
                    >
                      <div className="fj-leaf-face fj-leaf-face--front">
                        <div className="fj-page-inner">
                          <LeafFront pick={pick} onPick={setPick} selected={pick} onCloseBook={closeBook} />
                        </div>
                        <div className="fj-leaf-shade fj-leaf-shade--front" aria-hidden="true" />
                      </div>
                      <div className="fj-leaf-face fj-leaf-face--back">
                        <div className="fj-page-inner">
                          <LeafBack pick={pick} onPick={setPick} selected={pick} onCloseBook={closeBook} />
                        </div>
                        <div className="fj-leaf-shade fj-leaf-shade--back" aria-hidden="true" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* flipping cover overlay while opening/closing */}
            {phase !== 'open' && (
              <div className="fj-cover-overlay" aria-hidden="true">
                <div className={`fj-cover fj-cover--overlay${phase === 'opening' ? ' flip-out' : ' flip-in'}`}>
                  <span className="fj-cover-edge" />
                  <span className="fj-cover-band"><span className="fj-cover-band-mark"><Icon name="leaf" size={22} /></span></span>
                  <span className="fj-cover-inner">
                    <span className="fj-cover-eyebrow">est. 2026 · market season edition</span>
                    <span className="fj-cover-title-script">The FreshFind</span>
                    <span className="fj-cover-title-main">Field Journal</span>
                    <span className="fj-cover-doodles">
                      <TomatoDoodle width={40} height={40} />
                      <Sprig width={40} height={40} />
                      <CarrotDoodle width={40} height={40} />
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* controls */}
            <div className="fj-controls">
              <button className="fj-btn" onClick={() => startTurn('prev')} disabled={busy || page === 0} aria-label="Turn to the previous spread">
                <Icon name="chevronL" size={15} /> Previous
              </button>
              <div className="fj-track" role="group" aria-label="Journal spreads">
                <span className="fj-progress">
                  {isMobile ? `Page ${page + 1} of ${PAGE_COUNT}` : `Spread ${spread + 1} of ${SPREAD_COUNT}`}
                </span>
                <div className="fj-dots">
                  {SPREAD_TITLES.map((t, i) => (
                    <button
                      key={t}
                      className={`fj-dot${i === spread ? ' on' : ''}`}
                      disabled={busy}
                      aria-label={`Go to spread ${i + 1}: ${t}`}
                      aria-current={i === spread ? 'true' : undefined}
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>
              </div>
              <button className="fj-btn" onClick={() => startTurn('next')} disabled={busy || page >= lastPage} aria-label="Turn to the next spread">
                Next <Icon name="chevron" size={15} />
              </button>
              <button className="fj-btn fj-btn--close" onClick={closeBook} disabled={busy} aria-label="Close the journal and return to its cover">
                <Icon name="x" size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
