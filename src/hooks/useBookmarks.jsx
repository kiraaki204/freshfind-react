import { createContext, useCallback, useContext, useState } from 'react';
import { useToast } from './useToast.jsx';

const STORAGE_KEY = 'freshfind_bookmarks';

const BookmarksContext = createContext(null);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(load);
  const showToast = useToast();

  const persist = useCallback((next) => {
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode etc. — bookmarks stay in memory */
    }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      showToast(exists ? `${item.name} removed from saved items.` : `${item.name} saved!`);
      return next;
    });
  }, [showToast]);

  const removeBookmark = useCallback((id) => {
    setBookmarks((current) => {
      const removed = current.find((b) => b.id === id);
      const next = current.filter((b) => b.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      showToast(`${removed ? removed.name : 'Item'} removed from saved items.`);
      return next;
    });
  }, [showToast]);

  const setNote = useCallback((id, note) => {
    setBookmarks((current) => {
      const next = current.map((b) => (b.id === id ? { ...b, note } : b));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
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
