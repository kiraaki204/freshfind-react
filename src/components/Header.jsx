import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useSupportModal } from '../hooks/useSupportModal.jsx';
import Icon from './Icon.jsx';

const NAV = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Find a Market', to: '/markets', icon: 'pin' },
  { label: 'Produce Guide', to: '/#produce', icon: 'basket' },
  { label: 'Field Journal', to: '/#journal', icon: 'book' },
  { label: 'Contact Us', to: '/#contact', icon: 'phone' },
];

function isActive(pathname, hash, to) {
  const base = to.split('#')[0] || '/';
  const h = to.split('#')[1] || null;
  if (h) {
    return pathname === base && hash === `#${h}`;
  }
  return to === '/' ? pathname === '/' && !hash : pathname.startsWith(to);
}

function scrollToHash(hash) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const id = hash.replace(/^#/, '');
  if (id === 'top' || id === '') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    // CSS scroll-margin-top on the section handles the fixed header offset
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Header({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const { bookmarks } = useBookmarks();
  const { openSupport } = useSupportModal();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the mobile menu and the mobile search panel on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname, hash]);

  // focus the input whenever the search box opens (desktop inline or mobile panel)
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const toggleSearch = () => {
    setSearchOpen((o) => !o);
    setMenuOpen(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/markets?q=${encodeURIComponent(q)}`);
  };

  const savedCount = bookmarks.length;

  const handleNav = (to) => {
    const base = to.split('#')[0] || '/';
    const h = to.split('#')[1] ? `#${to.split('#')[1]}` : '';
    if (h) {
      if (pathname !== base) {
        navigate(`${base}${h}`);
      } else {
        scrollToHash(h);
        window.history.replaceState(null, '', `${base}${h}`);
        setMenuOpen(false);
      }
      return;
    }
    if (to === '/') {
      if (pathname === '/') {
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuOpen(false);
      } else {
        navigate('/');
      }
      return;
    }
    navigate(to);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <button className="logo-btn" aria-label="FreshFind Home" onClick={() => handleNav('/')}>
          <span className="logo-mark"><Icon name="leaf" size={20} /></span>
          <span className="text-start">
            <span className="logo-title d-block">FreshFind</span>
            <span className="logo-sub d-block">Fresh All Along</span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV.map((l) => (
            <button
              key={l.to}
              className={`ff-nav${isActive(pathname, hash, l.to) ? ' active' : ''}`}
              aria-current={isActive(pathname, hash, l.to) ? 'page' : undefined}
              onClick={() => handleNav(l.to)}
            >
              <Icon name={l.icon} size={16} />
              <span>{l.label}</span>
            </button>
          ))}
        </nav>

        <form
          id="header-search"
          className={`header-search${searchOpen ? ' open' : ''}`}
          role="search"
          aria-label="Site search"
          onSubmit={submitSearch}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && searchOpen) {
              setSearchOpen(false);
              searchToggleRef.current?.focus();
            }
          }}
        >
          <div className="search-wrap flex-grow-1">
            <span className="s-ico"><Icon name="search" size={18} /></span>
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              placeholder="Search markets, locations or produce..."
              aria-label="Search markets, locations or produce"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="header-actions">
          <button
            ref={searchToggleRef}
            className="icon-btn search-toggle"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={toggleSearch}
          >
            <Icon name={searchOpen ? 'x' : 'search'} size={18} />
          </button>
          <button
            className="icon-btn theme-toggle"
            type="button"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            onClick={onToggleTheme}
          >
            <svg className="theme-flower" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle className="flower-petal" cx="12" cy="5.3" r="3.2" />
              <circle className="flower-petal" cx="17.8" cy="9.5" r="3.2" />
              <circle className="flower-petal" cx="15.6" cy="16.3" r="3.2" />
              <circle className="flower-petal" cx="8.4" cy="16.3" r="3.2" />
              <circle className="flower-petal" cx="6.2" cy="9.5" r="3.2" />
              <circle className="flower-center" cx="12" cy="11" r="2.1" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Saved items" aria-haspopup="dialog" onClick={() => openSupport('saved')}>
            <Icon name="heart" size={18} />
            {savedCount > 0 && <span className="count-badge">{savedCount > 9 ? '9+' : savedCount}</span>}
          </button>
          <button className="icon-btn menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav className="px-3 py-3" aria-label="Mobile navigation">
          {[...NAV, { label: 'Saved Items', modal: 'saved', icon: 'heart' }].map((l) => (
            <button
              key={l.to ?? l.modal}
              className={`mobile-link${!l.modal && isActive(pathname, hash, l.to) ? ' active' : ''}`}
              aria-haspopup={l.modal ? 'dialog' : undefined}
              onClick={() => (l.modal ? (openSupport(l.modal), setMenuOpen(false)) : handleNav(l.to))}
            >
              <span className="mob-ico"><Icon name={l.icon} size={16} /></span>
              <span className="flex-grow-1">{l.label}</span>
              {l.modal === 'saved' && savedCount > 0 && (
                <span className="count-badge position-static d-inline-flex">{savedCount}</span>
              )}
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
