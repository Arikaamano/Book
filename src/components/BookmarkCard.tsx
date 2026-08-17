import React, { useState, useRef, useEffect } from 'react';
import { Heart, MoreVertical, ExternalLink, Copy, Edit3, Trash2, Check, ArrowUpRight } from 'lucide-react';
import { Bookmark } from '../types/bookmark';
import { getFaviconUrl, getDuckDuckGoFaviconUrl, getIconHorseUrl, getInitials, getInitialColor } from '../utils/faviconUtils';
import { getBrandSvg } from '../utils/brandIcons';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onLaunch: (bookmark: Bookmark) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDeleteRequest: (bookmark: Bookmark) => void;
  onCopyLink?: (url: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onLaunch,
  onToggleFavorite,
  onEdit,
  onDeleteRequest,
  onCopyLink,
  onSelectTag,
}) => {
  const [imgErrorStage, setImgErrorStage] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleCardClick = () => {
    if (!menuOpen) {
      onLaunch(bookmark);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(bookmark.id);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setMenuOpen(false);
    if (onCopyLink) onCopyLink(bookmark.url);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(bookmark);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDeleteRequest(bookmark);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onSelectTag) {
      onSelectTag(tag);
    }
  };

  const bgHue = bookmark.customIconBg || getInitialColor(bookmark.domain || bookmark.name);
  const initials = getInitials(bookmark.name, bookmark.domain);
  const brandSvg = getBrandSvg(bookmark.domain, 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10');

  // Multi-tier favicon resolvers
  const getImageSrc = () => {
    if (brandSvg) return null; // Use direct high-res SVG if available
    if (imgErrorStage === 0) {
      return bookmark.favicon || getFaviconUrl(bookmark.url, bookmark.domain);
    } else if (imgErrorStage === 1) {
      return getDuckDuckGoFaviconUrl(bookmark.domain);
    } else if (imgErrorStage === 2) {
      return getIconHorseUrl(bookmark.domain);
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-150 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#FFF] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none min-h-[165px] sm:min-h-[180px]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLaunch(bookmark);
        }
      }}
      aria-label={`Launch ${bookmark.name} (${bookmark.domain})`}
    >
      {/* Top Bar inside Card: Menu on Left, Favorite Heart on Right */}
      <div className="w-full flex items-center justify-between z-20">
        {/* Context Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            aria-label={`Options for ${bookmark.name}`}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white/40 flex items-center justify-center text-black dark:text-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none transition-all"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Context Dropdown */}
          {menuOpen && (
            <div
              className="absolute top-8 left-0 w-44 sm:w-48 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/40 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] overflow-hidden z-40 py-1 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onLaunch(bookmark);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                <span>Open in Browser</span>
              </button>
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-black">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-700 dark:text-neutral-400 stroke-[2.5]" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onToggleFavorite(bookmark.id);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800"
              >
                <Heart className={`w-4 h-4 stroke-[2.5] ${bookmark.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-neutral-400'}`} />
                <span>{bookmark.isFavorite ? 'Unpin Favorite' : 'Pin to Favorites'}</span>
              </button>
              <button
                onClick={handleEditClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800"
              >
                <Edit3 className="w-4 h-4 text-slate-700 dark:text-neutral-400 stroke-[2.5]" />
                <span>Edit Details</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-rose-100 dark:hover:bg-rose-950 text-xs font-bold text-left text-rose-600 dark:text-rose-400"
              >
                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Launch Indicator / Heart Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFavoriteClick}
            aria-label={bookmark.isFavorite ? `Remove ${bookmark.name} from favorites` : `Add ${bookmark.name} to favorites`}
            className={`w-7 h-7 rounded-lg border border-black dark:border-white/40 flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none ${
              bookmark.isFavorite
                ? 'text-white bg-rose-500'
                : 'text-black dark:text-white bg-white dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Heart
              className={`w-4 h-4 stroke-[2.5] ${bookmark.isFavorite ? 'fill-white text-white' : 'text-black dark:text-white'}`}
            />
          </button>
        </div>
      </div>

      {/* Center Website Logo & Picture Identity */}
      <div className="flex flex-col items-center justify-center pt-1 pb-1 w-full my-auto">
        <div
          className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl border-2 border-black dark:border-white/40 flex items-center justify-center mb-2.5 overflow-hidden shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] group-hover:scale-105 group-hover:rotate-1 transition-all duration-150"
          style={{ backgroundColor: bgHue }}
        >
          {brandSvg ? (
            <div className="flex items-center justify-center p-1">
              {brandSvg}
            </div>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={`${bookmark.name} icon`}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain drop-shadow-xs"
              loading="lazy"
              onError={() => {
                setImgErrorStage((prev) => prev + 1);
              }}
            />
          ) : (
            <span className="text-sm sm:text-base md:text-lg font-black text-black tracking-tight">
              {initials}
            </span>
          )}
        </div>

        {/* Website Name & Subtitle */}
        <div className="text-center w-full px-1 max-w-[140px] sm:max-w-[160px]">
          <p className="font-black text-xs sm:text-sm text-black dark:text-white truncate tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-amber-300 transition-colors">
            {bookmark.name}
          </p>
          <p className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
            {bookmark.domain}
          </p>
        </div>
      </div>

      {/* Card bottom: Tag and Launch indicator */}
      <div className="w-full flex items-center justify-between pt-2 border-t-2 border-black dark:border-white/30 mt-1">
        {bookmark.tags && bookmark.tags.length > 0 ? (
          <button
            type="button"
            onClick={(e) => handleTagClick(e, bookmark.tags[0])}
            title={`Filter by tag #${bookmark.tags[0]}`}
            className="text-[10px] font-black text-black bg-amber-200 hover:bg-amber-300 hover:scale-105 border border-black dark:border-white/40 px-2 py-0.5 rounded-md truncate max-w-[95px] sm:max-w-[110px] shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left"
          >
            #{bookmark.tags[0]}
          </button>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400">Launch</span>
        )}

        <div className="w-6 h-6 rounded-md bg-black dark:bg-white text-white dark:text-black group-hover:bg-indigo-600 dark:group-hover:bg-amber-400 flex items-center justify-center transition-colors shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF]">
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>
    </article>
  );
};
