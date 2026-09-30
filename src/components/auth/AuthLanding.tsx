import React from 'react';
import { Sprout, LogIn, UserPlus, ShieldCheck, Database, Leaf } from 'lucide-react';

interface AuthLandingProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({
  onGoToLogin,
  onGoToRegister
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Existing HarvestHub Brand Icon & Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-white shadow-lg shadow-emerald-900/25 border border-emerald-500/30 mb-5">
        <Sprout className="w-9 h-9 sm:w-11 sm:h-11 text-[#d8f3dc]" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7] text-xs font-bold mb-3 shadow-xs">
          <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" /> Local Farm Journal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1b4332] tracking-tight mb-2">
          HarvestHub
        </h1>
        <p className="text-sm sm:text-base text-emerald-800/90 font-medium max-w-xs sm:max-w-sm mx-auto">
          Farm Management & Crop Rotation Journal
        </p>
      </div>

      {/* Navigation Action Buttons */}
      <div className="w-full flex flex-col gap-3.5 mb-8">
        <button
          type="button"
          onClick={onGoToLogin}
          className="clay-btn-primary w-full py-3.5 px-6 rounded-2xl text-base font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2.5"
        >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </button>

        <button
          type="button"
          onClick={onGoToRegister}
          className="clay-btn-secondary w-full py-3.5 px-6 rounded-2xl text-base font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2.5"
        >
          <UserPlus className="w-5 h-5 text-[#2d6a4f]" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Trust & Offline Storage Footnote */}
      <div className="pt-5 border-t border-emerald-100/80 w-full flex items-center justify-center gap-4 text-xs text-emerald-700/80 font-medium">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#2d6a4f]" />
          IndexedDB Private Storage
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
          100% Offline Capable
        </span>
      </div>
    </div>
  );
};
