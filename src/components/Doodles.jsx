/* Delicate hand-drawn botanical doodles for the FreshFind journal brand.
   Thin strokes, muted sage / dusty pink / soft gold palette.
   Pure inline SVG — no external assets. All decorative (aria-hidden). */

const BASE = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function Sparkle({ size = 24, color = '#D8B97A', className = '', style }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.5">
      <path d="M20 4 C21.5 13 25 17.5 36 20 C25 22.5 21.5 27 20 36 C18.5 27 15 22.5 4 20 C15 17.5 18.5 13 20 4 Z" fill={color} fillOpacity="0.25" />
      <circle cx="20" cy="20" r="2.4" fill={color} stroke="none" />
    </svg>
  );
}

export function StarDoodle({ size = 22, color = '#C98A99', className = '', style }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.5">
      <path d="M20 5 L23.4 15.4 L34.5 16 L25.6 22.6 L28.4 33.5 L20 27.6 L11.6 33.5 L14.4 22.6 L5.5 16 L16.6 15.4 Z" />
    </svg>
  );
}

export function FlowerDoodle({ size = 40, color = '#C98A99', center = '#D8B97A', className = '', style }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} style={style} {...BASE} strokeWidth="1.5">
      <ellipse cx="30" cy="14" rx="7" ry="9" stroke={color} />
      <ellipse cx="30" cy="46" rx="7" ry="9" stroke={color} />
      <ellipse cx="14" cy="30" rx="9" ry="7" stroke={color} />
      <ellipse cx="46" cy="30" rx="9" ry="7" stroke={color} />
      <ellipse cx="19" cy="19" rx="6.5" ry="6.5" stroke={color} opacity="0.75" />
      <ellipse cx="41" cy="19" rx="6.5" ry="6.5" stroke={color} opacity="0.75" />
      <ellipse cx="19" cy="41" rx="6.5" ry="6.5" stroke={color} opacity="0.75" />
      <ellipse cx="41" cy="41" rx="6.5" ry="6.5" stroke={color} opacity="0.75" />
      <circle cx="30" cy="30" r="6" stroke={center} fill={center} fillOpacity="0.3" />
    </svg>
  );
}

export function LeafSprig({ size = 56, color = '#8FAE90', className = '', style }) {
  /* refined sprig: one slender arching stem with three tapered leaves and a
     small bud — thin strokes, faint fill, no clip-art bulk */
  return (
    <svg viewBox="0 0 60 70" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.2">
      <path d="M33 66 C31.5 48 30.5 30 35.5 10" />
      <path d="M31.6 54 C23 51.6 18.2 45.4 18 37.6 C25.6 40 30.4 46.2 31.6 54 Z" fill={color} fillOpacity=".12" />
      <path d="M32.8 41 C41 38.4 45.4 31.6 45.2 24 C37.8 26.6 33.4 33.2 32.8 41 Z" fill={color} fillOpacity=".12" />
      <path d="M31.2 63 C25.4 61.4 22 57.6 21.4 52 C27 53.6 30.4 57.6 31.2 63 Z" fill={color} fillOpacity=".1" opacity="0.75" />
      <path d="M34.6 22 C34.4 17.6 35.6 13.6 38.4 10.4" strokeWidth=".9" opacity=".8" />
      <circle cx="35.6" cy="9" r="1.8" fill={color} fillOpacity=".35" strokeWidth=".9" />
    </svg>
  );
}

export function Vine({ width = 140, height = 60, color = '#8FAE90', className = '', style, flip = false }) {
  return (
    <svg
      viewBox="0 0 140 60"
      width={width}
      height={height}
      className={className}
      style={{ ...(flip ? { transform: 'scaleX(-1)' } : {}), ...style }}
      {...BASE}
      stroke={color}
      strokeWidth="1.5"
    >
      <path d="M6 50 C34 48 52 40 70 30 C88 20 108 16 134 10" />
      <path d="M30 46 C26 38 27 32 32 27 C37 32 37 40 30 46 Z" />
      <path d="M58 36 C54 28 55 22 60 17 C65 22 65 30 58 36 Z" />
      <path d="M92 24 C88 16 89 10 94 5 C99 10 99 18 92 24 Z" />
      <path d="M120 16 C124 12 130 12 133 15" />
      <circle cx="126" cy="26" r="2.4" fill={color} stroke="none" />
      <circle cx="44" cy="50" r="2.2" fill={color} stroke="none" />
    </svg>
  );
}

export function Squiggle({ width = 120, height = 14, color = '#D8B97A', className = '', style }) {
  return (
    <svg viewBox="0 0 120 14" width={width} height={height} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.5">
      <path d="M3 9 C16 3 26 12 39 7 C52 2 60 12 73 7 C86 2 96 12 117 6" />
    </svg>
  );
}

export function ArrowCurve({ width = 90, height = 54, color = '#6B8F6F', className = '', style, flip = false }) {
  return (
    <svg
      viewBox="0 0 90 54"
      width={width}
      height={height}
      className={className}
      style={{ ...(flip ? { transform: 'scaleX(-1)' } : {}), ...style }}
      {...BASE}
      stroke={color}
      strokeWidth="1.5"
    >
      <path d="M8 8 C30 14 52 24 66 44" />
      <path d="M56 40 L67 46 L69 34" />
      <path d="M14 6 C12 8 12 11 13 13" opacity="0.6" />
    </svg>
  );
}

export function SunDoodle({ size = 52, color = '#D8B97A', className = '', style }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.5">
      <circle cx="30" cy="31" r="11" />
      <circle cx="30" cy="31" r="4" fill={color} fillOpacity="0.3" />
      <path d="M30 9 V4 M30 56 V51 M9 31 H4 M56 31 H51 M15 16 L11 12 M49 50 L45 46 M45 16 L49 12 M15 50 L11 46" />
    </svg>
  );
}

export function TomatoDoodle({ size = 52, className = '', style }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} style={style} {...BASE} strokeWidth="1.5">
      <circle cx="30" cy="35" r="17" stroke="#D19A8C" />
      <path d="M30 18 C29 12 32 8 37 6 M30 18 C23 14 18 16 15 21 M30 18 C37 14 42 16 45 21 M23 14 C28 10 36 10 40 13" stroke="#8FAE90" />
      <path d="M19 30 C25 26 35 26 41 30" stroke="#D19A8C" opacity="0.55" />
      <circle cx="23" cy="40" r="1.8" fill="#D19A8C" stroke="none" opacity="0.6" />
    </svg>
  );
}

export function StrawberryDoodle({ size = 48, className = '', style }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} style={style} {...BASE} strokeWidth="1.5">
      <path d="M30 55 C20 46 13 36 14 24 C15 15 22 12 30 12 C38 12 45 15 46 24 C47 36 40 46 30 55 Z" stroke="#C98A99" />
      <path d="M22 12 C24 7 28 5 30 5 C32 5 36 7 38 12 M18 15 L42 15" stroke="#8FAE90" />
      <path d="M30 5 C30 9 30 11 30 13" stroke="#8FAE90" />
      <circle cx="25" cy="26" r="1.6" fill="#C98A99" stroke="none" />
      <circle cx="34" cy="30" r="1.6" fill="#C98A99" stroke="none" />
      <circle cx="27" cy="38" r="1.6" fill="#C98A99" stroke="none" />
      <circle cx="34" cy="43" r="1.6" fill="#C98A99" stroke="none" />
    </svg>
  );
}

export function CarrotDoodle({ size = 52, className = '', style }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} style={style} {...BASE} strokeWidth="1.5">
      <path d="M24 22 L44 24 L31 54 C26 52 23 45 24 36 Z" stroke="#DDB08A" />
      <path d="M28 32 L35 33 M27 41 L33 42" stroke="#DDB08A" opacity="0.7" />
      <path d="M32 22 C30 14 24 10 18 10 M34 22 C34 13 39 8 46 8 M35 21 C40 15 46 15 50 18" stroke="#8FAE90" />
    </svg>
  );
}

export function LeafPair({ size = 40, color = '#8FAE90', className = '', style }) {
  return (
    <svg viewBox="0 0 60 44" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.5">
      <path d="M30 40 C28 28 26 16 30 4" />
      <path d="M29 30 C19 28 12 21 11 12 C21 13 28 20 29 30 Z" />
      <path d="M30 22 C39 20 45 13 46 5 C37 6 31 13 30 22 Z" />
    </svg>
  );
}

/* ---------- tiny floating botanicals ----------
   Much smaller and lighter than the doodles above: these are meant to
   drift slowly through the empty margins of spacious sections. Strokes
   are thinner and the shapes simpler so they read as weightless rather
   than as illustrations. Colour defaults to currentColor so the .ff-drift
   wrapper can pick it up from the existing palette tokens. */

export function DriftLeaf({ size = 26, color = 'currentColor', className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.2">
      <path d="M12 2.5 C17.2 6 18.8 11.2 12 21.5 C5.2 11.2 6.8 6 12 2.5 Z" />
      <path d="M12 4.8 C12 10 12 15.4 12 19.8" strokeWidth=".9" opacity=".6" />
    </svg>
  );
}

export function DriftPetal({ size = 22, color = 'currentColor', className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.2">
      <path d="M12 20.5 C6.2 17.2 4.2 11 8.2 5.8 C10.4 3 13.6 3 15.8 5.8 C19.8 11 17.8 17.2 12 20.5 Z" fill={color} fillOpacity=".16" />
      <path d="M12 20.2 C12 15 12 10.2 12 5.6" strokeWidth=".9" opacity=".55" />
    </svg>
  );
}

export function DriftSprig({ size = 28, color = 'currentColor', className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} {...BASE} stroke={color} strokeWidth="1.2">
      <path d="M12 22 C12 16.4 12.2 10.8 13.4 4.2" />
      <path d="M12 16.4 C7.9 15.3 5.8 12.2 5.9 8.6 C9.2 9.7 11.2 12.4 12 16.4 Z" />
      <path d="M12.6 11.4 C15.6 10.4 17.2 7.6 17.1 4.4 C14.3 5.4 12.7 7.9 12.6 11.4 Z" />
    </svg>
  );
}

/* 12-point starburst used behind rating / badge stickers */
export function StarBurst({ size = 64, color = '#F8EFD5', className = '', style }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <path
        d="M40 3 L46 15 L59 9 L58 23 L72 24 L63 35 L75 43 L61 47 L66 60 L53 56 L50 70 L40 59 L30 70 L27 56 L14 60 L19 47 L5 43 L17 35 L8 24 L22 23 L21 9 L34 15 Z"
        fill={color}
        stroke="#B8CBB2"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Scattered sparkle cluster for section corners */
export function SparkleCluster({ className = '', style, color = '#D8B97A' }) {
  return (
    <span className={`doodle-cluster ${className}`} style={style} aria-hidden="true">
      <Sparkle size={22} color={color} className="dc-1" />
      <Sparkle size={14} color={color} className="dc-2" />
      <Sparkle size={17} color={color} className="dc-3" />
    </span>
  );
}
