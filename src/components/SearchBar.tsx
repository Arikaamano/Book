import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search bookmarks by name, domain, tag...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
        <Search className="w-4 h-4 text-black dark:text-amber-300 stroke-[2.5]" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search bookmarks"
        className="w-full bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-12 sm:pr-16 text-xs sm:text-sm font-bold text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] focus:outline-none focus:shadow-[4px_4px_0px_0px_#6366F1] placeholder:text-slate-400 dark:placeholder:text-neutral-500 placeholder:font-medium transition-all"
      />
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
        {value ? (
          <button
            onClick={onClear}
            aria-label="Clear search query"
            className="w-6 h-6 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-rose-500 dark:hover:bg-rose-500 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-black text-black bg-amber-200 border-2 border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] pointer-events-none">
            <Command className="w-2.5 h-2.5 stroke-[3]" /> K
          </kbd>
        )}
      </div>
    </div>
  );
};
