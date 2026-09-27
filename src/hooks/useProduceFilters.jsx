import { createContext, useCallback, useContext, useState } from 'react';

export const DEFAULT_PRODUCE_FILTERS = { search: '', category: 'All', season: 'All' };

const ProduceFiltersContext = createContext(null);


export function ProduceFiltersProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_PRODUCE_FILTERS);

  const update = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const replace = useCallback((next) => {
    setFilters({ ...DEFAULT_PRODUCE_FILTERS, ...next });
  }, []);

  return (
    <ProduceFiltersContext.Provider value={{ filters, update, replace }}>
      {children}
    </ProduceFiltersContext.Provider>
  );
}

export function useProduceFilters() {
  return useContext(ProduceFiltersContext);
}
