


let leafletPromise = null;

export function loadLeaflet() {
  if (!leafletPromise) leafletPromise = import('leaflet').then((mod) => mod.default);
  return leafletPromise;
}

export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';





export function addBaseTiles(L, map) {
  if (map.attributionControl) map.attributionControl.setPrefix(false);
  return L.tileLayer(OSM_TILE_URL, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
}


export function isValidCoord(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}




const PIN_PATH = 'M12 2C7.9 2 4.5 5.3 4.5 9.4c0 5.4 7.5 12.6 7.5 12.6s7.5-7.2 7.5-12.6C19.5 5.3 16.1 2 12 2z';

export function marketPinIcon(L, active = false) {
  const fill = active ? '#355b43' : '#c98a99';
  const stroke = active ? '#2a4a36' : '#a86f7e';
  return L.divIcon({
    className: 'ff-pin-icon',
    html: `<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
      <path d="${PIN_PATH}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      <circle cx="12" cy="9.4" r="2.7" fill="#fff"/></svg>`,
    iconSize: [34, 34],
    iconAnchor: [17, 33],
    popupAnchor: [0, -30],
  });
}



export function userDotIcon(L) {
  return L.divIcon({
    className: 'ff-user-icon',
    html: '<span class="ff-user-dot"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}
