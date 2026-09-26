import { useState } from 'react';
import { useToast } from '../hooks/useToast.jsx';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import SocialRow from '../components/SocialRow.jsx';
import MiniMap from '../components/MiniMap.jsx';

const CONTACT_CARDS = [
  { i: 'mail', t: 'Email', c: 'hello@freshfind.com', href: 'mailto:hello@freshfind.com', bg: '#eff6ff', col: '#2563eb' },
  { i: 'phone', t: 'Phone', c: '+1 555-FRESH-1', href: 'tel:+15553737341', bg: '#f0fdf4', col: '#16a34a' },
  { i: 'pin', t: 'Address', c: '10 Market Square, Greenfield', href: '', bg: '#faf5ff', col: '#7e22ce' },
  { i: 'clock', t: 'Contact Hours', c: 'Monday – Friday\n9:00 AM – 5:00 PM', href: '', bg: '#fffbeb', col: '#d97706' },
];

export default function ContactPage() {
  const showToast = useToast();
  const [geoText, setGeoText] = useState('Click below to share your location (used only in this browser).');

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setGeoText('Geolocation is not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoText(`Approx. location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        showToast('Location found', 'info');
      },
      () => {
        setGeoText('Location access is unavailable. You can still find us on the map.');
      }
    );
  };

  const submitMessage = (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="wrap">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      <h1 className="h3 mt-3">Contact Us</h1>
      <p className="text-muted">We'd love to hear from you. Reach out anytime.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          {CONTACT_CARDS.map((x) => (
            <div key={x.t} className="ff-card p-3 mb-3 d-flex gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 40, height: 40, background: x.bg, color: x.col }}
              >
                <Icon name={x.i} size={18} />
              </div>
              <div>
                <div className="fw-semibold small">{x.t}</div>
                {x.href
                  ? <a className="small" href={x.href}>{x.c}</a>
                  : <div className="small text-muted" style={{ whiteSpace: 'pre-line' }}>{x.c}</div>}
              </div>
            </div>
          ))}

          <div className="ff-card p-3">
            <h3 className="h6">Follow Us</h3>
            <SocialRow />
          </div>

          <div className="ff-card p-3 mt-3">
            <h3 className="h6">Your location</h3>
            <p className="small text-muted mb-2">{geoText}</p>
            <button className="btn-outline-green" onClick={shareLocation}>
              <Icon name="nav" size={16} /> Use my location
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="ff-card p-4 mb-3">
            <h2 className="h5"><Icon name="mail" size={18} /> Send Us a Message</h2>
            <form className="mt-3" onSubmit={submitMessage}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label small">Name *</label>
                  <input className="form-control" name="name" required placeholder="Your name" />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small">Email *</label>
                  <input className="form-control" type="email" name="email" required placeholder="your@email.com" />
                </div>
                <div className="col-12">
                  <label className="form-label small">Subject</label>
                  <input className="form-control" name="subject" placeholder="What's this about?" />
                </div>
                <div className="col-12">
                  <label className="form-label small">Message *</label>
                  <textarea className="form-control" name="message" rows={5} required placeholder="Tell us how we can help..." />
                </div>
                <div className="col-12">
                  <button className="btn-green w-100" type="submit">
                    <Icon name="send" size={18} /> Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="ff-card p-4">
            <h2 className="h5"><Icon name="pin" size={18} /> Find Us</h2>
            <MiniMap name="FreshFind HQ" address="10 Market Square, Greenfield" />
          </div>
        </div>
      </div>
    </div>
  );
}
