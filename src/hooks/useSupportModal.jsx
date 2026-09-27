import { createContext, useCallback, useContext, useState } from 'react';
import FaqModal from '../components/FaqModal.jsx';
import HelpCenterModal from '../components/HelpCenterModal.jsx';
import TermsModal from '../components/TermsModal.jsx';
import PrivacyModal from '../components/PrivacyModal.jsx';
import SavedItemsModal from '../components/SavedItemsModal.jsx';





const SupportModalContext = createContext(null);

const VALID = new Set(['faq', 'help', 'terms', 'privacy', 'saved']);

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
      <SavedItemsModal open={active === 'saved'} onClose={closeSupport} />
    </SupportModalContext.Provider>
  );
}

export function useSupportModal() {
  return useContext(SupportModalContext);
}
