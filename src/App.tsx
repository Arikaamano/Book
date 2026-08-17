/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useBookmarks } from './hooks/useBookmarks';
import { useTheme } from './hooks/useTheme';
import { Bookmark } from './types/bookmark';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { BookmarkGrid } from './components/BookmarkGrid';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { EditBookmarkModal } from './components/EditBookmarkModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { WindowsPackagingModal } from './components/WindowsPackagingModal';
import { ToastContainer } from './components/Toast';
import { Grid, Heart, Plus, Layers, X } from 'lucide-react';

export default function App() {
  const {
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
    showToast,
  } = useBookmarks();

  const { theme, toggleTheme } = useTheme();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [isPackagingModalOpen, setIsPackagingModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts (Ctrl+N for Add, Esc handled in modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetHome = () => {
    setActiveFilter('all');
    setSelectedTag(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121212] text-black dark:text-white flex flex-col antialiased selection:bg-amber-300 dark:selection:bg-amber-400 selection:text-black transition-colors">
      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <Header
        activeFilter={activeFilter}
        onSelectFilter={(filter) => {
          setActiveFilter(filter);
          setSelectedTag(null);
        }}
        onAddNew={() => setIsAddModalOpen(true)}
        onOpenPackagingModal={() => setIsPackagingModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        onResetHome={handleResetHome}
        favoritesCount={favorites.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex flex-row">
        {/* Sidebar (Desktop docked + Mobile slide-out drawer) */}
        <Sidebar
          activeFilter={activeFilter}
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setSelectedTag(null);
          }}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          tags={allTags}
          totalCount={bookmarks.length}
          favoritesCount={favorites.length}
          onAddNew={() => setIsAddModalOpen(true)}
          onExport={exportData}
          onImportClick={() => fileInputRef.current?.click()}
          onResetDefaults={resetToDefaults}
          onOpenPackagingModal={() => setIsPackagingModalOpen(true)}
          isOpenMobile={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-[260px] p-4 sm:p-6 md:p-8 lg:p-10 mb-20 md:mb-8 max-w-7xl mx-auto w-full">
          {/* Header & Search Zone */}
          <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                {activeFilter === 'favorites' ? (
                  <span className="flex items-center gap-2">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500 stroke-[2.5]" />
                    <span>Favorite Websites</span>
                  </span>
                ) : (
                  <span>All Bookmarks</span>
                )}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-neutral-400 mt-1">
                {activeFilter === 'favorites'
                  ? 'Your quick-access pinned websites and favorite tools.'
                  : 'Click any card to launch it instantly in your browser.'}
              </p>
            </div>

            {/* Fluid Search Bar */}
            <div className="w-full md:w-80 lg:w-96">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
            </div>
          </div>

          {/* Mobile Horizontal Category Chips */}
          {allTags.length > 0 && (
            <div className="md:hidden mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-3 py-1.5 rounded-lg font-black whitespace-nowrap border-2 border-black dark:border-white/40 transition-all ${
                  selectedTag === null
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-[2px_2px_0px_0px_#4F46E5]'
                    : 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-black whitespace-nowrap border-2 border-black dark:border-white/40 transition-all ${
                    selectedTag === tag
                      ? 'bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                      : 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="mb-5 flex items-center justify-between gap-2 bg-yellow-200 dark:bg-neutral-800 border-2 border-black dark:border-white/30 p-2 sm:p-2.5 rounded-xl max-w-fit shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
              <span className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                Filtered by: <span className="font-black text-black dark:text-amber-300">#{selectedTag}</span>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                aria-label="Clear category filter"
                className="text-xs text-black dark:text-white bg-white dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-neutral-700 border border-black dark:border-white/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none transition-colors font-bold"
              >
                <X className="w-3 h-3 stroke-[3]" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Main Grid View */}
          <BookmarkGrid
            bookmarks={bookmarks}
            favorites={favorites}
            filteredBookmarks={filteredBookmarks}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onLaunch={launchWebsite}
            onToggleFavorite={toggleFavorite}
            onEdit={(bm) => setEditingBookmark(bm)}
            onDeleteRequest={(bm) => setDeletingBookmark(bm)}
            onAddNew={() => setIsAddModalOpen(true)}
            onClearSearch={() => setSearchQuery('')}
            onCopyLink={() => showToast('Link copied', 'Website URL copied to clipboard.')}
            onSelectTag={setSelectedTag}
          />
        </main>
      </div>

      {/* Bottom Floating Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden flex justify-around items-center py-2 px-3 bg-white dark:bg-neutral-900 border-t-2 border-black dark:border-white/30 shadow-[0_-2px_0px_0px_rgba(0,0,0,0.1)] z-40 transition-colors">
        <button
          onClick={() => {
            setActiveFilter('all');
            setSelectedTag(null);
          }}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
            activeFilter === 'all' && selectedTag === null
              ? 'text-black font-black bg-amber-300 dark:bg-amber-400 border border-black rounded-lg shadow-[1px_1px_0px_0px_#000]'
              : 'text-slate-700 dark:text-neutral-400 font-bold'
          }`}
        >
          <Grid className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">All</span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('favorites');
            setSelectedTag(null);
          }}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
            activeFilter === 'favorites'
              ? 'text-white font-black bg-rose-500 border border-black dark:border-white/40 rounded-lg shadow-[1px_1px_0px_0px_#000]'
              : 'text-slate-700 dark:text-neutral-400 font-bold'
          }`}
        >
          <Heart className={`w-5 h-5 stroke-[2.5] ${activeFilter === 'favorites' ? 'fill-white' : ''}`} />
          <span className="text-[10px] mt-0.5">Favorites</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center rounded-xl px-3 py-1 text-black dark:text-white font-bold active:scale-95"
        >
          <Layers className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>
      </nav>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addBookmark}
        existingBookmarks={bookmarks}
      />

      <EditBookmarkModal
        bookmark={editingBookmark}
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={updateBookmark}
        existingBookmarks={bookmarks}
      />

      <DeleteConfirmModal
        bookmark={deletingBookmark}
        isOpen={!!deletingBookmark}
        onClose={() => setDeletingBookmark(null)}
        onConfirm={deleteBookmark}
      />

      <WindowsPackagingModal
        isOpen={isPackagingModalOpen}
        onClose={() => setIsPackagingModalOpen(false)}
        onExportBackup={exportData}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
