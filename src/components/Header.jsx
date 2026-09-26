import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useToast } from '../hooks/useToast.jsx';
import Icon from './Icon.jsx';

const NAV = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Find a Market', to: '/markets', icon: 'pin' },
  { label: 'Produce Guide', to: '/produce', icon: 'carrot' },
  { label: 'About Us', to: '/about', icon: 'info' },
  { label: 'Contact Us', to: '/contact', icon: 'phone' },
];

function isActive(pathname, to) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

/* Always mounted (like the original markup) so partly-filled demo forms
   keep their values when the modal is closed and re-opened. */
function AuthModal({ kind, open, onClose, onSubmit }) {
  const login = kind === 'login';
  return (
    <div
      className={`modal-back${open ? ' open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">{login ? 'Login' : 'Sign up'}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <p className="text-muted small">
          {login ? 'This is a demo login — nothing is sent to a server.' : 'Demo only — accounts are not actually created.'}
        </p>
        <form onSubmit={onSubmit}>
          {!login && (
            <div className="mb-3">
              <label className="form-label small">Name</label>
              <input type="text" className="form-control" required placeholder="Your name" />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input type="email" className="form-control" required placeholder="you@email.com" />
          </div>
          <div className="mb-3">
            <label className="form-label small">Password</label>
            <input type="password" className="form-control" required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-green w-100">{login ? 'Login' : 'Create account'}</button>
        </form>
      </div>
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { bookmarks } = useBookmarks();
  const showToast = useToast();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the mobile menu whenever navigation happens
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/markets?q=${encodeURIComponent(q)}`);
  };

  const submitAuth = (message) => (e) => {
    e.preventDefault();
    setModal(null);
    showToast(message, 'info');
  };

  const savedCount = bookmarks.length;

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <button className="logo-btn" aria-label="FreshFind Home" onClick={() => navigate('/')}>
          <span className="logo-mark"><Icon name="leaf" size={18} /></span>
          <span className="d-none d-sm-block text-start">
            <span className="logo-title d-block">FreshFind</span>
            <span className="logo-sub d-block">Fresh All Along</span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV.map((l) => (
            <button
              key={l.to}
              className={`ff-nav${isActive(pathname, l.to) ? ' active' : ''}`}
              aria-current={isActive(pathname, l.to) ? 'page' : undefined}
              onClick={() => navigate(l.to)}
            >
              <Icon name={l.icon} size={16} />
              <span>{l.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <div className="dummy-auth">
            <button className="btn-login" type="button" onClick={() => setModal('login')}>Login</button>
            <button className="btn-signup" type="button" onClick={() => setModal('signup')}>Sign up</button>
          </div>
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((o) => !o)}>
            <Icon name="search" size={18} />
          </button>
          <button className="icon-btn" aria-label="Saved items" onClick={() => navigate('/saved')}>
            <Icon name="heart" size={18} />
            {savedCount > 0 && <span className="count-badge">{savedCount > 9 ? '9+' : savedCount}</span>}
          </button>
          <button className="icon-btn menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      <div className={`header-search${searchOpen ? ' open' : ''}`}>
        <form className="d-flex gap-2" onSubmit={submitSearch}>
          <div className="search-wrap flex-grow-1">
            <span className="s-ico"><Icon name="search" size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search markets, locations or produce..."
              style={{ borderRadius: 8 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-green">Search</button>
        </form>
      </div>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav className="px-3 py-3" aria-label="Mobile navigation">
          {[...NAV, { label: 'Saved Items', to: '/saved', icon: 'heart' }].map((l) => (
            <button
              key={l.to}
              className={`mobile-link${isActive(pathname, l.to) ? ' active' : ''}`}
              onClick={() => navigate(l.to)}
            >
              <span className="mob-ico"><Icon name={l.icon} size={16} /></span>
              <span className="flex-grow-1">{l.label}</span>
              {l.to === '/saved' && savedCount > 0 && (
                <span className="count-badge position-static d-inline-flex">{savedCount}</span>
              )}
              <Icon name="chevron" size={16} />
            </button>
          ))}
          <div className="d-flex gap-2 px-2 pt-2 d-lg-none">
            <button className="btn-login" onClick={() => setModal('login')}>Login</button>
            <button className="btn-signup" onClick={() => setModal('signup')}>Sign up</button>
          </div>
        </nav>
      </div>

      <AuthModal kind="login" open={modal === 'login'} onClose={() => setModal(null)} onSubmit={submitAuth('Logged in (demo only)')} />
      <AuthModal kind="signup" open={modal === 'signup'} onClose={() => setModal(null)} onSubmit={submitAuth('Account created (demo only)')} />
    </header>
  );
}
