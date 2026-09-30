import React, { useState, useEffect } from 'react';
import { AuthLanding } from './AuthLanding';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authService } from '../../services/authService';
import type { UserSession } from '../../types';

interface AuthContainerProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultView?: 'landing' | 'login' | 'register';
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onLoginSuccess,
  defaultView = 'landing'
}) => {
  const [view, setView] = useState<'landing' | 'login' | 'register'>(defaultView);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  // Initialize demo account in IndexedDB users store if empty
  useEffect(() => {
    authService.initAuth();
  }, []);

  const handleRegisterSuccess = (email: string) => {
    setPrefilledEmail(email);
    setLoginMessage('Account created successfully.');
    setView('login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#f2f6f3] text-[#1c2e24] relative overflow-hidden select-none">
      {/* Subtle organic background ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl pointer-events-none" />

      {/* Main Claymorphism Auth Card */}
      <div className="clay-card w-full max-w-md p-6 sm:p-8 relative z-10 border border-white/60 shadow-xl transition-all">
        {view === 'landing' && (
          <AuthLanding
            onGoToLogin={() => {
              setLoginMessage(null);
              setView('login');
            }}
            onGoToRegister={() => {
              setLoginMessage(null);
              setView('register');
            }}
          />
        )}

        {view === 'login' && (
          <LoginForm
            onSuccess={onLoginSuccess}
            onGoToRegister={() => {
              setLoginMessage(null);
              setView('register');
            }}
            onBackToLanding={() => {
              setLoginMessage(null);
              setView('landing');
            }}
            initialMessage={loginMessage}
            initialEmail={prefilledEmail}
          />
        )}

        {view === 'register' && (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onGoToLogin={() => {
              setLoginMessage(null);
              setView('login');
            }}
            onBackToLanding={() => {
              setLoginMessage(null);
              setView('landing');
            }}
          />
        )}
      </div>
    </div>
  );
};
