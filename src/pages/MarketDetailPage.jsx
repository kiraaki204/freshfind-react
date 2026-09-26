import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import { formatTime, DAY_NAMES } from '../utils/time.js';
import { imgPath } from '../utils/markets.js';
import { useToast } from '../hooks/useToast.jsx';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SaveButton from '../components/SaveButton.jsx';
import LiveClock from '../components/LiveClock.jsx';
import MiniMap from '../components/MiniMap.jsx';

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MarketDetailPage() {
  const { marketId } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [copyLabel, setCopyLabel] = useState('Copy Link');

  const market = markets.find((m) => m.id === Number(marketId));
  if (!market) {
    return (
      <div className="wrap text-center py-5">
        <h2 className="h5">Market not found</h2>
        <button className="btn-green" onClick={() => navigate('/markets')}>Back to Directory</button>
      </div>
    );
  }

  const m = market;
  const saveItem = { id: `market-${m.id}`, type: 'market', name: m.name, location: m.location };
  const items = produceData.filter((p) => m.produce.includes(p.id));
  const today = DAY_NAMES[new Date().getDay()];
  const shareUrl = encodeURIComponent(window.location.href);

  const copyLink = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
    setCopyLabel('Copied!');
    showToast('Link copied');
  };

  return (
    <div className="wrap">
      <Breadcrumb items={[{ label: 'Market Directory', to: '/markets' }, { label: m.name }]} />
      <button className="btn btn-link text-muted text-decoration-none ps-0 mb-3" onClick={() => navigate('/markets')}>
        <Icon name="chevronL" size={16} /> Back to Directory
      </button>

      <div className="detail-hero">
        <img src={imgPath(m.image)} alt={m.name} />
        <div className="shade" />
        <div className="info">
          <div>
            <StatusBadge market={m} size="md" />
            <h1 className="h3 text-white mt-2 mb-1">{m.name}</h1>
            <p className="text-white-50 small mb-0"><Icon name="pin" size={16} /> {m.address}</p>
          </div>
          <SaveButton item={saveItem} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="ff-card p-4 mb-3">
            <div className="row text-center">
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
          </div>

          <div className="ff-card p-4 mb-3">
            <h2 className="h5">About This Market</h2>
            <p className="text-muted">{m.description}</p>
            <div className="d-flex flex-wrap gap-2">
              {m.parkingAvailable && (
                <span className="chip" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                  <Icon name="parking" size={14} /> Parking Available
                </span>
              )}
              {m.petFriendly && (
                <span className="chip"><Icon name="paw" size={14} /> Pet Friendly</span>
              )}
              {m.wheelchairAccessible && (
                <span className="chip" style={{ background: '#faf5ff', color: '#7e22ce', borderColor: '#e9d5ff' }}>
                  <Icon name="access" size={14} /> Wheelchair Accessible
                </span>
              )}
            </div>
          </div>

          <div className="ff-card p-4 mb-3">
            <h2 className="h5 mb-3">Weekly Schedule</h2>
            {WEEK.map((day) => {
              const isOpenDay = m.days.includes(day);
              const isToday = today === day;
              return (
                <div
                  key={day}
                  className="d-flex justify-content-between px-3 py-2 rounded-3 mb-2"
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
          </div>

          {items.length > 0 && (
            <div className="ff-card p-4 mb-3">
              <h2 className="h5 mb-3">Typical Produce Available</h2>
              <div className="row g-2">
                {items.map((p) => (
                  <div key={p.id} className="col-6 col-md-3">
                    <button
                      className="w-100 p-3 rounded-3 text-center border-0"
                      style={{ background: '#f0fdf4' }}
                      onClick={() => navigate(`/produce/${p.id}`)}
                    >
                      <div style={{ fontSize: '1.6rem' }}>{p.emoji}</div>
                      <div className="small fw-medium">{p.name}</div>
                      <div className="small text-muted">{p.category}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {m.gallery && m.gallery.length > 0 && (
            <div className="ff-card p-4 mb-3">
              <h2 className="h5 mb-3">Market Gallery</h2>
              <div className="row g-2">
                {m.gallery.map((g, i) => (
                  <div key={i} className="col-6 col-md-4">
                    <button
                      className="border-0 p-0 w-100 rounded-3 overflow-hidden"
                      onClick={() => setLightboxSrc(imgPath(g))}
                    >
                      <img
                        src={imgPath(g)}
                        alt={`${m.name} gallery ${i + 1}`}
                        style={{ height: 140, width: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="ff-card p-4 mb-3">
            <h2 className="h5"><Icon name="share" size={18} /> Share This Market</h2>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <a className="btn btn-sm text-white" style={{ background: '#2563eb' }} target="_blank" rel="noopener"
                href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`}>Facebook</a>
              <a className="btn btn-sm text-white" style={{ background: '#111827' }} target="_blank" rel="noopener"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${m.name} on FreshFind!`)}&url=${shareUrl}`}>Twitter/X</a>
              <a className="btn btn-sm text-white" style={{ background: '#22c55e' }} target="_blank" rel="noopener"
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${m.name}! ${window.location.href}`)}`}>WhatsApp</a>
              <button className="btn btn-outline-secondary btn-sm" onClick={copyLink}>{copyLabel}</button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="ff-card p-4 mb-3 text-center">
            <SaveButton item={saveItem} />
            <p className="small text-muted mt-2 mb-0">Save this market to your collection</p>
          </div>

          <div className="ff-card p-4 mb-3">
            <h3 className="h6"><Icon name="pin" size={16} /> Location</h3>
            <MiniMap name={m.name} address={m.address} />
            <p className="small fw-medium mt-2 mb-0">{m.address}</p>
            <p className="small text-muted">Area: {m.area}</p>
          </div>

          <div className="ff-card p-4 mb-3">
            <h3 className="h6"><Icon name="clock" size={16} /> Today's Hours</h3>
            <StatusBadge market={m} size="md" />
            <p className="small mt-2 mb-0">Current time: <LiveClock /></p>
            {m.days.includes(today) && (
              <p className="small">Hours: {formatTime(m.openingTime)} – {formatTime(m.closingTime)}</p>
            )}
          </div>

          <div className="ff-card p-4 mb-3">
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
          </div>

          <div className="ff-card p-4">
            <h3 className="h6">Produce Categories</h3>
            <div className="d-flex flex-wrap gap-2">
              {m.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
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
