import React, { useState } from 'react';
import {
  Search,
  Globe,
  Bell,
  User,
  PlusCircle,
  Menu,
  X,
  HelpCircle,
  UserCheck,
  LogIn,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Palette,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCommunity } from '../context/CommunityContext';
import { useTheme, THEME_OPTIONS, ThemeMode } from '../context/ThemeContext';
import { SupportedLanguageCode } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenWhatHappened: () => void;
  onSearchSubmit: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWhatHappened, onSearchSubmit }) => {
  const { currentUser, logout, setShowAuthModal } = useAuth();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const { notifications, activeTab, setActiveTab } = useCommunity();
  const { theme, setTheme, currentThemeOption } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      if (activeTab !== 'feed') setActiveTab('feed');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Tagline */}
          <BrandLogo
            onClick={() => setActiveTab('home')}
            variant="header"
            showTagline={true}
          />

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone, UPI, topic, location or user..."
                className="w-full bg-slate-100/80 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('check')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'check'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Check</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Community
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'volunteers'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Volunteers</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Primary CTA: "GET HELP" */}
            <button
              onClick={onOpenWhatHappened}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-300 animate-gentle-pulse hover:shadow-lg hover:shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>GET HELP</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsThemeMenuOpen(false);
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-2 rounded-2xl text-xs font-bold text-slate-700 border border-slate-200/80 transition-colors"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="uppercase font-extrabold text-[11px] hidden xs:inline">
                  {currentLanguage}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Language / भाषा
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as SupportedLanguageCode);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentLanguage === l.code ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700'
                        }`}
                      >
                        <span>{l.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{l.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsThemeMenuOpen(!isThemeMenuOpen);
                  setIsLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-2 rounded-2xl text-xs font-bold text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                title="Change Theme"
              >
                <Palette className="w-4 h-4 text-indigo-600" />
                <span className="font-extrabold text-[11px] hidden md:inline">
                  {currentThemeOption.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Select Theme
                  </div>
                  {THEME_OPTIONS.map((tOpt) => (
                    <button
                      key={tOpt.id}
                      onClick={() => {
                        setTheme(tOpt.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        theme === tOpt.id
                          ? 'bg-indigo-50 text-indigo-900 font-extrabold border border-indigo-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full ${tOpt.primaryBg} border border-white shadow-xs shrink-0`} />
                        <div>
                          <div className="font-bold text-xs">{tOpt.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium line-clamp-1">{tOpt.description}</div>
                        </div>
                      </div>
                      {theme === tOpt.id && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Icon */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {currentUser.fullName || currentUser.username}
                      </p>
                      <p className="text-[11px] text-indigo-600 font-bold truncate">{currentUser.username}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Vault</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('about');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>About & Helplines</span>
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true, 'login')}
                className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200/80"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 py-3 space-y-1 bg-white animate-fadeIn">
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phone, UPI, topic or city..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800"
                />
              </div>
            </form>

            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('check');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50"
            >
              Check Something
            </button>
            <button
              onClick={() => {
                setActiveTab('feed');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Community Feed
            </button>
            <button
              onClick={() => {
                setActiveTab('volunteers');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50"
            >
              Volunteers
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              About & Helplines
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

