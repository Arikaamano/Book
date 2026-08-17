import React from 'react';
import {
  Grid,
  Heart,
  Plus,
  Download,
  Upload,
  Layers,
  Sparkles,
  Monitor,
  X,
} from 'lucide-react';
import { ViewFilter } from '../types/bookmark';
import { AppLogo } from './AppLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

interface SidebarProps {
  activeFilter: ViewFilter;
  onSelectFilter: (filter: ViewFilter) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  tags: string[];
  totalCount: number;
  favoritesCount: number;
  onAddNew: () => void;
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
  tags,
  totalCount,
  favoritesCount,
  onAddNew,
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
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Branding Zone & Mobile Close Button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black dark:border-white/30">
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
      <nav className="flex flex-col gap-2.5">
        <button
          onClick={() => {
            onAddNew();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full text-left p-3 bg-amber-400 hover:bg-amber-300 rounded-xl border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] font-black text-sm flex items-center justify-between text-black transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <div className="flex items-center gap-2.5">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bookmark</span>
          </div>
          <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded border border-black uppercase tracking-wide">
            Ctrl+N
          </span>
        </button>

        <button
          onClick={() => {
            onSelectFilter('all');
            onSelectTag(null);
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full text-left p-3 rounded-xl font-black text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all ${
            activeFilter === 'all' && selectedTag === null
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_#6366F1]'
              : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Grid className={`w-4 h-4 ${activeFilter === 'all' && selectedTag === null ? 'text-amber-400 dark:text-indigo-600' : 'text-black dark:text-white'}`} />
            <span>All Bookmarks</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-black border border-black dark:border-white/40 ${
            activeFilter === 'all' && selectedTag === null
              ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
              : 'bg-amber-100 text-black'
          }`}>
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectFilter('favorites');
            onSelectTag(null);
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full text-left p-3 rounded-xl font-black text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all ${
            activeFilter === 'favorites' && selectedTag === null
              ? 'bg-rose-500 text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]'
              : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Heart className={`w-4 h-4 stroke-[2.5] ${activeFilter === 'favorites' && selectedTag === null ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
            <span>Favorites</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-black bg-white text-rose-600 border border-black">
            {favoritesCount}
          </span>
        </button>
      </nav>

      {/* Theme Toggle in Sidebar */}
      <div className="mt-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} showLabel={true} />
      </div>

      {/* Tags / Category Filtering */}
      {tags.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5 px-1 text-xs font-black uppercase tracking-wider text-black dark:text-white">
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
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-black transition-all border-2 border-black dark:border-white/40 ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                    : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-yellow-200 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Installer Info Banner */}
      <div className="mt-5 p-3.5 bg-cyan-200 dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-4 h-4 text-black dark:text-cyan-400 stroke-[2.5]" />
          <span className="text-xs font-black text-black dark:text-white">Windows Desktop App</span>
        </div>
        <p className="text-[11px] text-slate-900 dark:text-neutral-300 font-medium leading-tight mb-2.5">
          Packaged native build for Windows start menu, desktop shortcut & taskbar.
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
      <div className="mt-auto pt-5 border-t-2 border-black dark:border-white/30 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExport}
            title="Export JSON backup"
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export</span>
          </button>

          <button
            onClick={onImportClick}
            title="Import JSON backup"
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import</span>
          </button>
        </div>

        <div>
          <p className="text-[10px] uppercase font-black text-slate-500 dark:text-neutral-400 tracking-wider mb-1">
            Local Storage
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black dark:border-white/40"></div>
              <span className="text-xs font-bold text-black dark:text-white">Auto-saved</span>
            </div>
            <button
              onClick={onResetDefaults}
              title="Reset to default bookmarks"
              className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 hover:text-black dark:hover:text-white underline"
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
          <div className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white/30 shadow-[4px_0px_0px_0px_#000] p-5 z-10 animate-in slide-in-from-left duration-200 flex flex-col transition-colors">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
