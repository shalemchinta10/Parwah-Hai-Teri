import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Shield, Lock, Mail, User, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const { showAuthModal, authModalMode, setShowAuthModal, login, signup, loginAsDemo, forgotPassword, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode, showAuthModal]);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      const res = await login(email || 'citizen@parwah.org', password || 'password123');
      if (!res.success) setErrorMessage(res.error || 'Login failed');
    } else if (mode === 'signup') {
      const res = await signup(email, password, username, fullName);
      if (!res.success) setErrorMessage(res.error || 'Signup failed');
    } else if (mode === 'forgot') {
      const res = await forgotPassword(email);
      setSuccessMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <BrandLogo variant="horizontal" showTagline={true} size="sm" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider pt-1">
              {mode === 'login' ? 'Sign In to Your Account' : mode === 'signup' ? 'Create Citizen Account' : 'Reset Password'}
            </h3>
          </div>

          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 rounded-2xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Required Login Notice Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Login required</span>
          </div>
          <p className="text-xs text-indigo-950 font-medium leading-relaxed">
            To keep Parwah Hai Teri safe and accountable, please log in before sharing or interacting with community content.
          </p>
          <div className="pt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
            <span>✨ Login helps us keep the community safer.</span>
          </div>
        </div>

        {/* Navigation / Action Selector Buttons: [ LOGIN ] [ CREATE ACCOUNT ] [ CONTINUE BROWSING ] */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 text-[11px] font-extrabold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            LOGIN
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CREATE ACCOUNT
          </button>

          <button
            type="button"
            onClick={() => setShowAuthModal(false)}
            className="py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all truncate px-1"
            title="Continue Browsing"
          >
            CONTINUE BROWSING
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name (Private unless consented):</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Public Display Handle:</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="citizen_rajesh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">Password:</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-indigo-600 hover:underline font-bold text-[11px]"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Please wait...'
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>CREATE ACCOUNT</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Quick Demo Sign-In (@citizen_rajesh)</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
        </form>

        {/* Footer / Continue Browsing */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          {mode === 'login' ? (
            <p>
              Need an account?{' '}
              <button onClick={() => setMode('signup')} className="text-indigo-600 font-extrabold hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-indigo-600 font-extrabold hover:underline">
                Sign In
              </button>
            </p>
          )}

          <button
            onClick={() => setShowAuthModal(false)}
            className="text-slate-600 font-extrabold hover:text-slate-900 underline cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
