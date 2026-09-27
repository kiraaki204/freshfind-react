import { createContext, useCallback, useContext, useState } from 'react';
import { useToast } from './useToast.jsx';
import { readJSON, writeJSON } from '../utils/storage.js';

const STORAGE_KEY = 'freshfind_bookmarks';

const BookmarksContext = createContext(null);

function load() {
  const saved = readJSON(STORAGE_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(load);
  const showToast = useToast();

  const persist = useCallback((next) => {
    setBookmarks(next);
    writeJSON(STORAGE_KEY, next)
  }, []);

  const isBookmarked = useCallback(
    (id) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((item) => {
    setBookmarks((current) => {
      const exists = current.some((b) => b.id === item.id);
      const next = exists
        ? current.filter((b) => b.id !== item.id)
        : [...current, {
            id: item.id,
            type: item.type,
            name: item.name,
            location: item.location || '',
            category: item.category || '',
            note: '',
            savedAt: new Date().toISOString(),
          }];
    writeJSON(STORAGE_KEY, next)
      showToast(exists ? `${item.name} removed from saved items.` : `${item.name} saved!`);
      return next;
    });
  }, [showToast]);

  const removeBookmark = useCallback((id) => {
    setBookmarks((current) => {
      const removed = current.find((b) => b.id === id);
      const next = current.filter((b) => b.id !== id);
    writeJSON(STORAGE_KEY, next)
      showToast(`${removed ? removed.name : 'Item'} removed from saved items.`);
      return next;
    });
  }, [showToast]);

  const setNote = useCallback((id, note) => {
    setBookmarks((current) => {
      const next = current.map((b) => (b.id === id ? { ...b, note } : b));
    writeJSON(STORAGE_KEY, next)
      return next;
    });
  }, []);

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, removeBookmark, setNote }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarksContext);
}
