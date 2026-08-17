import React, { useState, useEffect } from 'react';
import { X, Monitor, Package, Terminal, CheckCircle2, Download, ShieldCheck, Copy, Check } from 'lucide-react';
import { isTauriEnvironment } from '../utils/desktopLauncher';

interface WindowsPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportBackup: () => void;
}

export const WindowsPackagingModal: React.FC<WindowsPackagingModalProps> = ({
  isOpen,
  onClose,
  onExportBackup,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const isTauri = isTauriEnvironment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

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
        aria-labelledby="windows-packaging-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-black dark:border-white/30 bg-cyan-300 dark:bg-cyan-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-cyan-300 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Monitor className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="windows-packaging-title" className="text-base sm:text-lg font-black text-black leading-tight">
                Windows Desktop Launcher
              </h2>
              <p className="text-xs text-slate-900 font-bold">
                Tauri 2 Native Windows Desktop Application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg bg-white hover:bg-black hover:text-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-black dark:text-white">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border-2 border-black dark:border-white/30 flex items-center gap-3 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] ${
            isTauri ? 'bg-emerald-300 dark:bg-emerald-950 text-black dark:text-emerald-200' : 'bg-amber-200 dark:bg-neutral-800 text-black dark:text-neutral-200'
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0 text-black dark:text-emerald-400 stroke-[2.5]" />
            <div>
              <div className="font-black text-xs sm:text-sm">
                {isTauri ? 'Running Native Desktop Runtime (Tauri 2)' : 'Ready for Windows Desktop Compilation'}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-neutral-300 mt-0.5">
                App ID: <code className="font-mono text-black dark:text-white bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-black dark:border-white/30 font-bold">com.bookmarklauncher.app</code>
              </div>
            </div>
          </div>

          {/* Desktop Features Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Desktop Packaging Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border-2 border-black dark:border-white/30 bg-yellow-100 dark:bg-neutral-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
                <div className="font-black text-xs sm:text-sm flex items-center gap-1.5 text-black dark:text-white">
                  <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  <span>Start Menu & Taskbar</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-neutral-400 font-medium mt-1">
                  Installs a desktop shortcut and registers inside the Windows Start Menu.
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black dark:border-white/30 bg-yellow-100 dark:bg-neutral-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
                <div className="font-black text-xs sm:text-sm flex items-center gap-1.5 text-black dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                  <span>Offline Local Storage</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-neutral-400 font-medium mt-1">
                  Preserves bookmarks locally in your app profile without cloud dependency.
                </p>
              </div>
            </div>
          </div>

          {/* Windows Build Commands */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Windows Installer Build Command
            </h4>
            <div className="p-3 rounded-xl bg-black dark:bg-neutral-950 text-white font-mono text-xs flex items-center justify-between border-2 border-black dark:border-white/30 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                <code className="text-amber-300 font-bold">npm run tauri build</code>
              </div>
              <button
                onClick={() => copyToClipboard('npm run tauri build', 'build-cmd')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 active:scale-95 shrink-0 ml-2"
                title="Copy build command"
                aria-label="Copy build command"
              >
                {copied === 'build-cmd' ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-600 dark:text-neutral-400">
              Produces a standalone <code className="text-black bg-amber-200 px-1 py-0.5 rounded border border-black font-bold">Bookmark-Launcher-Setup.exe</code> Windows installer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t-2 border-black dark:border-white/30 bg-slate-50 dark:bg-neutral-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onExportBackup();
            }}
            className="flex items-center gap-1.5 text-xs font-black text-black dark:text-white hover:underline"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export Bookmarks JSON</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
