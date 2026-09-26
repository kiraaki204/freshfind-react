/* Geolocation + distance helpers. Coordinates only ever come from the
   browser's geolocation API — never invented. */

export const NEAR_RADIUS_KM = 25; // what we consider "nearby" for a real user location

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Markets sorted by true distance from a (geolocated) user. */
export function nearbyMarkets(list, user, radius = NEAR_RADIUS_KM) {
  const sorted = list.map((m) => ({ m, d: haversine(user.lat, user.lng, m.lat, m.lng) }));
  sorted.sort((a, b) => a.d - b.d);
  return { sorted, near: sorted.filter((x) => x.d <= radius) };
}

/** The directory is the single source of truth for visible markers.
    Geolocation adds distance context; it must never silently filter results. */
export function visibleMarkets(list, user) {
  return { displayed: list, focused: false, nearInfo: user ? nearbyMarkets(list, user) : null };
}

export function fmtDist(km) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km).toLocaleString()} km`;
}

export function geoErrorMessage(err) {
  if (err && err.code === 1) return 'Location permission denied';
  if (err && err.code === 3) return 'Location timed out';
  return 'Location unavailable on this device';
}

/* The browser's `timeout` countdown starts when getCurrentPosition() is
   CALLED — before the user has even seen the permission prompt. A single
   short attempt therefore "times out" whenever the user needs a moment to
   click Allow or the desktop OS location service is slow to warm up.

   Strategy: attempt 1 — normal (low-power) accuracy, sensible 10 s budget,
   accepts a ≤5 min cached fix; attempt 2 — ONLY if attempt 1 TIMED OUT
   (code 3): by then the prompt is settled and the service warm, so a lenient
   retry (20 s, ≤10 min cache) almost always succeeds; denied (1) /
   unavailable (2) are reported immediately and never retried. */
export function requestBrowserLocation(onPos, onErr) {
  if (!navigator.geolocation) {
    onErr({ code: 2 });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    onPos,
    (err1) => {
      if (err1 && err1.code === 3) {
        navigator.geolocation.getCurrentPosition(onPos, onErr, {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 600000,
        });
        return;
      }
      onErr(err1);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}
