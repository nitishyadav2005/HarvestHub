import React from 'react';
import { Sprout, Database, RefreshCw, Layers, ShieldCheck, Menu, LogOut } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  activeTab: string;
  onOpenSystemInfo: () => void;
  onResetSeedData: () => void;
  dbReady: boolean;
  onToggleSidebar?: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSystemInfo,
  onResetSeedData,
  dbReady,
  onToggleSidebar,
  currentUser,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f2f6f3]/95 backdrop-blur-md border-b border-emerald-900/10 px-3 sm:px-6 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs transition-all shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5 text-[#2d6a4f]" />
            </button>
          )}
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 border border-emerald-500/30 shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#d8f3dc]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#1b4332] tracking-tight truncate">
                HarvestHub
              </h1>
              {currentUser?.farmName && (
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7] whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3 text-[#2d6a4f]" /> {currentUser.farmName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-800/80 font-medium hidden sm:block truncate">
              Farm Management & Crop Planning
            </p>
          </div>
        </div>

        {/* Storage Architecture, Profile & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* IndexedDB Status Pill */}
          <button
            onClick={onOpenSystemInfo}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs text-xs font-semibold transition-all shrink-0 cursor-pointer"
            title="View Local IndexedDB Storage & Farm Specs"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dbReady ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dbReady ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
            </span>
            <Database className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
            <span className="hidden xl:inline">Storage:</span>
            <span className="font-bold text-[#1b4332] hidden lg:inline">IndexedDB</span>
            <Layers className="w-3 h-3 text-emerald-600 ml-0.5 hidden xl:inline shrink-0" />
          </button>

          {/* Seed Data Reset Button */}
          <button
            onClick={onResetSeedData}
            className="hidden sm:flex px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-200/80 text-[#1b4332] border border-emerald-300/60 text-xs font-semibold items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            title="Load 4 complete test seed records across fields, equipment, rotations, and operations"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
            <span>Seed 4 Records</span>
          </button>

          {/* User Profile Section with Name & Farm Name */}
          {currentUser && (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-emerald-900/10">
              <div 
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-emerald-200 shadow-xs"
                title={`Logged in as ${currentUser.fullName} (${currentUser.farmName})`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-[#1b4332] leading-tight truncate max-w-[120px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium truncate leading-tight max-w-[120px]">
                    {currentUser.farmName}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 shadow-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                title="Logout of HarvestHub"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
