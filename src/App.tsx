import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CommunityProvider, useCommunity } from './context/CommunityContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WhatHappenedModal } from './components/WhatHappenedModal';
import { ShareConcernModal } from './components/ShareConcernModal';
import { ParwahAIModal } from './components/ParwahAIModal';
import { AuthModal } from './components/AuthModal';
import { BrandLogo } from './components/BrandLogo';

import { HomePage } from './pages/HomePage';
import { CheckPage } from './pages/CheckPage';
import { CommunityPage } from './pages/CommunityPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

import {
  ShieldCheck,
  Award,
  HeartHandshake,
  TrendingUp,
  PhoneCall,
  Search,
  ChevronRight,
  ExternalLink,
  Lock,
  PlusCircle,
} from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    posts,
    scamCampaigns,
    isWhatHappenedOpen,
    setIsWhatHappenedOpen,
    launchHelpEngine,
  } = useCommunity();
  const { currentUser, setShowAuthModal } = useAuth();
  const { t } = useLanguage();

  const [isShareConcernOpen, setIsShareConcernOpen] = useState(false);
  const [isParwahAIOpen, setIsParwahAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        onOpenWhatHappened={() => launchHelpEngine()}
        onSearchSubmit={() => {}}
      />

      {/* Emergency Helplines Banner */}
      <EmergencyBanner />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar (Desktop 3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-20">
            {/* Citizen Score & Status */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Citizen Safety Score
                  </h3>
                  <p className="text-sm font-extrabold text-slate-900">Guardian Level 2</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Community Reports:</span>
                <span className="font-extrabold text-slate-900">4 Verified</span>
              </div>

              <button
                onClick={() => setActiveTab('profile')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
              >
                View Vault & Profile
              </button>
            </div>

            {/* Volunteer CTA */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Volunteers Needed</span>
              </div>
              <h3 className="text-sm font-extrabold text-white leading-snug">
                Can you translate languages or help senior citizens report scams?
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Join Parwah Hai Teri's volunteer network to assist fellow citizens safely.
              </p>
              <button
                onClick={() => setActiveTab('volunteers')}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-colors"
              >
                Become a Volunteer
              </button>
            </div>

            {/* Quick Emergency Helplines */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Quick Helpline Dial
              </h3>

              <div className="space-y-2 text-xs">
                <a
                  href="tel:1930"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-900 font-bold transition-colors"
                >
                  <div>
                    <span className="block font-black">1930</span>
                    <span className="text-[10px] text-red-700 font-medium">Cyber Fraud Helpline</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-red-600" />
                </a>

                <a
                  href="tel:112"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold transition-colors"
                >
                  <div>
                    <span className="block font-black">112</span>
                    <span className="text-[10px] text-slate-500 font-medium">National Emergency</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                </a>

                <a
                  href="tel:181"
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold transition-colors"
                >
                  <div>
                    <span className="block font-black">181</span>
                    <span className="text-[10px] text-slate-500 font-medium">Women Helpline</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                </a>
              </div>
            </div>
          </aside>

          {/* Central Active View (6 Cols on Desktop or Full width) */}
          <section className="col-span-1 lg:col-span-6 space-y-6">
            {activeTab === 'home' && (
              <HomePage
                onOpenWhatHappened={() => setIsWhatHappenedOpen(true)}
                onOpenShareConcern={() => setIsShareConcernOpen(true)}
                onOpenParwahAI={() => setIsParwahAIOpen(true)}
              />
            )}
            {activeTab === 'check' && <CheckPage />}
            {activeTab === 'feed' && (
              <CommunityPage
                onOpenWhatHappened={() => setIsWhatHappenedOpen(true)}
                onOpenShareConcern={() => setIsShareConcernOpen(true)}
              />
            )}
            {activeTab === 'volunteers' && <VolunteersPage />}
            {activeTab === 'notifications' && <NotificationsPage />}
            {activeTab === 'profile' && <ProfilePage />}
            {activeTab === 'about' && <AboutPage />}
          </section>

          {/* Right Sidebar (Desktop 3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-20">
            {/* Intelligence Check Quick CTA */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Risk Check</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Check any phone number, UPI handle, or website link before transferring money.
              </p>
              <button
                onClick={() => setActiveTab('check')}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Open Risk Checker</span>
              </button>
            </div>

            {/* Active Fraud Alerts in India */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                  <span>Active India Alerts</span>
                </h3>
                <button
                  onClick={() => setActiveTab('check')}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  All
                </button>
              </div>

              <div className="space-y-2">
                {scamCampaigns.slice(0, 2).map((camp) => (
                  <div
                    key={camp.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-extrabold text-slate-900">
                      <span className="truncate max-w-[160px]">{camp.title}</span>
                      <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                        {camp.totalAffected}+
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2">{camp.patternSummary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidentiality Commitment */}
            <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-slate-600 text-xs space-y-1.5 font-medium">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Parwah Privacy First</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Your phone number and private records are never published publicly without your explicit consent.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <BrandLogo
              variant="footer"
              onClick={() => setActiveTab('home')}
              showTagline={true}
            />
            <p className="text-[11px] font-medium text-slate-500 sm:border-l border-slate-200 sm:pl-6 text-center sm:text-left">
              © 2026 Parwah Hai Teri. All Rights Reserved by Shalem Chinta.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-bold">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-900">
              About & Helplines
            </button>
            <button onClick={() => setActiveTab('volunteers')} className="hover:text-slate-900">
              Volunteers
            </button>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 flex items-center gap-1">
              <span>Cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Bottom Nav */}
      <WhatHappenedModal
        isOpen={isWhatHappenedOpen}
        onClose={() => setIsWhatHappenedOpen(false)}
      />

      <ShareConcernModal
        isOpen={isShareConcernOpen}
        onClose={() => setIsShareConcernOpen(false)}
      />

      <ParwahAIModal
        isOpen={isParwahAIOpen}
        onClose={() => setIsParwahAIOpen(false)}
        onOpenWhatHappened={() => setIsWhatHappenedOpen(true)}
      />

      <AuthModal />

      <MobileBottomNav onOpenWhatHappened={() => setIsWhatHappenedOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <CommunityProvider>
            <MainAppLayout />
          </CommunityProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
