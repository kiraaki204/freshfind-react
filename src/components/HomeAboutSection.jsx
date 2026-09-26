import { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';

/* Homepage About section — a hand-drawn market-stall illustration with
   interactive hotspots that explain FreshFind's three core features. All
   copy is factual about the demo app: sample data, browser-only storage,
   and the two third-party services (OpenStreetMap tiles, Google Maps). */

const HOTSPOTS = [
  {
    id: 'directory',
    icon: 'pin',
    label: 'Market Directory',
    pos: { left: '2%', top: '7%' },
    blurb:
      'Search the demo directory of 8 sample markets by name, area or produce. Filter by market day, ' +
      'sort by rating or next opening — or flip to the map view and tap a red marker.',
    link: { label: 'Open the Market Directory', to: '/markets' },
  },
  {
    id: 'produce',
    icon: 'carrot',
    label: 'Produce Guide',
    pos: { right: '2%', top: '36%' },
    blurb:
      'Browse produce by category or season and open any item for storage tips, nutrition highlights ' +
      'and the sample markets where it is typically listed.',
    link: { label: 'Open the Produce Guide', to: '/produce' },
  },
  {
    id: 'saved',
    icon: 'heart',
    label: 'Saved Items',
    pos: { left: '2%', top: '44%' },
    blurb:
      'Tap the heart on any market or produce card to keep it. Saved items live only in your browser’s ' +
      'local storage — add personal notes and export the list whenever you like.',
    link: { label: 'Open Saved Items', to: '/saved' },
  },
];

const STEPS = [
  { n: '01', icon: 'search', t: 'Find your market', d: 'Search and filter the directory by name, area, day or what’s sold.' },
  { n: '02', icon: 'clock', t: 'Know before you go', d: 'Live open status, weekly schedules and seasonal produce lists.' },
  { n: '03', icon: 'heart', t: 'Keep your favourites', d: 'Save markets and produce with personal notes, stored in your browser.' },
];

/* Hand-drawn farmers-market stall. Decorative only — the hotspot pills
   carry the interactive content. */
function StallIllustration() {
  const canopy =
    'M92 106 L104 62 Q210 40 316 62 L328 106 ' +
    'a19.6 12 0 0 1 -39.3 0 a19.6 12 0 0 1 -39.3 0 a19.6 12 0 0 1 -39.4 0 ' +
    'a19.6 12 0 0 1 -39.3 0 a19.6 12 0 0 1 -39.4 0 a19.6 12 0 0 1 -39.3 0 z';
  return (
    <svg viewBox="0 0 420 330" className="about-illus" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="about-awning"><path d={canopy} /></clipPath>
      </defs>

      {/* sun */}
      <g stroke="#d97706" strokeWidth="2" strokeLinecap="round">
        <circle cx="356" cy="44" r="17" fill="#fde68a" />
        <path d="M356 14 v-8 M356 74 v8 M326 44 h-8 M386 44 h8 M335 23 l-6 -6 M377 65 l6 6 M377 23 l6 -6 M335 65 l-6 6" />
      </g>

      {/* birds */}
      <g fill="none" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round">
        <path d="M46 42 q5 -6 10 0 q5 -6 10 0" />
        <path d="M76 28 q4 -5 8 0 q4 -5 8 0" />
      </g>

      {/* awning */}
      <path d={canopy} fill="#fffdf5" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
      <g clipPath="url(#about-awning)">
        <rect x="131.3" y="30" width="39.4" height="100" fill="#16a34a" />
        <rect x="210" y="30" width="39.4" height="100" fill="#16a34a" />
        <rect x="288.6" y="30" width="39.4" height="100" fill="#16a34a" />
      </g>
      <path d={canopy} fill="none" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />

      {/* hanging sign with heart */}
      <g strokeLinecap="round">
        <path d="M126 114 L126 134 M174 114 L174 134" stroke="#8a6a3a" strokeWidth="2" />
        <rect x="118" y="134" width="64" height="32" rx="6" fill="#fdf6e3" stroke="#8a6a3a" strokeWidth="2" />
        <path
          d="M150 159 c-4.5 -6 -11 -9 -11 -14 a5.5 5.5 0 0 1 11 -2 a5.5 5.5 0 0 1 11 2 c0 5 -6.5 8 -11 14 z"
          fill="#dc2626"
        />
      </g>

      {/* posts */}
      <path d="M100 116 Q98 210 101 300" fill="none" stroke="#8a6a3a" strokeWidth="3" strokeLinecap="round" />
      <path d="M322 116 Q324 210 321 300" fill="none" stroke="#8a6a3a" strokeWidth="3" strokeLinecap="round" />

      {/* crates on the counter */}
      <g strokeWidth="2" strokeLinejoin="round">
        {/* tomatoes */}
        <path d="M112 190 L164 190 L161 216 L115 216 z" fill="#f7ead2" stroke="#8a6a3a" />
        <path d="M113.5 203 L162.5 203" fill="none" stroke="#d8c39a" />
        <circle cx="124" cy="183" r="6.5" fill="#f87171" stroke="#b91c1c" />
        <circle cx="138" cy="181" r="6.5" fill="#f87171" stroke="#b91c1c" />
        <circle cx="152" cy="183" r="6.5" fill="#f87171" stroke="#b91c1c" />
        <path d="M138 174 q2 -4 5 -3" fill="none" stroke="#16a34a" strokeLinecap="round" />

        {/* carrots */}
        <path d="M186 190 L238 190 L235 216 L189 216 z" fill="#f7ead2" stroke="#8a6a3a" />
        <path d="M187.5 203 L236.5 203" fill="none" stroke="#d8c39a" />
        <path d="M196 178 L206 178 L201 199 z" fill="#fb923c" stroke="#ea580c" />
        <path d="M214 176 L224 176 L219 197 z" fill="#fb923c" stroke="#ea580c" />
        <path d="M201 176 q-2 -5 -5 -6 M201 176 q2 -5 6 -5 M219 174 q-2 -5 -5 -6 M219 174 q2 -5 6 -5"
          fill="none" stroke="#16a34a" strokeLinecap="round" />

        {/* leafy greens */}
        <path d="M258 190 L310 190 L307 216 L261 216 z" fill="#f7ead2" stroke="#8a6a3a" />
        <path d="M259.5 203 L308.5 203" fill="none" stroke="#d8c39a" />
        <ellipse cx="272" cy="183" rx="8" ry="6" fill="#86efac" stroke="#16a34a" />
        <ellipse cx="288" cy="179" rx="9" ry="7" fill="#86efac" stroke="#16a34a" />
        <ellipse cx="301" cy="184" rx="7" ry="5.5" fill="#86efac" stroke="#16a34a" />
        <path d="M284 177 q4 2 8 0" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* counter */}
      <g strokeWidth="2" strokeLinejoin="round">
        <path d="M92 216 L330 216 L326 236 L96 236 z" fill="#f4e3c2" stroke="#8a6a3a" />
        <path d="M96 236 L326 236 L322 300 L100 300 z" fill="#efe0c4" stroke="#8a6a3a" />
        <path d="M140 240 L139 296 M182 240 L181 296 M224 240 L223 296 M266 240 L265 296 M304 240 L303 296"
          fill="none" stroke="#d8c39a" />
      </g>

      {/* ground + tufts + flowers */}
      <path d="M24 312 Q210 302 398 312" fill="none" stroke="#d6c49b" strokeWidth="2" strokeLinecap="round" />
      <g stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M58 311 l-2 -7 M62 311 l3 -6 M360 311 l-3 -6 M364 311 l2 -7 M244 313 l-2 -6 M248 313 l3 -5" />
      </g>
      <circle cx="76" cy="301" r="2.6" fill="#f472b6" />
      <path d="M76 304 l0 7" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="342" cy="299" r="2.6" fill="#fbbf24" />
      <path d="M342 302 l0 8" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HomeAboutSection() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('directory');
  const pillRowRef = useRef(null);
  const panelId = `about-feature-${useId().replace(/:/g, '')}`;
  const active = HOTSPOTS.find((h) => h.id === activeId) ?? HOTSPOTS[0];

  const select = (id) => setActiveId(id);

  /* Left/Right/Home/End move between hotspot pills */
  const onPillKey = (e, idx) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % HOTSPOTS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + HOTSPOTS.length) % HOTSPOTS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = HOTSPOTS.length - 1;
    if (next == null) return;
    e.preventDefault();
    const pills = pillRowRef.current?.querySelectorAll('.about-hotspot');
    pills?.[next]?.focus();
    setActiveId(HOTSPOTS[next].id);
  };

  return (
    <section id="about" className="home-about" aria-labelledby="about-heading">
      {/* botanical doodles, purely decorative */}
      <div className="about-deco about-deco--sprig" aria-hidden="true">
        <svg viewBox="0 0 90 120" width="90" height="120" fill="none" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round">
          <path d="M45 112 C43 80 40 44 48 10" opacity="0.5" />
          <path d="M45 96 C30 90 22 78 22 66 C34 68 43 78 45 96Z" opacity="0.4" />
          <path d="M46 74 C60 66 66 54 64 42 C52 46 46 58 46 74Z" opacity="0.4" />
          <path d="M46 48 C34 42 28 32 30 22 C40 24 46 34 46 48Z" opacity="0.4" />
        </svg>
      </div>
      <div className="about-deco about-deco--vine" aria-hidden="true">
        <svg viewBox="0 0 100 130" width="100" height="130" fill="none" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round">
          <path d="M18 120 C12 84 30 52 66 40 C84 34 92 22 88 8" opacity="0.45" />
          <path d="M40 66 C50 68 58 64 62 56 C52 54 44 58 40 66Z" opacity="0.4" />
          <path d="M62 44 C72 46 78 42 82 34 C72 32 66 36 62 44Z" opacity="0.4" />
        </svg>
      </div>

      <div className="container" style={{ maxWidth: '80rem', position: 'relative' }}>
        <div className="row g-4 g-lg-5 align-items-center">
          {/* copy column */}
          <div className="col-lg-6">
            <span className="about-label">
              <span className="about-label-line" aria-hidden="true" />
              About FreshFind
              <span className="about-label-line" aria-hidden="true" />
            </span>
            <h2 id="about-heading" className="about-title">
              <span className="about-title-script">A market day,</span>
              <span className="about-title-main">mapped out for you.</span>
            </h2>
            <svg className="about-title-underline" width="150" height="10" viewBox="0 0 150 10" aria-hidden="true">
              <path d="M4 7 C30 2 52 9 76 5 C100 1 126 8 146 4" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="about-copy">
              FreshFind gathers your farmers&apos;-market essentials in one friendly place: a directory of
              sample markets with live open/closed status, a seasonal produce guide, and a way to keep
              your favourites saved right in your browser.
            </p>
            <p className="about-copy">
              It&apos;s a frontend demo — no accounts, no checkout and no server. Saved items, notes and
              chat history stay in your browser&apos;s local storage; the only outside services involved are
              OpenStreetMap, whose tiles draw the maps, and Google Maps, which opens when you ask for directions.
            </p>

            <div className="about-steps" aria-label="How FreshFind works">
              <h3 className="about-steps-title">
                <Icon name="sprout" size={16} /> How FreshFind works
              </h3>
              <ol className="about-steps-list">
                {STEPS.map((s) => (
                  <li key={s.n} className="about-step">
                    <span className="about-step-num" aria-hidden="true">{s.n}</span>
                    <span className="about-step-ico" aria-hidden="true"><Icon name={s.icon} size={18} /></span>
                    <div>
                      <span className="about-step-t">{s.t}</span>
                      <span className="about-step-d">{s.d}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn-green" onClick={() => navigate('/markets')}>
                <Icon name="store" size={16} /> Browse the Market Directory
              </button>
              <button className="btn-outline-green" onClick={() => navigate('/produce')}>
                <Icon name="carrot" size={16} /> Explore the Produce Guide
              </button>
            </div>
            <p className="about-note">
              <Icon name="info" size={13} /> All markets, produce and figures in FreshFind are sample
              data created for this demonstration.
            </p>
          </div>

          {/* illustration + hotspots column */}
          <div className="col-lg-6">
            <div className="about-scene">
              <StallIllustration />
              <div className="about-hotspots" ref={pillRowRef} role="group" aria-label="Feature hotspots">
                {HOTSPOTS.map((h, i) => (
                  <button
                    key={h.id}
                    className={`about-hotspot${activeId === h.id ? ' active' : ''}`}
                    style={h.pos}
                    aria-pressed={activeId === h.id}
                    aria-controls={panelId}
                    onClick={() => select(h.id)}
                    onKeyDown={(e) => onPillKey(e, i)}
                  >
                    <span className="about-hotspot-ring" aria-hidden="true" />
                    <Icon name={h.icon} size={14} />
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              id={panelId}
              className="about-feature-panel"
              role="region"
              aria-live="polite"
              aria-label="Selected feature details"
            >
              <span className="about-feature-ico" aria-hidden="true">
                <Icon name={active.icon} size={18} />
              </span>
              <div className="about-feature-body">
                <h3 className="about-feature-t">{active.label}</h3>
                <p className="about-feature-d">{active.blurb}</p>
                <button className="about-feature-link" onClick={() => navigate(active.link.to)}>
                  {active.link.label} <Icon name="chevron" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
