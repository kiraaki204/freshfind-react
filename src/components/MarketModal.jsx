import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import { formatTime, DAY_NAMES } from '../utils/time.js';
import { imgPath, tagDestination } from '../utils/markets.js';
import { hasMeaningfulSeason } from '../utils/produce.js';
import Icon from './Icon.jsx';
import StatusBadge from './StatusBadge.jsx';
import SaveButton from './SaveButton.jsx';
import LiveClock from './LiveClock.jsx';
import MiniMap from './MiniMap.jsx';
import { useProduceDetailModal } from '../hooks/useProduceDetailModal.jsx';

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Market details in an accessible dialog instead of a separate page.
    All content comes from the shared market/produce data. */
export default function MarketModal({ marketId, onClose }) {
  const navigate = useNavigate();
  const { openProduce } = useProduceDetailModal();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const m = markets.find((x) => x.id === Number(marketId));
  const open = Boolean(m);
  const lightboxRef = useRef(null);
  lightboxRef.current = lightboxSrc;

  // scroll lock, initial focus, focus trap, escape, focus restore
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        // first Escape closes the gallery, the next closes the dialog
        if (lightboxRef.current) setLightboxSrc(null);
        else onClose();
        return;
      }
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

  const saveItem = { id: `market-${m.id}`, type: 'market', name: m.name, location: m.location };
  const items = produceData.filter((p) => m.produce.includes(p.id));
  const today = DAY_NAMES[new Date().getDay()];
  // navigating elsewhere from inside the dialog closes it first
  const closeAndGo = (to) => { onClose(); navigate(to); };

  return (
    <div
      className="mm-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mm-dialog" role="dialog" aria-modal="true" aria-labelledby="mm-title" ref={dialogRef}>
        <span className="tape mm-tape" aria-hidden="true" />
        <header className="mm-head">
          <div>
            <StatusBadge market={m} />
            <h2 id="mm-title" className="h5 mt-1 mb-0">{m.name}</h2>
            <p className="small text-muted mb-0"><Icon name="pin" size={14} /> {m.address} · {m.area}</p>
          </div>
          <div className="d-flex align-items-center gap-1">
            <SaveButton item={saveItem} />
            <button ref={closeRef} className="icon-btn" aria-label={`Close ${m.name} details`} onClick={onClose}>
              <Icon name="x" size={20} />
            </button>
          </div>
        </header>

        <div className="mm-body">
          <div className="mm-media">
            <img src={imgPath(m.image)} alt={m.name} />
          </div>

          <div className="mm-content">
            <section className="mm-sec">
              <div className="row text-center g-2">
                <div className="col-3">
                  <Icon name="star" size={18} />
                  <div className="fw-bold">{m.rating}</div>
                  <div className="small text-muted">Rating</div>
                </div>
                <div className="col-3" style={{ color: '#22c55e' }}>
                  <Icon name="users" size={18} />
                  <div className="fw-bold text-dark">{m.vendors}+</div>
                  <div className="small text-muted">Vendors</div>
                </div>
                <div className="col-3" style={{ color: '#3b82f6' }}>
                  <Icon name="calendar" size={18} />
                  <div className="fw-bold text-dark">{m.established}</div>
                  <div className="small text-muted">Established</div>
                </div>
                <div className="col-3" style={{ color: '#a855f7' }}>
                  <Icon name="clock" size={18} />
                  <div className="fw-bold text-dark">{m.days.length}x</div>
                  <div className="small text-muted">Per Week</div>
                </div>
              </div>
            </section>

            <section className="mm-sec">
              <h3 className="h6">About This Market</h3>
              <p className="small text-muted mb-2">{m.description}</p>
              <div className="d-flex flex-wrap gap-2">
                {m.parkingAvailable && (
                  <span className="chip" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                    <Icon name="parking" size={14} /> Parking Available
                  </span>
                )}
                {m.petFriendly && <span className="chip"><Icon name="paw" size={14} /> Pet Friendly</span>}
                {m.wheelchairAccessible && (
                  <span className="chip" style={{ background: '#faf5ff', color: '#7e22ce', borderColor: '#e9d5ff' }}>
                    <Icon name="access" size={14} /> Wheelchair Accessible
                  </span>
                )}
              </div>
            </section>

            <section className="mm-sec">
              <h3 className="h6 mb-2">Weekly Schedule</h3>
              {WEEK.map((day) => {
                const isOpenDay = m.days.includes(day);
                const isToday = today === day;
                return (
                  <div
                    key={day}
                    className="d-flex justify-content-between px-3 py-2 rounded-3 mb-2 small"
                    style={{
                      background: isToday ? '#f0fdf4' : '#f9fafb',
                      ...(isToday ? { border: '1px solid #bbf7d0' } : {}),
                    }}
                  >
                    <span className="fw-medium">
                      {day} {isToday && <small>(Today)</small>}
                    </span>
                    {isOpenDay
                      ? <span>{formatTime(m.openingTime)} – {formatTime(m.closingTime)}</span>
                      : <span className="text-muted">Closed</span>}
                  </div>
                );
              })}
            </section>

            {items.length > 0 && (
              <section className="mm-sec">
                <h3 className="h6 mb-1">Typical Produce Available</h3>
                <p className="small text-muted mb-2">Select an item for details, seasons and where else to find it.</p>
                <div className="row g-2">
                  {items.map((p) => (
                    <div key={p.id} className="col-6 col-md-4">
                      {/* produce detail stacks above this market modal;
                          closing it returns here */}
                      <button
                        className="produce-tile"
                        aria-label={`${p.name} — view details`}
                        onClick={() => openProduce(p.id)}
                      >
                        <div style={{ fontSize: '1.6rem' }}>{p.emoji}</div>
                        <div className="small fw-medium">{p.name}</div>
                        <div className="d-flex flex-wrap gap-1 justify-content-center mt-1">
                          <span className="chip">{p.category}</span>
                          {hasMeaningfulSeason(p) && p.season.map((s) => (
                            <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
                          ))}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {m.gallery && m.gallery.length > 0 && (
              <section className="mm-sec">
                <h3 className="h6 mb-2">Market Gallery</h3>
                <div className="row g-2">
                  {m.gallery.map((g, i) => (
                    <div key={i} className="col-6 col-md-4">
                      <button
                        className="border-0 p-0 w-100 rounded-3 overflow-hidden"
                        aria-label={`Open photo ${i + 1} of ${m.name}`}
                        onClick={() => setLightboxSrc(imgPath(g))}
                      >
                        <img
                          src={imgPath(g)}
                          alt={`${m.name} gallery ${i + 1}`}
                          style={{ height: 110, width: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mm-sec">
              <h3 className="h6"><Icon name="pin" size={16} /> Location</h3>
              <MiniMap name={m.name} address={m.address} lat={m.lat} lng={m.lng} />
              <p className="small fw-medium mt-2 mb-0">{m.address}</p>
              <p className="small text-muted mb-0">Area: {m.area}</p>
            </section>

            <section className="mm-sec">
              <h3 className="h6"><Icon name="clock" size={16} /> Today's Hours</h3>
              <StatusBadge market={m} size="md" />
              <p className="small mt-2 mb-0">Current time: <LiveClock /></p>
              {m.days.includes(today) && (
                <p className="small mb-0">Hours: {formatTime(m.openingTime)} – {formatTime(m.closingTime)}</p>
              )}
            </section>

            <section className="mm-sec">
              <h3 className="h6">Contact</h3>
              <a className="d-block small mb-2" href={`mailto:${m.contact}`}>
                <Icon name="mail" size={16} /> {m.contact}
              </a>
              <a className="d-block small mb-2" href={`tel:${m.phone}`}>
                <Icon name="phone" size={16} /> {m.phone}
              </a>
              {m.website && (
                <a className="d-block small" href={m.website} target="_blank" rel="noopener">
                  <Icon name="globe" size={16} /> Visit Website
                </a>
              )}
            </section>

            <section className="mm-sec">
              <h3 className="h6">Produce Categories</h3>
              <div className="d-flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <button
                    key={t}
                    className="chip chip-link"
                    aria-label={`Browse ${t} in the Produce Guide`}
                    onClick={() => closeAndGo(tagDestination(t))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {lightboxSrc && (
        <div className="lightbox" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="" />
          <button
            className="icon-btn position-absolute top-0 end-0 m-3 text-white"
            aria-label="Close gallery"
            onClick={() => setLightboxSrc(null)}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
