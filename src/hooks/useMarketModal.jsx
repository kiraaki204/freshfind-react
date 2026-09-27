import { createContext, useCallback, useContext, useState } from 'react';
import MarketModal from '../components/MarketModal.jsx';




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





export function MarketModalHost() {
  const { marketId, closeMarket } = useMarketModal();
  return <MarketModal key={marketId ?? 'closed'} marketId={marketId} onClose={closeMarket} />;
}

export function useMarketModal() {
  return useContext(MarketModalContext);
}
