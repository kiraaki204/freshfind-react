import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.jsx';
import { useToast } from '../hooks/useToast.jsx';
import Icon from './Icon.jsx';
import SocialRow from './SocialRow.jsx';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find a Market', to: '/markets' },
  { label: 'Produce Guide', to: '/produce' },
  { label: 'Saved Items', to: '/saved' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const COMING_SOON = ['FAQ', 'Help Centre', 'Terms of Service', 'Privacy Policy'];

export default function Footer({ visitorCount }) {
  const navigate = useNavigate();
  const { openChat } = useChat();
  const showToast = useToast();

  return (
    <footer className="site-footer">
      <div className="foot-bar">
        <div className="container py-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2" style={{ maxWidth: '80rem' }}>
          <span style={{ color: '#86efac', fontSize: 14 }}>
            <span className="d-inline-block" style={{ verticalAlign: '-3px', color: '#4ade80' }}>
              <Icon name="leaf" size={18} />
            </span>
            <strong style={{ color: '#fff' }}>{visitorCount.toLocaleString()}</strong> visitors exploring FreshFind
          </span>
          <span style={{ color: '#4ade80', fontSize: 12 }}>Connecting communities with local farmers since 2020</span>
        </div>
      </div>
      <div className="container py-5" style={{ maxWidth: '80rem' }}>
        <div className="row g-4">
          <div className="col-sm-6 col-lg-3">
            <button className="logo-btn mb-3" onClick={() => navigate('/')}>
              <span className="logo-mark"><Icon name="leaf" size={18} /></span>
              <span className="text-start">
                <span className="d-block text-white fw-bold" style={{ fontSize: '1.2rem' }}>FreshFind</span>
                <span className="d-block" style={{ fontSize: 11, color: '#4ade80', marginTop: -2 }}>Fresh All Along</span>
              </span>
            </button>
            <p style={{ fontSize: 14, color: '#86efac', lineHeight: 1.6 }}>
              Connecting local communities with fresh, seasonal produce from nearby farmers' markets.
            </p>
            <div className="d-flex gap-2">
              <SocialRow tone="dark" />
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="text-white fw-semibold mb-3" style={{ fontSize: 16 }}>Quick Links</h3>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <button className="foot-link" onClick={() => navigate(l.to)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="text-white fw-semibold mb-3" style={{ fontSize: 16 }}>Support</h3>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {COMING_SOON.map((label) => (
                <li key={label}>
                  <button className="foot-link" onClick={() => showToast(`${label} coming soon!`, 'info')}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="text-white fw-semibold mb-3" style={{ fontSize: 16 }}>Contact</h3>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: 14, color: '#86efac' }}>
              <li><a href="mailto:hello@freshfind.com" style={{ color: '#86efac' }}>hello@freshfind.com</a></li>
              <li>+1 555-FRESH-1</li>
              <li>10 Market Square, Greenfield</li>
              <li><button className="foot-link" onClick={() => openChat(true)}>Chat with the assistant</button></li>
            </ul>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 mt-5 pt-4" style={{ borderTop: '1px solid #166534' }}>
          <p className="mb-0" style={{ fontSize: 12, color: '#4ade80' }}>© 2026 FreshFind. All rights reserved.</p>
          <p className="mb-0" style={{ fontSize: 12, color: '#22c55e' }}>Built with love for local communities</p>
        </div>
      </div>
    </footer>
  );
}
