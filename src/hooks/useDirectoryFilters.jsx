import { createContext, useCallback, useContext, useState } from 'react';

export const DEFAULT_DIRECTORY_FILTERS = {
  search: '', area: '', day: '', produce: '', sort: 'alpha', view: 'list',
};

const DirectoryFiltersContext = createContext(null);



export function DirectoryFiltersProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_DIRECTORY_FILTERS);
  const [popupRequest, setPopupRequest] = useState(null);

  const update = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const requestMapPopup = useCallback((marketId) => {
    setPopupRequest({ id: marketId, nonce: Date.now() });
  }, []);

  const clearPopupRequest = useCallback(() => {
    setPopupRequest(null);
  }, []);

  return (
    <DirectoryFiltersContext.Provider
      value={{ filters, update, popupRequest, requestMapPopup, clearPopupRequest }}
    >
      {children}
    </DirectoryFiltersContext.Provider>
  );
}

export function useDirectoryFilters() {
  return useContext(DirectoryFiltersContext);
}
