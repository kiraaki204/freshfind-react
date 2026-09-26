import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import Icon from './Icon.jsx';

const NAV = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Find a Market', to: '/markets', icon: 'pin' },
  { label: 'Produce Guide', to: '/produce', icon: 'sprout' },
  { label: 'About Us', to: '/about', icon: 'users' },
  { label: 'Contact Us', to: '/contact', icon: 'phone' },
];

function isActive(pathname, to) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { bookmarks } = useBookmarks();

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
  }, [pathname]);

  // focus the input when the mobile search panel opens
  useEffect(() => {
    if (searchOpen && window.matchMedia('(max-width: 991.98px)').matches) {
      searchInputRef.current?.focus();
    }
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
          <button type="submit" className="btn-green header-search-go" aria-label="Search">
            <Icon name="search" size={16} />
            <span className="d-none d-lg-inline">Search</span>
          </button>
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
          <button className="icon-btn" aria-label="Saved items" onClick={() => navigate('/saved')}>
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
        </nav>
      </div>
    </header>
  );
}
