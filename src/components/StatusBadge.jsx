import { getMarketStatus } from '../utils/time.js';

export default function StatusBadge({ market, size = 'sm' }) {
  const st = getMarketStatus(market);
  const cls = st.status === 'open' ? 'status-open' : st.status === 'opens-today' ? 'status-soon' : 'status-closed';
  const pad = size === 'md'
    ? { padding: '4px 12px', fontSize: 13 }
    : { padding: '2px 8px', fontSize: 12 };
  return (
    <span className={`rounded-pill fw-medium d-inline-flex align-items-center ${cls}`} style={pad} role="status" aria-label={`Market status: ${st.label}`}>
      {st.status === 'open' && <span className="pulse-dot me-1" />}
      {st.label}
    </span>
  );
}
