import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Sparkles, AlertCircle, Plus, Globe, Tag, Heart } from 'lucide-react';
import { Bookmark, PopularWebsite } from '../types/bookmark';
import { findMatchingWebsites } from '../services/popularWebsites';
import { extractDomain, isValidUrl, areUrlsEqual } from '../utils/urlUtils';
import { getFaviconUrl, getInitialColor, getInitials } from '../utils/faviconUtils';
import { getBrandSvg } from '../utils/brandIcons';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
  }) => { success: boolean; error?: string };
  existingBookmarks: Bookmark[];
}

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingBookmarks,
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<PopularWebsite | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus on open
  useEffect(() => {
    if (isOpen) {
      setSearchInput('');
      setSelectedSite(null);
      setCustomName('');
      setCustomUrl('');
      setTagInput('');
      setTags([]);
      setIsFavorite(false);
      setDuplicateWarning(null);
      setErrorMsg(null);

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered popular suggestions
  const suggestions = findMatchingWebsites(searchInput);

  // Check duplicates whenever URL changes
  useEffect(() => {
    const targetUrl = selectedSite ? selectedSite.url : customUrl;
    if (targetUrl && isValidUrl(targetUrl)) {
      const dup = existingBookmarks.find((b) => areUrlsEqual(b.url, targetUrl));
      if (dup) {
        setDuplicateWarning(`"${dup.name}" is already in your bookmarks.`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [selectedSite, customUrl, existingBookmarks]);

  if (!isOpen) return null;

  const handleSelectPopular = (site: PopularWebsite) => {
    setSelectedSite(site);
    setCustomName(site.name);
    setCustomUrl(site.url);
    if (site.category && !tags.includes(site.category)) {
      setTags([site.category]);
    }
    setErrorMsg(null);
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const targetUrl = selectedSite ? selectedSite.url : customUrl;
    const targetName = customName.trim() || (selectedSite ? selectedSite.name : extractDomain(targetUrl));

    if (!targetUrl.trim()) {
      setErrorMsg('Please enter a website URL or select a suggested app.');
      return;
    }

    if (!isValidUrl(targetUrl)) {
      setErrorMsg('Please enter a valid website URL (e.g. https://example.com).');
      return;
    }

    const result = onAdd({
      name: targetName,
      url: targetUrl,
      customIconBg: selectedSite?.iconBg,
      tags: tags.length > 0 ? tags : (selectedSite?.category ? [selectedSite.category] : undefined),
      isFavorite,
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to add bookmark');
    }
  };

  // Preview card computation
  const previewDomain = customUrl ? extractDomain(customUrl) : 'example.com';
  const previewBg = selectedSite?.iconBg || getInitialColor(previewDomain || customName || 'app');
  const previewInitials = getInitials(customName || previewDomain, previewDomain);
  const previewBrandSvg = getBrandSvg(previewDomain, 'w-6 h-6');
  const previewFavicon = customUrl ? getFaviconUrl(customUrl, previewDomain) : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-bookmark-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-black dark:border-white/30 bg-amber-300 dark:bg-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <h2 id="add-bookmark-title" className="text-base sm:text-lg font-black text-black">
              Add New Bookmark
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-white hover:bg-black hover:text-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Duplicate or Error Banner */}
            {(duplicateWarning || errorMsg) && (
              <div className="p-3 bg-rose-100 dark:bg-rose-950/80 border-2 border-black dark:border-rose-500 rounded-xl flex items-center gap-2.5 text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                <span>{errorMsg || duplicateWarning}</span>
              </div>
            )}

            {/* Step 1: Website Search & Quick Discovery */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider">
                1. Search Website or Paste URL
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-neutral-300 stroke-[2.5]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (e.target.value.includes('.') || e.target.value.startsWith('http')) {
                      setCustomUrl(e.target.value);
                      if (!customName) {
                        setCustomName(extractDomain(e.target.value));
                      }
                    }
                  }}
                  placeholder="Search popular websites (GitHub, YouTube, ChatGPT...) or type URL"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 font-bold text-xs sm:text-sm text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] placeholder:text-slate-400 dark:placeholder:text-neutral-500 placeholder:font-medium transition-all"
                />
              </div>

              {/* Popular Discovery Grid */}
              <div className="pt-2">
                <span className="text-[11px] font-black text-black dark:text-neutral-300 block mb-2">
                  Popular Quick Picks with Official Icons
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-0.5">
                  {suggestions.slice(0, 12).map((site) => {
                    const siteSvg = getBrandSvg(site.domain, 'w-4 h-4');
                    const isSelected = selectedSite?.name === site.name;
                    return (
                      <button
                        key={site.name}
                        type="button"
                        onClick={() => handleSelectPopular(site)}
                        className={`p-2 rounded-xl border-2 border-black dark:border-white/30 flex items-center gap-2 text-left transition-all text-xs font-bold ${
                          isSelected
                            ? 'bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000] font-black'
                            : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-neutral-700 shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg border border-black flex items-center justify-center shrink-0 overflow-hidden shadow-[1px_1px_0px_0px_#000]"
                          style={{ backgroundColor: site.iconBg || '#FFFFFF' }}
                        >
                          {siteSvg ? (
                            siteSvg
                          ) : (
                            <img
                              src={getFaviconUrl(site.url, site.domain)}
                              alt=""
                              className="w-3.5 h-3.5 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <span className="truncate">{site.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Details & Customisation */}
            <div className="space-y-3.5 pt-2 border-t-2 border-black dark:border-white/30">
              <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider">
                2. Customise Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black dark:text-white mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                    Website URL *
                  </label>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="w-full h-9.5 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-white mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-[2]" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. My Workspace"
                    className="w-full h-9.5 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-black text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                  Category / Tag
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add category (Dev, Work, Social)..."
                    className="flex-1 h-9.5 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 h-9.5 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl font-black text-xs border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    Add Tag
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-black bg-yellow-200 text-black border-2 border-black px-2.5 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600 ml-1 font-black"
                          aria-label={`Remove tag ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Favorite Checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-white/30 bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700 cursor-pointer shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] transition-colors">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 rounded text-black border-2 border-black focus:ring-black"
                />
                <div className="flex items-center gap-1.5 text-xs font-black text-black dark:text-white">
                  <Heart className={`w-3.5 h-3.5 stroke-[2.5] ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-neutral-400'}`} />
                  <span>Pin to Favorites</span>
                </div>
              </label>
            </div>

            {/* Live Preview Card */}
            {customUrl && (
              <div className="p-3 bg-amber-50 dark:bg-neutral-800/80 border-2 border-black dark:border-white/30 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden"
                    style={{ backgroundColor: previewBg }}
                  >
                    {previewBrandSvg ? (
                      previewBrandSvg
                    ) : previewFavicon ? (
                      <img
                        src={previewFavicon}
                        alt="favicon"
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-black text-black">{previewInitials}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-black dark:text-white">{customName || 'Website Name'}</div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-bold font-mono">{previewDomain}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-black bg-white border-2 border-black px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]">
                  Preview
                </span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-black dark:border-white/30 bg-slate-50 dark:bg-neutral-800/50 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 font-black text-xs text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customUrl || !isValidUrl(customUrl) || !!duplicateWarning}
              className={`px-5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 border-2 border-black dark:border-white/40 transition-all ${
                !customUrl || !isValidUrl(customUrl) || !!duplicateWarning
                  ? 'bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-600 border-slate-400 dark:border-neutral-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Bookmark</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
