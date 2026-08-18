import React from 'react';
import {
  Grid,
  Heart,
  Download,
  Upload,
  Layers,
  Sparkles,
  Monitor,
  X,
  Plus,
  Settings2,
  FolderPlus,
} from 'lucide-react';
import { Bookmark, CustomCollection, ViewFilter } from '../types/bookmark';
import { AppLogo } from './AppLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface SidebarProps {
  activeFilter: ViewFilter;
  onSelectFilter: (filter: ViewFilter) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  collections: CustomCollection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onCreateCollection: () => void;
  onEditCollection: (col: CustomCollection) => void;
  bookmarks: Bookmark[];
  tags: string[];
  totalCount: number;
  favoritesCount: number;
  onAddNew?: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetDefaults: () => void;
  onOpenPackagingModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  onSelectFilter,
  selectedTag,
  onSelectTag,
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onEditCollection,
  bookmarks,
  tags,
  totalCount,
  favoritesCount,
  onExport,
  onImportClick,
  onResetDefaults,
  onOpenPackagingModal,
  isOpenMobile = false,
  onCloseMobile,
  theme,
  onToggleTheme,
}) => {
  const content = (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      {/* Branding Zone & Mobile Close Button */}
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b-2 border-black dark:border-white/30">
        <AppLogo size="md" showText={true} />
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="md:hidden w-8 h-8 rounded-xl border-2 border-black dark:border-white/40 bg-rose-400 hover:bg-rose-500 flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => {
            onSelectFilter('all');
            onSelectTag(null);
            onSelectCollection(null);
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full text-left p-2.5 rounded-xl font-black text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all ${
            activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_#6366F1]'
              : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Grid
              className={`w-4 h-4 ${
                activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
                  ? 'text-amber-400 dark:text-indigo-600'
                  : 'text-black dark:text-white'
              }`}
            />
            <span>All Bookmarks</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-black border border-black dark:border-white/40 ${
              activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
                ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                : 'bg-amber-100 text-black'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectFilter('favorites');
            onSelectTag(null);
            onSelectCollection(null);
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full text-left p-2.5 rounded-xl font-black text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all ${
            activeFilter === 'favorites' && selectedTag === null && selectedCollectionId === null
              ? 'bg-rose-500 text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]'
              : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Heart
              className={`w-4 h-4 stroke-[2.5] ${
                activeFilter === 'favorites' && selectedTag === null && selectedCollectionId === null
                  ? 'fill-white text-white'
                  : 'fill-rose-500 text-rose-500'
              }`}
            />
            <span>Favorites</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-black bg-white text-rose-600 border border-black">
            {favoritesCount}
          </span>
        </button>
      </nav>

      {/* Custom Named Lists / Collections Section */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2 px-1 text-xs font-black uppercase tracking-wider text-black dark:text-white">
          <div className="flex items-center gap-1.5">
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>Custom Lists</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onCreateCollection();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Create new custom list like Favorites"
            className="text-[10px] text-black dark:text-white bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:text-black border border-black px-1.5 py-0.5 rounded-md font-black flex items-center gap-0.5 shadow-[1px_1px_0px_0px_#000] active:shadow-none"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            <span>New List</span>
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="p-3 bg-white dark:bg-neutral-800 border-2 border-dashed border-slate-300 dark:border-neutral-700 rounded-xl text-center">
            <p className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 mb-1.5">
              No custom lists yet.
            </p>
            <button
              type="button"
              onClick={onCreateCollection}
              className="text-xs font-black text-indigo-600 dark:text-amber-300 underline"
            >
              + Create your first list
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {collections.map((col) => {
              const count = bookmarks.filter((b) => b.collections?.includes(col.id)).length;
              const isSelected = activeFilter === 'collection' && selectedCollectionId === col.id;
              const colColor = getCollectionColor(col.color);

              return (
                <div
                  key={col.id}
                  className={`group/item w-full p-2 rounded-xl font-black text-xs flex items-center justify-between border-2 border-black dark:border-white/30 transition-all cursor-pointer ${
                    isSelected
                      ? `${colColor.bgActive} shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]`
                      : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                  }`}
                  onClick={() => {
                    onSelectFilter('collection');
                    onSelectCollection(col.id);
                    onSelectTag(null);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-md ${colColor.badgeBg} border border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]`}
                    >
                      {renderCollectionIcon(col.icon, 'w-3.5 h-3.5 text-black stroke-[2.5]')}
                    </span>
                    <span className="truncate">{col.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-black border border-black ${
                        isSelected ? 'bg-white text-black' : 'bg-slate-100 dark:bg-neutral-700 text-black dark:text-white'
                      }`}
                    >
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCollection(col);
                      }}
                      title={`Settings for ${col.name}`}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded transition-all"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Theme Toggle in Sidebar */}
      <div className="mt-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} showLabel={true} />
      </div>

      {/* Tags / Category Filtering */}
      {tags.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2 px-1 text-xs font-black uppercase tracking-wider text-black dark:text-white">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Categories</span>
            </div>
            {selectedTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-[10px] text-indigo-600 dark:text-indigo-300 hover:underline font-black bg-indigo-50 dark:bg-indigo-950/60 border border-black dark:border-white/30 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onSelectTag(selectedTag === tag ? null : tag);
                  onSelectCollection(null);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-black transition-all border-2 border-black dark:border-white/40 ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                    : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-yellow-200 dark:hover:bg-neutral-700 shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Installer Info Banner */}
      <div className="mt-4 p-3 bg-cyan-200 dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-4 h-4 text-black dark:text-cyan-400 stroke-[2.5]" />
          <span className="text-xs font-black text-black dark:text-white">Windows Desktop App</span>
        </div>
        <p className="text-[11px] text-slate-900 dark:text-neutral-300 font-medium leading-tight mb-2">
          Packaged native build for Windows start menu & desktop shortcut.
        </p>
        <button
          onClick={() => {
            onOpenPackagingModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-black py-1.5 px-2 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Packaging Guide</span>
        </button>
      </div>

      {/* Bottom Area: Data Management & System Status */}
      <div className="mt-auto pt-4 border-t-2 border-black dark:border-white/30 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExport}
            title="Export JSON backup with custom lists"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export</span>
          </button>

          <button
            onClick={onImportClick}
            title="Import JSON backup"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import</span>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black dark:border-white/40"></div>
              <span className="text-[11px] font-bold text-black dark:text-white">Auto-saved</span>
            </div>
            <button
              onClick={onResetDefaults}
              title="Reset to default bookmarks & lists"
              className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 hover:text-black dark:hover:text-white underline"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-[260px] h-full hidden md:flex flex-col fixed left-0 top-0 p-5 bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white/30 z-40 transition-colors">
        {content}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer Sheet */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white/30 shadow-[4px_0px_0px_0px_#000] p-4 z-10 animate-in slide-in-from-left duration-200 flex flex-col transition-colors">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
