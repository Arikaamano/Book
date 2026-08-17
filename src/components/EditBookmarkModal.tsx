import React, { useState, useEffect } from 'react';
import { X, Globe, Tag, Heart, Save, AlertCircle } from 'lucide-react';
import { Bookmark } from '../types/bookmark';
import { extractDomain, isValidUrl } from '../utils/urlUtils';
import { getFaviconUrl, getInitialColor, getInitials } from '../utils/faviconUtils';
import { getBrandSvg } from '../utils/brandIcons';

interface EditBookmarkModalProps {
  bookmark: Bookmark | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
  }) => { success: boolean; error?: string };
  existingBookmarks: Bookmark[];
}

export const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({
  bookmark,
  isOpen,
  onClose,
  onSave,
  existingBookmarks: _existingBookmarks,
}) => {
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (bookmark) {
      setName(bookmark.name);
      setUrl(bookmark.url);
      setTags(bookmark.tags || []);
      setIsFavorite(bookmark.isFavorite);
      setTagInput('');
      setErrorMsg(null);
    }
  }, [bookmark]);

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

  if (!isOpen || !bookmark) return null;

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

    if (!url.trim()) {
      setErrorMsg('Please enter a website URL.');
      return;
    }

    if (!isValidUrl(url)) {
      setErrorMsg('Please enter a valid website URL (e.g. https://example.com).');
      return;
    }

    const targetName = name.trim() || extractDomain(url);

    const result = onSave(bookmark.id, {
      name: targetName,
      url,
      tags,
      isFavorite,
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to update bookmark');
    }
  };

  const previewDomain = extractDomain(url) || 'example.com';
  const previewBg = bookmark.customIconBg || getInitialColor(previewDomain || name);
  const previewInitials = getInitials(name || previewDomain, previewDomain);
  const previewBrandSvg = getBrandSvg(previewDomain, 'w-6 h-6');
  const previewFavicon = isValidUrl(url) ? getFaviconUrl(url, previewDomain) : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-bookmark-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-black dark:border-white/30 bg-cyan-300 dark:bg-cyan-400 flex items-center justify-between">
          <h2 id="edit-bookmark-title" className="text-base sm:text-lg font-black text-black">
            Edit Bookmark
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-white hover:bg-black hover:text-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {errorMsg && (
              <div className="p-3 bg-rose-100 dark:bg-rose-950/80 border-2 border-black dark:border-rose-500 rounded-xl flex items-center gap-2 text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GitHub"
                className="w-full h-9.5 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                Website URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full h-9.5 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black dark:text-white mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                Categories / Tags
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
                  placeholder="Add tag and press Enter..."
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

            {/* Quick Preview */}
            <div className="p-3 bg-amber-50 dark:bg-neutral-800/80 border-2 border-black dark:border-white/30 rounded-xl flex items-center gap-3 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
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
              <div className="min-w-0">
                <div className="font-black text-xs sm:text-sm text-black dark:text-white truncate">{name || 'Website Name'}</div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 font-mono truncate">{previewDomain}</div>
              </div>
            </div>
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
              className="px-5 py-2 rounded-xl font-black text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
