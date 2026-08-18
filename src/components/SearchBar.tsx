import React, { useRef, useEffect, useState } from 'react';
import { Search, X, Command, ExternalLink, ChevronDown } from 'lucide-react';
import { SEARCH_ENGINES, SearchEngine } from '../services/webSearchService';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit?: (query: string, engine?: SearchEngine) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search bookmarks, type any URL, or search the web...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>('google');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      handleLaunchSearchEngine();
    }
  };

  const handleLaunchSearchEngine = () => {
    const q = value.trim();
    if (!q) return;

    if (onSubmit) {
      onSubmit(q, selectedEngine);
    } else {
      const eng = SEARCH_ENGINES.find((s) => s.id === selectedEngine) || SEARCH_ENGINES[0];
      window.open(eng.urlTemplate(q), '_blank', 'noopener,noreferrer');
    }
  };

  const currentEngineObj = SEARCH_ENGINES.find((e) => e.id === selectedEngine) || SEARCH_ENGINES[0];

  return (
    <div className="w-full flex items-center gap-2.5" ref={dropdownRef}>
      {/* Unified Search Input Container */}
      <div className="relative flex-1 flex items-center bg-white dark:bg-neutral-850 border-2 border-black dark:border-white/30 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] focus-within:shadow-[4px_4px_0px_0px_#4F46E5] transition-all overflow-hidden h-11 sm:h-12">
        {/* Engine Dropdown Pill inside input */}
        <div className="relative shrink-0 pl-2">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title={`Search Engine: ${currentEngineObj.name} (Click to change)`}
            className="h-8 px-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-black dark:text-white font-black text-xs flex items-center gap-1.5 border border-black dark:border-white/30 transition-all cursor-pointer select-none"
          >
            <span className="text-xs font-black">{currentEngineObj.icon}</span>
            <span className="hidden sm:inline text-xs font-black">{currentEngineObj.name}</span>
            <ChevronDown className="w-3 h-3 stroke-[3]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-black/10 dark:border-white/10">
                Select Engine
              </div>
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    setSelectedEngine(engine.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedEngine === engine.id
                      ? 'bg-amber-300 dark:bg-amber-400 text-black font-black'
                      : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-black dark:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-black text-xs">{engine.icon}</span>
                    <span>{engine.name}</span>
                  </span>
                  {selectedEngine === engine.id && <span className="font-black">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search or enter web query"
          className="w-full h-full bg-transparent pl-3 pr-12 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-500"
        />

        {/* Clear or Shortcut badge */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {value ? (
            <button
              onClick={onClear}
              aria-label="Clear search query"
              className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white hover:bg-rose-500 hover:text-white flex items-center justify-center border border-black/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-black text-black bg-amber-200 border border-black px-1.5 py-0.5 rounded pointer-events-none shadow-[1px_1px_0px_0px_#000]">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          )}
        </div>
      </div>

      {/* Web Search Button */}
      <button
        type="button"
        onClick={handleLaunchSearchEngine}
        title={`Search on ${currentEngineObj.name} in new window`}
        className="h-11 sm:h-12 px-4 sm:px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-black dark:border-white/30 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
      >
        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
        <span className="hidden md:inline">Search Web</span>
        <span className="md:hidden">Go</span>
      </button>
    </div>
  );
};
