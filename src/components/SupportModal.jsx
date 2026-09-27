import { useEffect, useId, useRef } from 'react';
import Icon from './Icon.jsx';








export default function SupportModal({ open, title, icon, intro, wide = false, labelledBy, children, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const autoId = useId();
  const titleId = labelledBy ?? `support-title-${autoId.replace(/:/g, '')}`;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
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
      const els = Array.from(
        dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === closeRef.current);
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



  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="mm-backdrop support-backdrop" onMouseDown={handleBackdrop}>
      <div
        className={`support-dialog${wide ? ' support-dialog--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
      >
        <header className="support-head">
          <div className="support-head-text">
            <span className="support-head-ico" aria-hidden="true">
              <Icon name={icon} size={18} />
            </span>
            <div>
              <h2 id={titleId} className="support-title">{title}</h2>
              {intro && <p className="support-intro">{intro}</p>}
            </div>
          </div>
          <button ref={closeRef} className="icon-btn" aria-label={`Close ${title}`} onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="support-body">{children}</div>
      </div>
    </div>
  );
}
