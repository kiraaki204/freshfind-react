import { haversine } from './geo.js';
import { DAY_NAMES } from './time.js';


export function marketMatchesQuery(market, query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return true;
  const haystack =
    market.name + market.location + market.area + market.description +
    market.produce.join(' ') + market.tags.join(' ');
  return haystack.toLowerCase().indexOf(q) !== -1;
}



export function imgPath(p) {
  if (!p) return '/images/hero-market.jpg';
  return String(p);
}





export function tagDestination() {


  return '/#produce';
}



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
