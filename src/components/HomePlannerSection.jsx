import { useMemo, useState } from 'react';
import markets from '../data/markets.json';
import { formatTime } from '../utils/time.js';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import Icon from './Icon.jsx';

/* "Plan Your Market Day" — a small interactive planner that replaces the old
   static how-it-works band. Pick a weekday and instantly see which of the
   markets run that day, with their hours — everything computed live from the
   same market data the rest of the site uses. Pure HTML/CSS/JS/React. */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
const todayIdx = (new Date().getDay() + 6) % 7; // Monday-first index of today

export default function HomePlannerSection() {
  const [day, setDay] = useState(DAYS[todayIdx]);
  const { openMarket } = useMarketModal();

  const open = useMemo(
    () => markets.filter((m) => m.days.includes(day)),
    [day],
  );
  const isToday = day === DAYS[todayIdx];

  return (
    <section className="planner-section" aria-labelledby="planner-heading">
      <div className="container" style={{ maxWidth: '80rem' }}>
        <div className="planner-shell">
          <div className="planner-head">
            <div>
              <div className="planner-label"><Icon name="calendar" size={15} /> interactive planner</div>
              <h2 id="planner-heading" className="planner-title">Plan Your Market Day</h2>
              <p className="planner-sub">Pick a day — see exactly which markets are waiting for you.</p>
            </div>
            <div className="planner-badge" aria-hidden="true">
              <span className="planner-badge-n">{open.length}</span>
              <span className="planner-badge-t">market{open.length === 1 ? '' : 's'} on {SHORT[day]}</span>
            </div>
          </div>

          <div className="planner-days" role="tablist" aria-label="Choose a day of the week">
            {DAYS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={day === d}
                className={`planner-day${day === d ? ' on' : ''}${d === DAYS[todayIdx] ? ' today' : ''}`}
                onClick={() => setDay(d)}
              >
                <span className="planner-day-short">{SHORT[d]}</span>
                <span className="planner-day-count">{markets.filter((m) => m.days.includes(d)).length}</span>
              </button>
            ))}
          </div>

          {open.length ? (
            <div className="planner-results" role="tabpanel">
              {open.map((m) => (
                <button
                  key={m.id}
                  className="planner-row"
                  onClick={() => openMarket(m.id)}
                  aria-label={`View details for ${m.name}, open ${formatTime(m.openingTime)} to ${formatTime(m.closingTime)} on ${day}`}
                >
                  <span className="planner-row-ico" aria-hidden="true"><Icon name="store" size={16} /></span>
                  <span className="planner-row-main">
                    <span className="planner-row-name">{m.name}</span>
                    <span className="planner-row-meta">
                      <Icon name="pin" size={11} /> {m.area}
                      <span className="planner-row-dot" aria-hidden="true">·</span>
                      <Icon name="clock" size={11} /> {formatTime(m.openingTime)} – {formatTime(m.closingTime)}
                    </span>
                  </span>
                  <span className="planner-row-cta" aria-hidden="true">
                    Details <Icon name="chevron" size={14} />
                  </span>
                </button>
              ))}
              <p className="planner-foot">
                <Icon name="leaf" size={12} />
                {isToday ? 'That’s today — tap any market for its live open status and details.' : `Tap any market for its schedule, produce and details.`}
              </p>
            </div>
          ) : (
            <div className="planner-empty" role="tabpanel">
              <Icon name="calendar" size={28} />
              <p className="mb-2 mt-2 fw-semibold" style={{ color: '#92400e' }}>No markets on {day}s</p>
              <p className="small text-muted mb-3">Try another day — most markets gather on weekends.</p>
              <button className="btn-outline-green" onClick={() => setDay('Saturday')}>Peek at Saturday</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
