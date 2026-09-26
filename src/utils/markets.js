import { haversine } from './geo.js';
import { DAY_NAMES } from './time.js';

/** Free-text match used by the directory search box and the chatbot. */
export function marketMatchesQuery(market, query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return true;
  const haystack =
    market.name + market.location + market.area + market.description +
    market.produce.join(' ') + market.tags.join(' ');
  return haystack.toLowerCase().indexOf(q) !== -1;
}

/** Image paths are stored with a leading slash; missing images fall back
    to the hero shot (same behaviour as before the React migration). */
export function imgPath(p) {
  if (!p) return '/images/hero-market.jpg';
  return String(p);
}

/** Where a market tag/category badge should navigate. Produce categories go
    to the Produce Guide with that category pre-selected via URL parameter;
    Organic is a market attribute rather than a produce category, so it opens
    the Produce Guide without a filter. */
export function tagDestination() {
  /* there is no standalone produce page — the guide lives in the
     homepage produce section (#produce) */
  return '/#produce';
}

/** Directory filtering + sorting. `geo` is the shared geolocation state;
    proximity sorting only applies once a real location is granted. */
export function applyMarketFilters(list, filters, geo, now = new Date()) {
  let out = list.slice();

  if (filters.search) out = out.filter((m) => marketMatchesQuery(m, filters.search));
  if (filters.area) out = out.filter((m) => m.area === filters.area);
  if (filters.day) out = out.filter((m) => m.days.includes(filters.day));
  if (filters.produce) {
    out = filters.produce === 'Organic'
      ? out.filter((m) => m.tags.includes('Organic'))
      : out.filter((m) => m.produceTypes.includes(filters.produce) || m.tags.includes(filters.produce));
  }

  if (filters.sort === 'alpha') {
    out.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === 'proximity' && geo.lat) {
    out.sort((a, b) =>
      haversine(geo.lat, geo.lng, a.lat, a.lng) - haversine(geo.lat, geo.lng, b.lat, b.lng));
  } else if (filters.sort === 'next-open') {
    const today = now.getDay();
    const nextOpen = (m) => {
      for (let i = 0; i <= 7; i += 1) {
        if (m.days.includes(DAY_NAMES[(today + i) % 7])) return i;
      }
      return 7;
    };
    out.sort((a, b) => nextOpen(a) - nextOpen(b));
  } else if (filters.sort === 'rating') {
    out.sort((a, b) => b.rating - a.rating);
  }

  return out;
}
