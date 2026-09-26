import { createContext, useCallback, useContext, useState } from 'react';

/* Shared so every part of the app (market cards, map popups, chatbot,
   saved list, produce modal) can open the market detail modal without
   navigating away from the current page. */
const MarketModalContext = createContext(null);

export function MarketModalProvider({ children }) {
  const [marketId, setMarketId] = useState(null);
  const openMarket = useCallback((id) => setMarketId(Number(id)), []);
  const closeMarket = useCallback(() => setMarketId(null), []);

  return (
    <MarketModalContext.Provider value={{ marketId, openMarket, closeMarket }}>
      {children}
    </MarketModalContext.Provider>
  );
}

export function useMarketModal() {
  return useContext(MarketModalContext);
}
