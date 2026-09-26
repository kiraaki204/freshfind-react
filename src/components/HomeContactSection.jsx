import { useState } from 'react';
import markets from '../data/markets.json';
import { useToast } from '../hooks/useToast.jsx';
import { useSupportModal } from '../hooks/useSupportModal.jsx';
import Icon from './Icon.jsx';
import SocialRow from './SocialRow.jsx';
import MiniMap from './MiniMap.jsx';

const HQ_LAT = markets.reduce((sum, m) => sum + m.lat, 0) / markets.length;
const HQ_LNG = markets.reduce((sum, m) => sum + m.lng, 0) / markets.length;

export default function HomeContactSection() {
  const showToast = useToast();
  const { openSupport } = useSupportModal();
  const [sending, setSending] = useState(false);

  const submitMessage = (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSending(true);
    // demo: no backend — keep the existing toast behaviour but be honest
    setTimeout(() => {
      showToast("Message captured — this demo form doesn't send to a server.", 'info');
      form.reset();
      setSending(false);
    }, 300);
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container" style={{ maxWidth: '80rem' }}>
        {/* heading */}
        <div className="contact-head">
          <div className="contact-eyebrow">
            <span className="contact-eyebrow-dot" aria-hidden="true" />
            Get in touch
          </div>
          <h2 id="contact-heading" className="contact-title">Let&apos;s Talk Fresh.</h2>
          <p className="contact-subtitle">
            Have a question, an idea, or a local market to recommend? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Area A — contact information */}
          <div className="col-lg-5 d-flex">
            <div className="contact-info-wrap w-100">
              <div className="contact-intro">
                <h3 className="h5 mb-2" style={{ color: '#14532d' }}>Reach out to FreshFind</h3>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Whether you&apos;re a shopper, a grower, or just curious about what&apos;s in season — drop us a line. We read every message.
                </p>
              </div>

              <ul className="contact-list" aria-label="Contact details">
                <li className="contact-item">
                  <span className="contact-ico" aria-hidden="true"><Icon name="mail" size={18} /></span>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <a className="contact-item-value" href="mailto:hello@freshfind.com">hello@freshfind.com</a>
                  </div>
                </li>
                <li className="contact-item">
                  <span className="contact-ico" aria-hidden="true"><Icon name="phone" size={18} /></span>
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <a className="contact-item-value" href="tel:+92346267809">+92346267809</a>
                  </div>
                </li>
                <li className="contact-item">
                  <span className="contact-ico" aria-hidden="true"><Icon name="pin" size={18} /></span>
                  <div>
                    <div className="contact-item-label">Demo area</div>
                    <div className="contact-item-value text-muted" style={{ fontSize: 14 }}>10 Market Square, Greenfield</div>
                    <div className="contact-item-note">Showcase address — pin marks centre of demo markets, not a verified office.</div>
                  </div>
                </li>
                <li className="contact-item">
                  <span className="contact-ico" aria-hidden="true"><Icon name="clock" size={18} /></span>
                  <div>
                    <div className="contact-item-label">Contact hours</div>
                    <div className="contact-item-value text-muted" style={{ fontSize: 14 }}>Monday – Friday, 9:00 AM – 5:00 PM</div>
                  </div>
                </li>
              </ul>

              <div className="contact-follow">
                <div className="contact-follow-label">Follow Us</div>
                <div className="d-flex gap-2 flex-wrap">
                  <SocialRow tone="contact" />
                </div>
                <p className="contact-follow-hint">Updates from markets and seasonal highlights.</p>
              </div>

              <div className="contact-map-card">
                <div className="contact-map-head">
                  <span className="contact-map-icon"><Icon name="pin" size={16} /></span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 14, color: '#14532d' }}>FreshFind demo area</div>
                    <div className="small text-muted">Centre of the 8 sample markets</div>
                  </div>
                </div>
                <MiniMap name="FreshFind demo area" address="10 Market Square, Greenfield" lat={HQ_LAT} lng={HQ_LNG} />
                <p className="small text-muted mt-2 mb-0" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Demo map: Leaflet + OpenStreetMap. The pin shows the middle of the demo market locations — not a verified FreshFind office.
                </p>
              </div>
            </div>
          </div>

          {/* Area B — contact form */}
          <div className="col-lg-7 d-flex">
            <div className="contact-form-card w-100">
              <div className="contact-form-head">
                <div className="contact-form-icon"><Icon name="send" size={18} /></div>
                <div>
                  <h3 className="h5 mb-1">Send us a message</h3>
                  <p className="small text-muted mb-0">We&apos;ll get back to you as soon as we can.</p>
                </div>
              </div>

              <form onSubmit={submitMessage} noValidate className="contact-form">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="c-name" className="form-label contact-label">Name <span aria-hidden="true" className="text-danger">*</span></label>
                    <input id="c-name" className="form-control contact-input" name="name" required placeholder="Your name" autoComplete="name" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="c-email" className="form-label contact-label">Email <span aria-hidden="true" className="text-danger">*</span></label>
                    <input id="c-email" className="form-control contact-input" type="email" name="email" required placeholder="your@email.com" autoComplete="email" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-subject" className="form-label contact-label">Subject</label>
                    <input id="c-subject" className="form-control contact-input" name="subject" placeholder="What's this about?" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-message" className="form-label contact-label">Message <span aria-hidden="true" className="text-danger">*</span></label>
                    <textarea id="c-message" className="form-control contact-input" name="message" rows={5} required placeholder="Tell us how we can help..." />
                  </div>
                  <div className="col-12">
                    <button className="btn-green w-100 contact-submit" type="submit" disabled={sending}>
                      <Icon name="send" size={18} /> {sending ? 'Sending...' : 'Send Message'}
                    </button>
                    <p className="contact-demo-note">
                      <Icon name="info" size={12} /> Demo form — messages stay in your browser and aren&apos;t sent to a server.
                      See{' '}
                      <button
                        type="button"
                        className="contact-privacy-link"
                        aria-haspopup="dialog"
                        onClick={() => openSupport('privacy')}
                      >
                        Privacy
                      </button>{' '}
                      for details.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
