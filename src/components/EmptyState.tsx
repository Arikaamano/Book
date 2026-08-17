import React from 'react';
import { BookmarkPlus, Heart, SearchX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-bookmarks' | 'no-favorites' | 'no-search-results';
  searchQuery?: string;
  onAction?: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onAction,
  onClearSearch,
}) => {
  if (type === 'no-search-results') {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
        <div className="w-16 h-16 bg-amber-300 border-2 border-black dark:border-white/40 rounded-2xl flex items-center justify-center mb-4 text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
          <SearchX className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h4 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5">No bookmarks found</h4>
        <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm max-w-md mb-5 leading-relaxed">
          No websites matched <span className="font-black text-black bg-amber-200 border border-black px-1.5 py-0.5 rounded">"{searchQuery}"</span>. Try adjusting your keywords or add a new bookmark.
        </p>
        <div className="flex items-center gap-2.5">
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-black dark:text-white font-black text-xs sm:text-sm py-2 px-4 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Clear Search
            </button>
          )}
          {onAction && (
            <button
              onClick={onAction}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-2 px-4 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2 transition-all"
            >
              <BookmarkPlus className="w-4 h-4 stroke-[3]" />
              <span>Add Bookmark</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'no-favorites') {
    return (
      <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] max-w-lg mx-auto my-4 sm:my-6">
        <div className="w-14 h-14 bg-rose-400 border-2 border-black dark:border-white/40 text-black rounded-2xl mx-auto mb-3.5 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
          <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
        </div>
        <h4 className="text-base sm:text-lg font-black text-black dark:text-white mb-1">No favorites pinned yet</h4>
        <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed mb-4">
          Click the <Heart className="w-3.5 h-3.5 inline text-rose-500 mx-0.5 fill-rose-500" /> heart icon on any website card to pin it here for rapid access.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-amber-200 border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#000]">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Quick launch with 1-click</span>
        </div>
      </div>
    );
  }

  // type === 'no-bookmarks'
  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-8 sm:p-12 text-center shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#FFF] max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-amber-400 border-2 border-black dark:border-white/40 text-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
        <BookmarkPlus className="w-8 h-8 stroke-[2.5]" />
      </div>
      <h3 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5">No bookmarks saved yet</h3>
      <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed mb-6">
        Start building your personal desktop launcher by adding your favorite websites, web apps, and tools.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-2.5 px-6 rounded-xl border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <BookmarkPlus className="w-4 h-4 stroke-[3]" />
          <span>Add Your First Website</span>
        </button>
      )}
    </div>
  );
};
