import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/** Themed dropdown used by the market filters. Keeps the same filtering
    wiring as the old native selects: `options` is [{ value, label }],
    `onChange(value)` is called when an option is picked. Fully keyboard
    operable (arrows / Enter / Space / Escape). */
export default function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const labelId = useId();

  const selected = options.find((o) => o.value === value) || options[0];

  // close when clicking anywhere outside the control
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // focus the options list when it opens; keep the active option in view
  useEffect(() => {
    if (open && listRef.current) listRef.current.focus();
  }, [open]);
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[active];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openMenu = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const commit = (i) => {
    onChange(options[i].value);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onBtnKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={`fselect${open ? ' open' : ''}`} ref={rootRef}>
      <span className="small text-muted fselect-label" id={labelId}>{label}</span>
      <button
        type="button"
        ref={btnRef}
        className={`fselect-btn${open ? ' open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onBtnKeyDown}
      >
        <span className="fselect-value">{selected.label}</span>
        <Icon name="chevron" size={14} className="fselect-chev" />
      </button>
      {open && (
        <ul
          className="fselect-menu"
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          aria-labelledby={labelId}
          onKeyDown={onListKeyDown}
        >
          {options.map((o, i) => (
            <li
              key={o.value || '__all__'}
              role="option"
              tabIndex={0}
              aria-selected={o.value === value}
              className={`fselect-opt${i === active ? ' active' : ''}${o.value === value ? ' selected' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => commit(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); commit(i); } }}
            >
              <span className="flex-grow-1">{o.label}</span>
              {o.value === value && <Icon name="check" size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
