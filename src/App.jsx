import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast.jsx';
import { BookmarksProvider } from './hooks/useBookmarks.jsx';
import { GeoProvider } from './hooks/useGeolocation.jsx';
import { ChatProvider } from './hooks/useChat.jsx';
import { DirectoryFiltersProvider } from './hooks/useDirectoryFilters.jsx';
import { ProduceFiltersProvider } from './hooks/useProduceFilters.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import HomePage from './pages/HomePage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import { MarketModalProvider } from './hooks/useMarketModal.jsx';
import ProducePage from './pages/ProducePage.jsx';
import ProduceDetailPage from './pages/ProduceDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import SavedItemsPage from './pages/SavedItemsPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import HelpCenterPage from './pages/HelpCenterPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollHandler() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // allow homepage to render first when navigating from another page
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

  return (
    <ToastProvider>
      <BookmarksProvider>
        <GeoProvider>
          <ChatProvider>
            <DirectoryFiltersProvider>
              <ProduceFiltersProvider>
                <MarketModalProvider>
                <ScrollHandler />
                <Header />
                <main id="main-content" tabIndex={-1}>
                  <div id="page">
                    <Routes>
                      <Route path="/" element={<HomePage visitorCount={visitorCount} />} />
                      <Route path="/markets" element={<DirectoryPage />} />
                      <Route path="/produce" element={<ProducePage />} />
                      <Route path="/produce/:produceId" element={<ProduceDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/saved" element={<SavedItemsPage />} />
                      <Route path="/faq" element={<FaqPage />} />
                      <Route path="/help" element={<HelpCenterPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </div>
                </main>
                <Footer visitorCount={visitorCount} />
                <ChatWidget />
                </MarketModalProvider>
              </ProduceFiltersProvider>
            </DirectoryFiltersProvider>
          </ChatProvider>
        </GeoProvider>
      </BookmarksProvider>
    </ToastProvider>
  );
}
