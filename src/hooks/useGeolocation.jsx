import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { geoErrorMessage, requestBrowserLocation } from '../utils/geo.js';

const GeoContext = createContext(null);

const WHY = { 1: 'denied', 2: 'unavailable', 3: 'timed out' };

export function GeoProvider({ children }) {
  const [geo, setGeo] = useState({ lat: null, lng: null, error: null, loading: false, granted: false });
  const geoRef = useRef(geo);
  geoRef.current = geo;




  const locate = useCallback((done) => {
    const current = geoRef.current;
    if (current.granted && current.lat != null) {
      done({ lat: current.lat, lng: current.lng }, null);
      return;
    }
    setGeo((g) => ({ ...g, loading: true }));
    requestBrowserLocation(
      (pos) => {
        const user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGeo({ ...user, error: null, loading: false, granted: true });
        done(user, null);
      },
      (err) => {
        setGeo({ lat: null, lng: null, error: geoErrorMessage(err), loading: false, granted: false });
        done(null, WHY[err && err.code] || 'unavailable');
      }
    );
  }, []);

  return <GeoContext.Provider value={{ geo, locate }}>{children}</GeoContext.Provider>;
}

export function useGeolocation() {
  return useContext(GeoContext);
}
