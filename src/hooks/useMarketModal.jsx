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
    <MarketModalContext.Provider value={{ openMarket, closeMarket, marketId }}>
      {children}
    </MarketModalContext.Provider>
  );
}

/* Renders the actual market modal. It must be mounted BELOW both the
   market and produce-detail providers (see App.jsx): MarketModal itself
   opens the produce detail modal from its produce tiles, so rendering it
   inside this provider crashed with a null ProduceDetailModal context. */
export function MarketModalHost() {
  const { marketId, closeMarket } = useMarketModal();
  return <MarketModal key={marketId ?? 'closed'} marketId={marketId} onClose={closeMarket} />;
}

export function useMarketModal() {
  return useContext(MarketModalContext);
}
