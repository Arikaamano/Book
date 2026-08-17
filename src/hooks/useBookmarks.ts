/**
 * useBookmarks Hook
 * Central state management for Bookmark Launcher
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Bookmark, ToastMessage, ViewFilter } from '../types/bookmark';
import { bookmarkStorage, INITIAL_DEMO_BOOKMARKS } from '../services/bookmarkStorage';
import { isValidUrl } from '../utils/urlUtils';
import { openInDefaultBrowser } from '../utils/desktopLauncher';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => bookmarkStorage.loadBookmarks());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keep localStorage synced whenever bookmarks update
  useEffect(() => {
    bookmarkStorage.saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Toast helper
  const showToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Filtered lists
  const favorites = useMemo(() => {
    return bookmarks.filter(b => b.isFavorite);
  }, [bookmarks]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach(b => {
      b.tags?.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [bookmarks]);

  // Search & Filtered Bookmarks
  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks];

    if (activeFilter === 'favorites') {
      list = list.filter(b => b.isFavorite);
    } else if (activeFilter === 'recent') {
      list.sort((a, b) => {
        const timeA = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
        const timeB = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    if (selectedTag) {
      list = list.filter(b => b.tags?.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => 
        b.name.toLowerCase().includes(q) ||
        b.domain.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [bookmarks, activeFilter, selectedTag, searchQuery]);

  // Add bookmark
  const addBookmark = useCallback((data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
  }): { success: boolean; error?: string } => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    // Duplicate check
    const duplicate = bookmarkStorage.findDuplicate(bookmarks, data.url);
    if (duplicate) {
      const msg = `"${duplicate.name}" is already bookmarked.`;
      showToast('Duplicate Website', msg, 'warning');
      return { success: false, error: msg };
    }

    const newBookmark = bookmarkStorage.createBookmark(data);
    setBookmarks(prev => [newBookmark, ...prev]);
    
    // Confetti effect
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#000000', '#FF4081', '#1DB954', '#4285F4', '#FFD600']
      });
    } catch {
      // Ignore if canvas is unavailable
    }

    showToast('Bookmark added!', `Added ${newBookmark.name} to your launcher.`);
    return { success: true };
  }, [bookmarks, showToast]);

  // Update bookmark
  const updateBookmark = useCallback((id: string, data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
  }): { success: boolean; error?: string } => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    // Check duplicate excluding self
    const duplicate = bookmarkStorage.findDuplicate(bookmarks, data.url, id);
    if (duplicate) {
      const msg = `Another bookmark (${duplicate.name}) already uses this URL.`;
      showToast('Duplicate URL', msg, 'warning');
      return { success: false, error: msg };
    }

    setBookmarks(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          name: data.name.trim(),
          url: data.url.trim(),
          customIconBg: data.customIconBg ?? b.customIconBg,
          tags: data.tags ?? b.tags,
          isFavorite: data.isFavorite !== undefined ? data.isFavorite : b.isFavorite,
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    }));

    showToast('Changes saved', `Updated ${data.name}.`);
    return { success: true };
  }, [bookmarks, showToast]);

  // Delete bookmark
  const deleteBookmark = useCallback((id: string) => {
    const target = bookmarks.find(b => b.id === id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
    if (target) {
      showToast('Bookmark deleted', `Removed ${target.name} from launcher.`, 'info');
    }
  }, [bookmarks, showToast]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setBookmarks(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.isFavorite;
        showToast(
          nextState ? 'Added to favorites' : 'Removed from favorites',
          `${b.name} is ${nextState ? 'now in favorites' : 'removed from favorites'}.`,
          'info'
        );
        return { ...b, isFavorite: nextState, updatedAt: new Date().toISOString() };
      }
      return b;
    }));
  }, [showToast]);

  // Launch website
  const launchWebsite = useCallback(async (bookmark: Bookmark) => {
    // Record click count & time
    setBookmarks(prev => prev.map(b => {
      if (b.id === bookmark.id) {
        return {
          ...b,
          clickCount: (b.clickCount || 0) + 1,
          lastOpenedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    const result = await openInDefaultBrowser(bookmark.url);
    if (!result.success) {
      showToast('Failed to open link', result.message || 'Check your URL format', 'error');
    }
  }, [showToast]);

  // Export JSON
  const exportData = useCallback(() => {
    const json = bookmarkStorage.exportJSON(bookmarks);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmark-launcher-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export successful', 'Downloaded your bookmarks backup JSON.');
  }, [bookmarks, showToast]);

  // Import JSON
  const importData = useCallback((jsonString: string) => {
    const result = bookmarkStorage.importJSON(jsonString);
    if (result.success && result.bookmarks) {
      setBookmarks(result.bookmarks);
      showToast('Import successful', `Imported ${result.bookmarks.length} bookmarks.`);
      return true;
    } else {
      showToast('Import failed', result.error || 'Invalid file format', 'error');
      return false;
    }
  }, [showToast]);

  // Reset to initial demo bookmarks
  const resetToDefaults = useCallback(() => {
    setBookmarks(INITIAL_DEMO_BOOKMARKS);
    showToast('Reset to defaults', 'Restored default demo bookmarks.', 'info');
  }, [showToast]);

  // Clear all bookmarks
  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    showToast('All bookmarks cleared', 'Launcher is now empty.', 'warning');
  }, [showToast]);

  return {
    bookmarks,
    favorites,
    allTags,
    filteredBookmarks,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    toasts,
    removeToast,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    launchWebsite,
    exportData,
    importData,
    resetToDefaults,
    clearAllBookmarks,
    showToast,
  };
}
