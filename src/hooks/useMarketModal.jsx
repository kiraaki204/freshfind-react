import { createContext, useCallback, useContext, useState } from 'react';
import MarketModal from '../components/MarketModal.jsx';

/* Shared so every part of the app (market cards, map popups, chatbot,
   saved list, produce pages) can open the market detail modal without
   navigating away from the current page. */
const MarketModalContext = createContext(null);

export function MarketModalProvider({ children }) {
  const [marketId, setMarketId] = useState(null);
  const openMarket = useCallback((id) => setMarketId(Number(id)), []);
  const closeMarket = useCallback(() => setMarketId(null), []);

  return (
    <MarketModalContext.Provider value={{ openMarket }}>
      {children}
      <MarketModal key={marketId ?? 'closed'} marketId={marketId} onClose={closeMarket} />
    </MarketModalContext.Provider>
  );
}

export function useMarketModal() {
  return useContext(MarketModalContext);
}
