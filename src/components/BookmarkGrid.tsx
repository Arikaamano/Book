import React from 'react';
import { Bookmark, ViewFilter } from '../types/bookmark';
import { BookmarkCard } from './BookmarkCard';
import { EmptyState } from './EmptyState';
import { Plus, Heart, Grid, Search } from 'lucide-react';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  favorites: Bookmark[];
  filteredBookmarks: Bookmark[];
  searchQuery: string;
  activeFilter: ViewFilter;
  onLaunch: (bookmark: Bookmark) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDeleteRequest: (bookmark: Bookmark) => void;
  onAddNew: () => void;
  onClearSearch: () => void;
  onCopyLink?: (url: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const BookmarkGrid: React.FC<BookmarkGridProps> = ({
  bookmarks,
  favorites,
  filteredBookmarks,
  searchQuery,
  activeFilter,
  onLaunch,
  onToggleFavorite,
  onEdit,
  onDeleteRequest,
  onAddNew,
  onClearSearch,
  onCopyLink,
  onSelectTag,
}) => {
  // Empty state when no bookmarks exist at all
  if (bookmarks.length === 0) {
    return <EmptyState type="no-bookmarks" onAction={onAddNew} />;
  }

  // Active search query mode
  if (searchQuery.trim().length > 0) {
    if (filteredBookmarks.length === 0) {
      return (
        <EmptyState
          type="no-search-results"
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
          onAction={onAddNew}
        />
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2 text-black dark:text-white">
            <Search className="w-4 h-4 text-black dark:text-amber-300 stroke-[3]" />
            <span>Search Results</span>
            <span className="font-black text-xs bg-amber-300 text-black border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000]">
              {filteredBookmarks.length}
            </span>
          </h3>
          <button
            onClick={onClearSearch}
            className="text-xs font-black text-slate-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline"
          >
            Clear Search
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </div>
    );
  }

  // Favorites Only Tab
  if (activeFilter === 'favorites') {
    if (favorites.length === 0) {
      return <EmptyState type="no-favorites" onAction={onAddNew} />;
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2 text-black dark:text-white">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 stroke-[2.5]" />
            <span>Favorites</span>
          </h3>
          <span className="font-black text-xs bg-rose-400 text-black border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000]">
            {favorites.length} Pinned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
          {favorites.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default Standard View: Favorites on Top, All Bookmarks below
  return (
    <div className="space-y-7 sm:space-y-8">
      {/* 1. Favorites Section */}
      <section>
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2 text-black dark:text-white">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 stroke-[2.5]" />
            <span>Favorites</span>
          </h3>
          {favorites.length > 0 && (
            <span className="font-black text-xs bg-rose-400 text-black border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000]">
              {favorites.length} Pinned
            </span>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
            {favorites.map((bookmark) => (
              <BookmarkCard
                key={`fav-${bookmark.id}`}
                bookmark={bookmark}
                onLaunch={onLaunch}
                onToggleFavorite={onToggleFavorite}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onCopyLink={onCopyLink}
                onSelectTag={onSelectTag}
              />
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-neutral-900 border-2 border-dashed border-black dark:border-white/30 rounded-2xl p-4 sm:p-5 text-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-neutral-300">
              No favorites yet. Click <Heart className="w-3.5 h-3.5 inline text-rose-500 mx-0.5 fill-rose-500" /> on any card to pin it here.
            </p>
          </div>
        )}
      </section>

      {/* 2. All Bookmarks Section */}
      <section>
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2 text-black dark:text-white">
            <Grid className="w-4 h-4 stroke-[2.5]" />
            <span>All Bookmarks</span>
          </h3>
          <span className="font-black text-xs bg-amber-300 text-black border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000]">
            {bookmarks.length} Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4.5">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={`all-${bookmark.id}`}
              bookmark={bookmark}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}

          {/* Add New Dashed Placeholder Card */}
          <article
            onClick={onAddNew}
            className="bg-amber-100/60 dark:bg-neutral-900/60 hover:bg-amber-200 dark:hover:bg-neutral-800 border-2 border-dashed border-black dark:border-white/40 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center relative group transition-all duration-150 cursor-pointer min-h-[165px] sm:min-h-[180px] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            role="button"
            tabIndex={0}
            aria-label="Add new bookmark"
          >
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-amber-400 text-amber-300 dark:text-black flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_#000] group-hover:scale-110 transition-all">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <p className="font-black text-xs sm:text-sm text-black dark:text-white text-center">
              Add Bookmark
            </p>
            <p className="text-[11px] font-bold text-slate-600 dark:text-neutral-400 mt-0.5 text-center">
              New website
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};
