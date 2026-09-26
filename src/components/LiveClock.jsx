import { useEffect, useState } from 'react';
import { formatClockTime } from '../utils/time.js';

export default function LiveClock({ className = '' }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return <span className={`fw-semibold font-monospace ${className}`}>{formatClockTime(now)}</span>;
}
