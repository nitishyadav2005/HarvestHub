import React, { useState } from 'react';
import { Mail, Lock, User, Home, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';

interface RegisterFormProps {
  onSuccess: (email: string) => void;
  onGoToLogin: () => void;
  onBackToLanding: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onGoToLogin,
  onBackToLanding
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmName, setFarmName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Required fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !farmName.trim()
    ) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Validation 2: Valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Validation 3: Password confirmation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Validation 4: Prevent duplicate email accounts (handled inside authService.register)
      const result = await authService.register({
        fullName,
        email,
        password,
        farmName
      });

      if (!result.success) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }

      // Show: "Account created successfully."
      setSuccessMessage('Account created successfully.');

      // Then redirect to Login
      setTimeout(() => {
        onSuccess(email.trim().toLowerCase());
      }, 1000);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
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
          New Farmer Registration
        </span>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-black text-[#1b4332] tracking-tight mb-1">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-emerald-800/80">
          Set up your local farm profile and credentials
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{successMessage}</span>
            <p className="text-xs text-emerald-700 mt-0.5">Redirecting to login...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. Ramesh Patel"
              required
              className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
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
              placeholder="farmer@example.com"
              required
              className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Farm Name */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
            Farm Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
              <Home className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={farmName}
              onChange={(e) => {
                setFarmName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. Sunrise Organic Farm"
              required
              className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
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
              placeholder="At least 6 characters"
              required
              className="clay-inset w-full pl-10 pr-10 py-2.5 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Re-enter your password"
              required
              className="clay-inset w-full pl-10 pr-10 py-2.5 text-sm text-[#1c2e24] placeholder-emerald-900/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-700 hover:text-emerald-950 cursor-pointer"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !!successMessage}
          className="clay-btn-primary w-full mt-2 py-3.5 px-6 rounded-2xl text-sm sm:text-base font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span>Create Account</span>
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs sm:text-sm text-emerald-800">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-bold text-[#1b4332] hover:text-[#2d6a4f] underline underline-offset-2 transition-colors cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};
