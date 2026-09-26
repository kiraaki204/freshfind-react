import { useEffect, useRef } from 'react';
import produceData from '../data/produce.json';
import markets from '../data/markets.json';
import { hasMeaningfulSeason } from '../utils/produce.js';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import Icon from './Icon.jsx';
import SaveButton from './SaveButton.jsx';
import StatusBadge from './StatusBadge.jsx';

/** Produce details in an accessible dialog; mirrors the market modal. */
export default function ProduceModal({ produceId, onClose }) {
  const { openMarket } = useMarketModal();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const p = produceData.find((x) => x.id === produceId);
  const open = Boolean(p);

  // scroll lock, initial focus, focus trap, escape, focus restore
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const els = Array.from(
        dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []
      );
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const saveItem = { id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category };
  const related = markets.filter((m) => p.markets.includes(m.id));

  return (
    <div
      className="mm-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mm-dialog pm-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title" ref={dialogRef}>
        <header className="mm-head">
          <div>
            <h2 id="pm-title" className="h5 mb-0">{p.emoji} {p.name}</h2>
            <p className="small text-muted mb-0">{p.category}</p>
          </div>
          <div className="d-flex align-items-center gap-1">
            <SaveButton item={saveItem} />
            <button ref={closeRef} className="icon-btn" aria-label={`Close ${p.name} details`} onClick={onClose}>
              <Icon name="x" size={20} />
            </button>
          </div>
        </header>

        <div className="mm-body">
          <div className="mm-content">
            <section className="mm-sec">
              <div className="p-thumb rounded-4 mb-3" style={{ height: 160 }}>
                <span style={{ fontSize: '4rem' }}>{p.emoji}</span>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="chip">{p.category}</span>
                {hasMeaningfulSeason(p) && p.season.map((s) => (
                  <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
                ))}
              </div>
              <p className="small text-muted mb-0">{p.description}</p>
            </section>

            {(p.nutritionHighlights || p.storageHint) && (
              <section className="mm-sec">
                <h3 className="h6">Good to Know</h3>
                {p.nutritionHighlights && (
                  <p className="small text-muted mb-2"><Icon name="leaf" size={14} /> {p.nutritionHighlights}</p>
                )}
                {p.storageHint && (
                  <p className="small text-muted mb-0"><Icon name="info" size={14} /> {p.storageHint}</p>
                )}
              </section>
            )}

            {related.length > 0 && (
              <section className="mm-sec">
                <h3 className="h6 mb-2"><Icon name="pin" size={16} /> Available At</h3>
                {related.map((m) => (
                  <div
                    key={m.id}
                    className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2"
                    style={{ background: '#f9fafb' }}
                  >
                    <div>
                      <div className="small fw-medium">{m.name}</div>
                      <div className="small text-muted">{m.area} · {m.days.join(', ')}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <StatusBadge market={m} />
                      <button
                        className="btn-green py-1 px-2"
                        style={{ fontSize: 12 }}
                        onClick={() => { onClose(); openMarket(m.id); }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
