import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, LogIn, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import type { UserSession } from '../../types';

interface LoginFormProps {
  onSuccess: (session: UserSession) => void;
  onGoToRegister: () => void;
  onBackToLanding: () => void;
  initialMessage?: string | null;
  initialEmail?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onGoToRegister,
  onBackToLanding,
  initialMessage,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(initialMessage || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Invalid email or password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.session) {
        onSuccess(result.session);
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('farmer@harvesthub.com');
    setPassword('password123');
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  return (
    <div className="flex flex-col">
      {/* Back button to landing */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Account Login
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1b4332] tracking-tight mb-1">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-emerald-800/80">
          Log in to access your farm management records & field journal
        </p>
      </div>

      {/* Success Notification (e.g. from registration) */}
      {successNotice && (
        <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="farmer@harvesthub.com"
              required
              autoFocus
              className="clay-inset w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="••••••••"
              required
              className="clay-inset w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-700 hover:text-emerald-950 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="clay-btn-primary w-full mt-2 py-3.5 px-6 rounded-2xl text-sm sm:text-base font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span>Login</span>
        </button>
      </form>

      {/* Switch to Create Account */}
      <div className="mt-6 text-center text-xs sm:text-sm text-emerald-800">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onGoToRegister}
          className="font-bold text-[#1b4332] hover:text-[#2d6a4f] underline underline-offset-2 transition-colors cursor-pointer"
        >
          Create Account
        </button>
      </div>

      {/* Test Demo Account Helper */}
      <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-emerald-900 text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" /> Quick Test Account:
          </p>
          <p className="text-[11px] text-emerald-700 font-mono truncate">farmer@harvesthub.com</p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-emerald-300 text-[#1b4332] hover:bg-emerald-100/60 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          Fill Demo
        </button>
      </div>
    </div>
  );
};
