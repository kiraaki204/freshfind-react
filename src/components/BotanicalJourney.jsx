import { useEffect, useRef } from 'react';

/* =====================================================================
   BotanicalJourney — a scroll-driven growth journey for FreshFind.

   A thin, slightly organic stem line runs down the outer margin of the
   page and draws itself in step with the reader's actual document scroll
   progress. Along it, four growth stages sit at fixed stations — seed at
   the top, seedling in the upper section, young plant around the middle,
   and the mature plant at the foot of the line.

   Each stage appears as the growth line reaches it: the seed is visible
   from the very top of the page, the seedling fades in after a small
   scroll, the young plant around the middle, and the mature plant near
   the bottom. Revealed stages stay visible, so the rail always shows a
   complete growth timeline, and scrolling back up reverses the reveal.

   Every stage lives in its own tightly cropped SVG viewport sized with
   CSS clamp(), so the illustrations stay recognizable no matter how
   narrow the responsive rail becomes — the narrow 72-unit rail viewBox
   is never used to scale plant art. Each viewport is anchored to the
   rail centre with the CSS `translate` property, which composes with the
   JS-driven `transform: scale()` instead of being clobbered by it.

   Implementation notes:
   - no state updates on scroll: progress is written straight to the DOM
     inside a requestAnimationFrame tick,
   - a single passive scroll listener plus a resize listener, both cleaned
     up on unmount,
   - purely decorative: pointer-events: none and aria-hidden,
   - prefers-reduced-motion is handled in CSS (transitions removed), the
     journey itself stays scroll-linked and therefore never self-animates.
   ===================================================================== */

/* smooth 0→1 ramp between a and b (smoothstep, so no abrupt switching) */
function ramp(p, a, b) {
  if (p <= a) return 0;
  if (p >= b) return 1;
  const t = (p - a) / (b - a);
  return t * t * (3 - 2 * t);
}

function stageOpacities(progress) {
  // Progressive reveal: the seed is present from the start and each later
  // stage fades in as the growth line reaches its station. Stages never
  // cross-fade away — once grown, a stage stays fully visible, and only
  // scrolling back up (lowering progress) hides the later ones again.
  return [
    1,
    ramp(progress, 0.12, 0.26), // seedling: after a small scroll
    ramp(progress, 0.42, 0.58), // young plant: around the middle
    ramp(progress, 0.72, 0.9), // mature plant: near the bottom
  ];
}

export default function BotanicalJourney() {
  const rootRef = useRef(null);
  const stemRef = useRef(null);
  const stageRefs = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    const stem = stemRef.current;
    if (!root || !stem) return undefined;

    const length = stem.getTotalLength();
    stem.style.strokeDasharray = `${length}`;
    stem.style.strokeDashoffset = `${length}`;

    let frame = 0;
    let last = -1;

    const apply = () => {
      frame = 0;
      const doc = document.documentElement;
      const body = document.body;
      const pageHeight = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        body?.scrollHeight || 0,
        body?.offsetHeight || 0,
      );
      const viewportHeight = doc.clientHeight || window.innerHeight;
      const scrollable = pageHeight - viewportHeight;
      const scrollTop = window.scrollY ?? doc.scrollTop ?? body?.scrollTop ?? 0;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
      if (Math.abs(p - last) < 0.0015) return;
      last = p;

      stem.style.strokeDashoffset = `${length * (1 - Math.max(0.04, p))}`;
      root.style.setProperty('--journey-progress', p.toFixed(4));

      const values = stageOpacities(p);
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        const value = values[i];
        el.style.opacity = value.toFixed(3);
        el.style.transform = `scale(${(0.88 + 0.12 * value).toFixed(3)})`;
        // Exclude fully transparent stages from painting until their reveal.
        el.style.visibility = value > 0.004 ? 'visible' : 'hidden';
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const setStage = (i) => (el) => { stageRefs.current[i] = el; };
  const initialHidden = { opacity: 0, visibility: 'hidden', transform: 'scale(.88)' };

  return (
    <div className="ff-journey" ref={rootRef} aria-hidden="true">
      <svg
        className="ff-journey-svg"
        viewBox="0 0 72 620"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* the growth line: gently organic, thin, muted botanical green */}
        <path
          ref={stemRef}
          className="ff-journey-line"
          d="M36 6 C30 70 42 108 37 168 C32 228 44 264 38 320 C33 372 43 408 37 452 C33 478 39 510 36 548"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* CSS/inline defaults make the seed the only stage on first paint,
          before the effect has measured the document. Each stage sits in
          its own cropped viewport centred on the rail; CSS supplies the
          position and width for every breakpoint. */}

      {/* 1 — seed, at the top of the rail where the growth line starts */}
      <svg
        className="ff-stage"
        data-stage="seed"
        ref={setStage(0)}
        viewBox="23 86 28 26"
        style={{ opacity: 1, visibility: 'visible', transform: 'scale(1)' }}
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="ff-fill-soft" cx="36" cy="99" rx="9" ry="12" transform="rotate(-12 36 99)" />
        <path className="ff-stroke-seed" d="M32 91 C35.5 96 37 102 36 108" />
      </svg>

      {/* 2 — seedling, in the upper section of the rail */}
      <svg
        className="ff-stage"
        data-stage="seedling"
        ref={setStage(1)}
        viewBox="17 55 38 53"
        style={initialHidden}
        aria-hidden="true"
        focusable="false"
      >
        <path className="ff-stroke" d="M36 106 C36 90 36.7 75 37.5 61" strokeWidth="2" />
        <path className="ff-stroke-soft" d="M36.6 84 C26.5 83 19.5 76.5 19 67 C28.6 68.3 35 74.8 36.6 84 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37.2 76 C46.2 73.8 52 66.8 52 57.5 C43.2 60 37.8 67 37.2 76 Z" strokeWidth="1.5" />
      </svg>

      {/* 3 — young plant, around the middle of the rail */}
      <svg
        className="ff-stage"
        data-stage="young"
        ref={setStage(2)}
        viewBox="15 23 42 85"
        style={initialHidden}
        aria-hidden="true"
        focusable="false"
      >
        <path className="ff-stroke" d="M36 106 C36 81 37.2 57 38.5 32" strokeWidth="2" />
        <path className="ff-stroke-soft" d="M36.3 91 C25.8 90 18 83 17.2 72.5 C27.7 74 34.8 81 36.3 91 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37 75 C47.5 73 54.5 65.2 54.8 54.5 C44.5 57 37.8 64.8 37 75 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37.8 57.5 C29.2 55.8 23.2 49.2 22.7 40.2 C31.2 42.2 37 48.9 37.8 57.5 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M38.2 42 C45.5 40 50.2 33.5 50.5 25.2 C43.2 27.3 38.8 33.8 38.2 42 Z" strokeWidth="1.5" />
      </svg>

      {/* 4 — adult plant, at the foot of the rail */}
      <svg
        className="ff-stage"
        data-stage="mature"
        ref={setStage(3)}
        viewBox="13 4 46 104"
        style={initialHidden}
        aria-hidden="true"
        focusable="false"
      >
        <path className="ff-stroke" d="M36 106 C36 77 37.5 43 39 12" strokeWidth="2.1" />
        <path className="ff-stroke-soft" d="M36.2 95 C24.8 94 16 86 15 74 C26.7 76 34.5 83.8 36.2 95 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37 80 C48.5 77.5 56.2 68.5 56.5 56.5 C45 59.3 37.8 68 37 80 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37.7 63 C28 61 21 53.2 20.5 42.7 C30.2 45.2 37 52.7 37.7 63 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M38.4 46 C47.5 43.8 53.5 36 53.8 26 C44.7 28.7 39.1 36 38.4 46 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M38.9 29 C31.2 27.2 26 20.7 25.5 12 C33.2 14.2 38.4 20.5 38.9 29 Z" strokeWidth="1.5" />
        <path className="ff-stroke-soft" d="M37.3 67 C44 59 48 51.5 48.8 42.5" strokeWidth="1.2" />
        <path className="ff-stroke-soft" d="M36.7 84 C29.8 76.8 26 70 25 62" strokeWidth="1.2" />
        <circle className="ff-fill-soft" cx="39.2" cy="9" r="3.5" />
      </svg>
    </div>
  );
}
