import { useEffect, useRef } from 'react';

/* =====================================================================
   BotanicalJourney — a scroll-driven growth journey for FreshFind.

   A thin, slightly organic stem line runs down the outer margin of the
   page and draws itself in step with the reader's actual document scroll
   progress. At its foot the same plant develops through four stages —
   seed → seedling → young plant → mature plant — cross-fading smoothly so
   scrolling back up reverses the growth and scrolling down resumes it.

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
      const scrollable = (doc.scrollHeight || 0) - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (Math.abs(p - last) < 0.0015) return;
      last = p;

      stem.style.strokeDashoffset = `${length * (1 - Math.max(0.04, p))}`;
      root.style.setProperty('--journey-progress', p.toFixed(4));

      /* overlapping ramps → one continuous growth rather than four swaps */
      const seed = 1 - ramp(p, 0.08, 0.24);
      const seedling = ramp(p, 0.08, 0.26) * (1 - ramp(p, 0.36, 0.52));
      const young = ramp(p, 0.36, 0.52) * (1 - ramp(p, 0.62, 0.78));
      const mature = ramp(p, 0.62, 0.78);
      const values = [seed, seedling, young, mature];
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        const v = values[i];
        el.style.opacity = v.toFixed(3);
        el.style.transform = `scale(${(0.82 + 0.18 * v).toFixed(3)})`;
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

  return (
    <div className="ff-journey" ref={rootRef} aria-hidden="true">
      <svg
        className="ff-journey-svg"
        viewBox="0 0 72 620"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* the growth line: gently organic, thin, muted botanical green */}
        <path
          ref={stemRef}
          className="ff-journey-line"
          d="M36 6 C30 70 42 108 37 168 C32 228 44 264 38 320 C33 372 43 408 37 452 C33 452 37 462 37 470"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* --- stage 1 · seed --- */}
        <g className="ff-stage" ref={setStage(0)}>
          <ellipse className="ff-fill-soft" cx="36" cy="556" rx="7" ry="9.5" transform="rotate(-12 36 556)" />
          <path className="ff-stroke" d="M33 550 C35.5 554 36.6 559 36 563" strokeWidth="1" />
        </g>

        {/* --- stage 2 · seedling --- */}
        <g className="ff-stage" ref={setStage(1)}>
          <path className="ff-stroke" d="M36 566 C36 552 36.6 542 37 534" strokeWidth="1.5" />
          <path className="ff-stroke-soft" d="M36.4 546 C30 545 25.6 540.6 25 534 C31.4 535 35.4 539.4 36.4 546 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M37.2 540 C43 538.4 46.6 533.6 46.6 527.4 C41 529 37.6 533.6 37.2 540 Z" strokeWidth="1.1" />
        </g>

        {/* --- stage 3 · young plant --- */}
        <g className="ff-stage" ref={setStage(2)}>
          <path className="ff-stroke" d="M36 566 C36 544 37 524 38 506" strokeWidth="1.5" />
          <path className="ff-stroke-soft" d="M36.3 552 C29 551 23.4 545.6 22.8 538 C30.2 539.2 35.2 544.4 36.3 552 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M37 538 C44.4 536.4 49.4 530.6 49.6 523 C42.4 524.8 37.6 530.4 37 538 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M37.6 522 C31.4 520.6 27 515.6 26.6 509 C32.8 510.6 37 515.6 37.6 522 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M38 510 C43.4 508.4 46.8 503.6 47 497.4 C41.6 499 38.4 503.8 38 510 Z" strokeWidth="1.1" />
        </g>

        {/* --- stage 4 · mature plant --- */}
        <g className="ff-stage" ref={setStage(3)}>
          <path className="ff-stroke" d="M36 566 C36 540 37.4 512 38.6 482" strokeWidth="1.6" />
          <path className="ff-stroke-soft" d="M36.2 556 C28 555 21.6 549 21 540.4 C29.4 541.8 35 547.6 36.2 556 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M37 542 C45.2 540.2 50.8 533.8 51 525.2 C42.8 527.2 37.6 533.4 37 542 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M37.6 526 C30.6 524.6 25.6 519 25.2 511.4 C32.2 513.2 37 518.6 37.6 526 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M38.2 510 C44.8 508.4 49.2 502.8 49.4 495.6 C42.8 497.6 38.8 502.8 38.2 510 Z" strokeWidth="1.1" />
          <path className="ff-stroke-soft" d="M38.6 494 C33 492.8 29.2 488 28.8 481.6 C34.4 483.2 38.2 487.8 38.6 494 Z" strokeWidth="1.1" />
          {/* two small side branches keep it botanical rather than symmetrical */}
          <path className="ff-stroke-soft" d="M37.2 530 C42 524 45 518.6 45.6 512" strokeWidth=".9" />
          <path className="ff-stroke-soft" d="M36.6 546 C31.6 540.6 28.8 535.6 28 529.6" strokeWidth=".9" />
          <circle className="ff-fill-soft" cx="38.8" cy="479" r="2.6" />
        </g>
      </svg>
    </div>
  );
}
