import { createContext, useCallback, useContext, useState } from 'react';

/* Shared so produce cards, the market modal, chatbot and saved list can
   open the produce detail modal without navigating away. */
const ProduceModalContext = createContext(null);

export function ProduceModalProvider({ children }) {
  const [produceId, setProduceId] = useState(null);
  const openProduce = useCallback((id) => setProduceId(String(id)), []);
  const closeProduce = useCallback(() => setProduceId(null), []);

  return (
    <ProduceModalContext.Provider value={{ produceId, openProduce, closeProduce }}>
      {children}
    </ProduceModalContext.Provider>
  );
}

export function useProduceModal() {
  return useContext(ProduceModalContext);
}
