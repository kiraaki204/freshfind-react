import { createContext, useCallback, useContext, useState } from 'react';

export const DEFAULT_DIRECTORY_FILTERS = {
  search: '', area: '', day: '', produce: '', sort: 'alpha', view: 'list',
};

const DirectoryFiltersContext = createContext(null);

/** Directory state is shared because the chatbot can drive it
    (search the directory, switch to the map view, open a marker). */
export function DirectoryFiltersProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_DIRECTORY_FILTERS);
  const [popupRequest, setPopupRequest] = useState(null);

  const update = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const requestMapPopup = useCallback((marketId) => {
    setPopupRequest({ id: marketId, nonce: Date.now() });
  }, []);

  return (
    <DirectoryFiltersContext.Provider value={{ filters, update, popupRequest, requestMapPopup }}>
      {children}
    </DirectoryFiltersContext.Provider>
  );
}

export function useDirectoryFilters() {
  return useContext(DirectoryFiltersContext);
}
