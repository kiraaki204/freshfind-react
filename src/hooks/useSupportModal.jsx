import { createContext, useCallback, useContext, useState } from 'react';
import FaqModal from '../components/FaqModal.jsx';
import HelpCenterModal from '../components/HelpCenterModal.jsx';
import TermsModal from '../components/TermsModal.jsx';
import PrivacyModal from '../components/PrivacyModal.jsx';

/* Shared support-modal system: FAQ, Help Center, Terms of Service and the
   Privacy Policy open as accessible dialogs over the current page instead
   of navigating to standalone routes. Any part of the app (footer, contact
   section, other modals) can request one by id. */
const SupportModalContext = createContext(null);

const VALID = new Set(['faq', 'help', 'terms', 'privacy']);

export function SupportModalProvider({ children }) {
  const [active, setActive] = useState(null);

  const openSupport = useCallback((id) => {
    setActive(VALID.has(id) ? id : null);
  }, []);
  const closeSupport = useCallback(() => setActive(null), []);

  return (
    <SupportModalContext.Provider value={{ activeSupport: active, openSupport, closeSupport }}>
      {children}
      <FaqModal open={active === 'faq'} onClose={closeSupport} />
      <HelpCenterModal open={active === 'help'} onClose={closeSupport} />
      <TermsModal open={active === 'terms'} onClose={closeSupport} />
      <PrivacyModal open={active === 'privacy'} onClose={closeSupport} />
    </SupportModalContext.Provider>
  );
}

export function useSupportModal() {
  return useContext(SupportModalContext);
}
