import { useEffect, useId, useRef, useState } from 'react';
import markets from '../data/markets.json';
import { hasMeaningfulSeason } from '../utils/produce.js';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';
import StatusBadge from './StatusBadge.jsx';
import { useMarketModal } from '../hooks/useMarketModal.jsx';

export default function ProduceDetailModal({ produce, onClose }) {
  const { openMarket } = useMarketModal();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = `pd-title-${useId().replace(/:/g, '')}`;
  const [imgError, setImgError] = useState(false);

  const open = Boolean(produce);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = Array.from(dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [open, onClose]);

  useEffect(() => setImgError(false), [produce?.id]);

  if (!produce) return null;
  const p = produce;
  const mkts = markets.filter((m) => p.markets.includes(m.id));
  const showImage = p.image && !imgError;

  return (
    <div className="mm-backdrop produce-detail-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mm-dialog produce-detail-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <header className="mm-head produce-detail-head">
          <div>
            <span className="chip" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }}>{p.category}</span>
            <h2 id={titleId} className="h5 mt-2 mb-1" style={{ lineHeight: 1.2 }}>{p.emoji} {p.name}</h2>
            <p className="small text-muted mb-0" style={{ maxWidth: '28rem' }}>{p.description.slice(0, 110)}…</p>
          </div>
          <div className="d-flex align-items-center gap-1">
            <SaveButton item={{ id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category }} />
            <button ref={closeRef} className="icon-btn" aria-label={`Close ${p.name} details`} onClick={onClose}>
              <Icon name="x" size={20} />
            </button>
          </div>
        </header>

        <div className="mm-body">
          <div className="mm-media produce-detail-media">
            {showImage ? (
              <img src={p.image} alt="" style={{ objectFit: 'cover' }} onError={() => setImgError(true)} />
            ) : (
              <div className="produce-detail-emoji" aria-hidden="true"><span style={{ fontSize: '5rem' }}>{p.emoji}</span></div>
            )}
            <div className="produce-detail-badge">
              <span className="chip">{p.category}</span>
              {hasMeaningfulSeason(p) && p.season.slice(0, 3).map((s) => (
                <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
              ))}
            </div>
          </div>

          <div className="mm-content">
            <section className="mm-sec">
              <h3 className="h6">About</h3>
              <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>{p.description}</p>
            </section>

            <section className="mm-sec" style={{ background: '#fdfdf8' }}>
              <h3 className="h6"><Icon name="leaf" size={16} /> Nutrition Highlights</h3>
              <p className="small text-muted mb-0">{p.nutritionHighlights}</p>
            </section>

            <section className="mm-sec" style={{ background: '#f0fdf4', borderTop: '1px solid #dcfce7' }}>
              <h3 className="h6"><Icon name="bulb" size={16} /> Storage Tip</h3>
              <p className="small text-muted mb-0">{p.storageHint}</p>
            </section>

            {hasMeaningfulSeason(p) && (
              <section className="mm-sec">
                <h3 className="h6">In Season</h3>
                <div className="d-flex flex-wrap gap-2">
                  {p.season.map((s) => (
                    <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="mm-sec">
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Category</span><span className="fw-medium">{p.category}</span>
              </div>
              <div className="d-flex justify-content-between small mt-2">
                <span className="text-muted">Available at</span><span className="fw-medium">{mkts.length} market{mkts.length !== 1 ? 's' : ''}</span>
              </div>
            </section>

            {mkts.length > 0 && (
              <section className="mm-sec">
                <h3 className="h6"><Icon name="pin" size={16} /> Find it at</h3>
                <div className="d-flex flex-column gap-2 mt-2">
                  {mkts.map((m) => (
                    <div key={m.id} className="d-flex justify-content-between align-items-center p-2 rounded-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                      <div>
                        <div className="small fw-semibold">{m.name}</div>
                        <div className="small text-muted">{m.area} · {m.days.join(', ')}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <StatusBadge market={m} />
                        <button
                          className="btn-green py-1 px-2"
                          style={{ fontSize: 12, borderRadius: 8 }}
                          onClick={() => {
                            onClose();
                            setTimeout(() => openMarket(m.id), 80);
                          }}
                        >
                          View market
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
