import React from 'react';
import { Sprout, Database, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onOpenSystemInfo: () => void;
  onResetSeedData: () => void;
  dbReady: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSystemInfo,
  onResetSeedData,
  dbReady
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f2f6f3]/90 backdrop-blur-md border-b border-emerald-900/10 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 border border-emerald-500/30">
            <Sprout className="w-6 h-6 text-[#d8f3dc]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-[#1b4332] tracking-tight">
                HarvestHub
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7]">
                <ShieldCheck className="w-3 h-3 text-[#2d6a4f]" /> Farm Journal
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 font-medium hidden sm:block">
              Farm Management & Crop Rotation Planning
            </p>
          </div>
        </div>

        {/* Storage Architecture & Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* IndexedDB Status Pill */}
          <button
            onClick={onOpenSystemInfo}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs text-xs font-semibold transition-all"
            title="View Local IndexedDB & Spring Boot REST API Architecture"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dbReady ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dbReady ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
            </span>
            <Database className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="hidden md:inline">Storage:</span>
            <span className="font-bold text-[#1b4332]">IndexedDB</span>
            <Layers className="w-3 h-3 text-emerald-600 ml-0.5" />
          </button>

          {/* Seed Data Reset Button */}
          <button
            onClick={onResetSeedData}
            className="p-2 md:px-3 md:py-1.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-200/80 text-[#1b4332] border border-emerald-300/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Reset database to fresh sample Indian agricultural data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="hidden md:inline">Reset Seed Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
