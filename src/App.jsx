import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLoader from './components/AppLoader.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import { BookmarksProvider } from './hooks/useBookmarks.jsx';
import { GeoProvider } from './hooks/useGeolocation.jsx';
import { ChatProvider } from './hooks/useChat.jsx';
import { DirectoryFiltersProvider } from './hooks/useDirectoryFilters.jsx';
import { ProduceFiltersProvider } from './hooks/useProduceFilters.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import BotanicalJourney from './components/BotanicalJourney.jsx';
import HomePage from './pages/HomePage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import { MarketModalProvider, MarketModalHost } from './hooks/useMarketModal.jsx';
import { ProduceDetailModalProvider } from './hooks/useProduceDetailModal.jsx';
import { SupportModalProvider } from './hooks/useSupportModal.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollHandler() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);

      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
      return () => clearTimeout(t);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [visitorCount] = useState(() => 12458 + Math.floor(Math.random() * 100));



  const [booting, setBooting] = useState(true);
  const [bootLeaving, setBootLeaving] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDwell = new Promise((resolve) => setTimeout(resolve, reduced ? 400 : 1500));
    const loaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
      setTimeout(resolve, 3200);
    });
    let alive = true;
    Promise.all([minDwell, loaded]).then(() => {
      if (!alive) return;
      setBootLeaving(true);
      setTimeout(() => { if (alive) setBooting(false); }, 480);
    });
    return () => { alive = false; };
  }, []);

  return (
    <ThemeProvider>
    <ToastProvider>
      <BookmarksProvider>
        <GeoProvider>
          <ChatProvider>
            <DirectoryFiltersProvider>
              <ProduceFiltersProvider>
                <MarketModalProvider>
                <ProduceDetailModalProvider>
                <SupportModalProvider>
                <ScrollHandler />
                <BotanicalJourney />
                <Header />
                <main id="main-content" tabIndex={-1}>
                  <div id="page">
                    <Routes>
                      <Route path="/" element={<HomePage visitorCount={visitorCount} />} />
                      <Route path="/markets" element={<DirectoryPage />} />


                      <Route path="/produce" element={<Navigate to="/#produce" replace />} />
                      <Route path="/produce/:produceId" element={<Navigate to="/#produce" replace />} />

                      <Route path="/about" element={<Navigate to="/#journal" replace />} />

                      <Route path="/saved" element={<Navigate to="/" replace />} />


                      <Route path="/faq" element={<Navigate to="/" replace />} />
                      <Route path="/help" element={<Navigate to="/" replace />} />
                      <Route path="/terms" element={<Navigate to="/" replace />} />
                      <Route path="/privacy" element={<Navigate to="/" replace />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </div>
                </main>
                <Footer visitorCount={visitorCount} />
                <ChatWidget />
                {booting && <AppLoader leaving={bootLeaving} />}



                <MarketModalHost />
                </SupportModalProvider>
                </ProduceDetailModalProvider>
                </MarketModalProvider>
              </ProduceFiltersProvider>
            </DirectoryFiltersProvider>
          </ChatProvider>
        </GeoProvider>
      </BookmarksProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}
