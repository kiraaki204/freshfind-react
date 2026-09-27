import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat.jsx';
import { useSupportModal } from '../hooks/useSupportModal.jsx';
import Icon from './Icon.jsx';
import SocialRow from './SocialRow.jsx';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find a Market', to: '/markets' },
  { label: 'Produce Guide', to: '/#produce' },
  { label: 'Saved Items', modal: 'saved' },
  { label: 'About Us', to: '/#journal' },
  { label: 'Contact Us', to: '/#contact' },
];

/* Support pages open as modals over the current page, not separate routes */
const SUPPORT_LINKS = [
  { label: 'FAQ', modal: 'faq' },
  { label: 'Help Center', modal: 'help' },
  { label: 'Terms of Service', modal: 'terms' },
  { label: 'Privacy Policy', modal: 'privacy' },
];

export default function Footer({ visitorCount }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openChat } = useChat();
  const { openSupport } = useSupportModal();

  const handleNav = (to) => {
    const base = to.split('#')[0] || '/';
    const h = to.split('#')[1] ? `#${to.split('#')[1]}` : '';
    if (h) {
      if (pathname !== base) navigate(`${base}${h}`);
      else {
        const el = document.getElementById(h.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', `${base}${h}`);
      }
      return;
    }
    if (to === '/') {
      if (pathname === '/') {
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else navigate('/');
      return;
    }
    navigate(to);
  };

  return (
    <footer className="site-footer">
      <div className="foot-fringe" aria-hidden="true" />
      <div className="foot-bar">
        <div className="container py-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2" style={{ maxWidth: '80rem' }}>
          <span style={{ color: '#5f7263', fontSize: 14 }}>
            <span className="d-inline-block" style={{ verticalAlign: '-3px', color: '#4e7357' }}>
              <Icon name="leaf" size={18} />
            </span>
            <strong style={{ color: '#2a4a36' }}>{visitorCount.toLocaleString()}</strong> visitors exploring FreshFind
          </span>
          <span style={{ color: '#4e7357', fontSize: 12 }}>Connecting communities with local farmers since 2020</span>
        </div>
      </div>
      <div className="container py-5" style={{ maxWidth: '80rem' }}>
        <div className="row g-4">
          <div className="col-sm-6 col-lg-3">
            <button className="logo-btn mb-3" onClick={() => handleNav('/')}>
              <span className="logo-mark"><Icon name="leaf" size={18} /></span>
              <span className="text-start">
                <span className="d-block fw-bold" style={{ color: '#2a4a36', fontSize: '1.2rem' }}>FreshFind</span>
                <span className="d-block" style={{ fontSize: 11, color: '#4e7357', marginTop: -2 }}>Fresh All Along</span>
              </span>
            </button>
            <p style={{ fontSize: 14, color: '#5f7263', lineHeight: 1.6 }}>
              Connecting local communities with fresh, seasonal produce from nearby farmers' markets.
            </p>
            <div className="d-flex gap-2">
              <SocialRow tone="dark" />
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="foot-title">Quick Links</h3>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {QUICK_LINKS.map((l) => (
                <li key={l.to ?? l.modal}>
                  <button
                    className="foot-link"
                    aria-haspopup={l.modal ? 'dialog' : undefined}
                    onClick={() => (l.modal ? openSupport(l.modal) : handleNav(l.to))}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="foot-title">Support</h3>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.modal}>
                  <button className="foot-link" aria-haspopup="dialog" onClick={() => openSupport(l.modal)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="foot-title">Contact</h3>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: 14, color: '#5f7263' }}>
              <li><a href="mailto:hello@freshfind.com" style={{ color: '#5f7263' }}>hello@freshfind.com</a></li>
              <li><a href="tel:+92346267809" style={{ color: '#5f7263' }}>+92346267809</a></li>
              <li>10 Market Square, Greenfield</li>
              <li><button className="foot-link" onClick={() => openChat(true)}>Chat with the assistant</button></li>
            </ul>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 mt-5 pt-4" style={{ borderTop: '1px solid rgba(143, 174, 144, .35)' }}>
          <p className="mb-0" style={{ fontSize: 12, color: '#4e7357' }}>© 2026 FreshFind. All rights reserved.</p>
          <p className="mb-0 text-center text-sm-end" style={{ fontSize: 12, color: '#6b8f6f' }}>From ideas to innovation - Aptech Rahim Yar Khan</p>
        </div>
      </div>
    </footer>
  );
}
