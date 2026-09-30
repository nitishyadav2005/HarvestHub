import React, { useState } from 'react';
import {
  Sprout,
  Mail,
  Lock,
  User as UserIcon,
  Home,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wheat
} from 'lucide-react';
import { authService, DEFAULT_DEMO_USER } from '../../services/authService';
import type { User } from '../../types';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [registerGeneralError, setRegisterGeneralError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Success message after registration
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Switch modes and clear temporary errors
  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setLoginError(null);
    setRegisterGeneralError(null);
    setRegisterErrors({});
    if (newMode === 'register') {
      setSuccessBanner(null);
    }
  };

  // Demo user quick-fill helper
  const handleFillDemoCredentials = () => {
    setLoginEmail(DEFAULT_DEMO_USER.email || '');
    setLoginPassword(DEFAULT_DEMO_USER.password || '');
    setLoginError(null);
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = loginEmail.trim();
    if (!emailTrimmed || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const user = await authService.login(emailTrimmed, loginPassword);
      onLoginSuccess(user);
    } catch (err: unknown) {
      // User requested exact message: "Invalid email or password."
      if (err instanceof Error && err.message === 'Invalid email or password.') {
        setLoginError('Invalid email or password.');
      } else {
        setLoginError('Invalid email or password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Validate Register Form
  const validateRegistration = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    const emailTrimmed = registerEmail.trim();
    if (!emailTrimmed) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!farmName.trim()) {
      errors.farmName = 'Farm Name is required';
    }

    if (!registerPassword) {
      errors.password = 'Password is required';
    } else if (registerPassword.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (registerPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterGeneralError(null);

    if (!validateRegistration()) {
      return;
    }

    setIsRegistering(true);
    try {
      const registeredUser = await authService.register({
        fullName: fullName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        farmName: farmName.trim()
      });

      // Clear register form
      setFullName('');
      setRegisterEmail('');
      setFarmName('');
      setRegisterPassword('');
      setConfirmPassword('');
      setRegisterErrors({});

      // Set banner and automatically take user to login screen
      setSuccessBanner('Account created successfully.');
      setLoginEmail(registeredUser.email);
      setLoginPassword('');
      setMode('login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRegisterGeneralError(err.message);
      } else {
        setRegisterGeneralError('Failed to create account. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f6f3] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden select-none">
      {/* Subtle organic background decoration */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#b7e4c7]/40 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Brand Card / Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] text-white shadow-lg shadow-emerald-950/20 border-2 border-emerald-400/40 mb-3.5 transform transition-transform hover:scale-105">
            <Sprout className="w-9 h-9 sm:w-11 sm:h-11 text-[#d8f3dc]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight">
            HarvestHub
          </h1>
          <p className="text-xs sm:text-sm font-bold text-emerald-800 tracking-wide mt-0.5 italic">
            Farm Management & Crop Planning
          </p>

          <div className="mt-2.5 inline-block px-4 py-1.5 rounded-full bg-[#d8f3dc]/70 border border-[#b7e4c7] text-[#1b4332] shadow-xs">
            <p className="text-xs sm:text-sm font-semibold tracking-normal">
              &ldquo;Your farm. Your records. Your harvest.&rdquo;
            </p>
          </div>
        </div>

        {/* Claymorphism Form Container */}
        <div className="clay-card p-6 sm:p-8 border border-emerald-100/90 shadow-xl relative backdrop-blur-xs">
          {/* Navigation Toggle: Login / Create Account */}
          <div className="clay-inset p-1.5 flex rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-md shadow-emerald-900/25'
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/40'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              Login
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-md shadow-emerald-900/25'
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/40'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              Create Account
            </button>
          </div>

          {/* Success Banner (e.g. "Account created successfully.") */}
          {successBanner && mode === 'login' && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#d8f3dc] border border-[#74c69d] text-[#1b4332] text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" />
              <div className="flex-1">
                <span>{successBanner}</span>
                <span className="block text-[11px] font-normal text-emerald-800 mt-0.5">
                  Sign in below with your credentials to access your farm dashboard.
                </span>
              </div>
            </div>
          )}

          {/* ===================== LOGIN FORM ===================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* General Login Error */}
              {loginError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="farmer@example.com"
                    autoComplete="email"
                    className="w-full clay-inset pl-10 pr-4 py-2.5 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full clay-inset pl-10 pr-10 py-2.5 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-emerald-700 hover:text-emerald-950 cursor-pointer p-1"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full clay-btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login to HarvestHub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Register */}
              <div className="text-center pt-2">
                <p className="text-xs text-emerald-900 font-medium">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="font-bold text-[#2d6a4f] hover:text-[#1b4332] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Quick Fill Demo Credentials Box */}
              <div className="pt-3 border-t border-emerald-100/80">
                <div
                  onClick={handleFillDemoCredentials}
                  className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#d8f3dc]/50 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100/60 transition-all flex items-center justify-between group"
                  title="Click to auto-fill default demo account credentials"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-xl bg-white text-[#2d6a4f] shadow-2xs group-hover:scale-105 transition-transform">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-bold text-[#1b4332] truncate">
                        Quick Demo: {DEFAULT_DEMO_USER.fullName}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium truncate">
                        {DEFAULT_DEMO_USER.email} ({DEFAULT_DEMO_USER.farmName})
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#2d6a4f] group-hover:underline whitespace-nowrap pl-1">
                    Auto Fill
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* ===================== CREATE ACCOUNT FORM ===================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* General Register Error */}
              {registerGeneralError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{registerGeneralError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 uppercase tracking-wider">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (registerErrors.fullName) {
                        setRegisterErrors((prev) => ({ ...prev, fullName: '' }));
                      }
                    }}
                    placeholder="e.g. Rajesh Kumar"
                    className={`w-full clay-inset pl-10 pr-4 py-2 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all ${
                      registerErrors.fullName ? 'border-rose-400 bg-rose-50/30' : ''
                    }`}
                  />
                </div>
                {registerErrors.fullName && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1 pl-1">
                    {registerErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 uppercase tracking-wider">
                  Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      if (registerErrors.email) {
                        setRegisterErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    placeholder="farmer@example.com"
                    autoComplete="email"
                    className={`w-full clay-inset pl-10 pr-4 py-2 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all ${
                      registerErrors.email ? 'border-rose-400 bg-rose-50/30' : ''
                    }`}
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1 pl-1">
                    {registerErrors.email}
                  </p>
                )}
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 uppercase tracking-wider">
                  Farm Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Home className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => {
                      setFarmName(e.target.value);
                      if (registerErrors.farmName) {
                        setRegisterErrors((prev) => ({ ...prev, farmName: '' }));
                      }
                    }}
                    placeholder="e.g. Green Valley Farm"
                    className={`w-full clay-inset pl-10 pr-4 py-2 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all ${
                      registerErrors.farmName ? 'border-rose-400 bg-rose-50/30' : ''
                    }`}
                  />
                </div>
                {registerErrors.farmName && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1 pl-1">
                    {registerErrors.farmName}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 uppercase tracking-wider">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerErrors.password) {
                        setRegisterErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                    placeholder="At least 4 characters"
                    className={`w-full clay-inset pl-10 pr-10 py-2 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all ${
                      registerErrors.password ? 'border-rose-400 bg-rose-50/30' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 text-emerald-700 hover:text-emerald-950 cursor-pointer p-1"
                    title={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1 pl-1">
                    {registerErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1 uppercase tracking-wider">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (registerErrors.confirmPassword) {
                        setRegisterErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    placeholder="Re-enter password"
                    className={`w-full clay-inset pl-10 pr-10 py-2 text-sm text-[#1b4332] placeholder-emerald-800/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d6a4f] transition-all ${
                      registerErrors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-emerald-700 hover:text-emerald-950 cursor-pointer p-1"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1 pl-1">
                    {registerErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full clay-btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer mt-3 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                {isRegistering ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="text-center pt-2">
                <p className="text-xs text-emerald-900 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="font-bold text-[#2d6a4f] hover:text-[#1b4332] hover:underline cursor-pointer ml-1"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Security / Offline Badge at bottom */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-xs text-emerald-800/80">
          <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
          <span>Local IndexedDB Encrypted Storage &bull; Private & Offline-First</span>
        </div>
      </div>
    </div>
  );
};
