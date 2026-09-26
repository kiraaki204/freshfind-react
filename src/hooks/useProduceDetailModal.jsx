import { createContext, useCallback, useContext, useState } from 'react';
import produceData from '../data/produce.json';
import ProduceDetailModal from '../components/ProduceDetailModal.jsx';

/* Shared so every part of the app (produce cards, chatbot cards, market
   modal tiles, saved items) can open the produce detail modal without
   navigating away — same pattern as useMarketModal. */
const ProduceDetailModalContext = createContext(null);

export function ProduceDetailModalProvider({ children }) {
  const [produceId, setProduceId] = useState(null);
  const openProduce = useCallback((id) => setProduceId(String(id)), []);
  const closeProduce = useCallback(() => setProduceId(null), []);

  const produce = produceData.find((p) => p.id === produceId) ?? null;

  return (
    <ProduceDetailModalContext.Provider value={{ openProduce }}>
      {children}
      <ProduceDetailModal key={produceId ?? 'closed'} produce={produce} onClose={closeProduce} />
    </ProduceDetailModalContext.Provider>
  );
}

export function useProduceDetailModal() {
  return useContext(ProduceDetailModalContext);
}
