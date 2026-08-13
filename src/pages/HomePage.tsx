import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Users,
  ChevronRight,
  TrendingUp,
  MapPin,
  PhoneCall,
  Search,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Lock,
  HeartHandshake,
  AlertTriangle,
  FileText,
  Radio,
  Filter,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PostCard } from '../components/PostCard';
import { CompactReportCard } from '../components/CompactReportCard';
import { BrandLogo } from '../components/BrandLogo';

interface HomePageProps {
  onOpenWhatHappened: () => void;
  onOpenShareConcern?: () => void;
  onOpenParwahAI?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenWhatHappened,
  onOpenShareConcern,
  onOpenParwahAI,
}) => {
  const {
    posts,
    setActiveTab,
    scamCampaigns,
    currentHelpQuery,
    setCurrentHelpQuery,
    launchHelpEngine,
  } = useCommunity();
  const { ensureAuth } = useAuth();
  const { t } = useLanguage();

  const handleShareConcernClick = () => {
    if (!ensureAuth('sharing a community concern')) return;
    if (onOpenShareConcern) {
      onOpenShareConcern();
    } else {
      launchHelpEngine();
    }
  };

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const CITIES = ['All', 'Pune', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'];

  const CATEGORY_FILTERS = [
    { id: 'all', label: 'All Updates' },
    { id: 'scam', label: 'Scams & Fraud' },
    { id: 'road', label: 'Civic Hazards' },
    { id: 'banking', label: 'Banking & UPI' },
    { id: 'harassment', label: 'Safety & Harassment' },
    { id: 'jobs', label: 'Job Scams' },
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesCity =
      selectedCity === 'All' ||
      p.location?.city?.toLowerCase() === selectedCity.toLowerCase() ||
      p.location?.state?.toLowerCase() === selectedCity.toLowerCase();

    const matchesCat =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesCity && matchesCat;
  });

  // Home Quick Example Chips
  const QUICK_PROMPTS = [
    'My bank debited money without OTP',
    'Loan app threatening my contacts',
    'I don\'t understand this government notice',
    'Landlord refusing deposit return',
    'Online harassment or fake profile',
    'Dangerous pothole / road hazard',
    'I don\'t know what to do',
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* 1. HERO SECTION: SINGLE MAIN GET HELP EXPERIENCE */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-slate-800/80">
        {/* Soft Serene Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-teal-300 text-xs font-bold tracking-wider uppercase w-fit">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>You're not alone</span>
          </div>

          <BrandLogo variant="hero" lightText={true} showTagline={true} />
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl pt-1">
            You don't need to know which department, form, or law applies. Tell Parwah Hai Teri what's happening and we'll help you find the right next step.
          </p>

          {/* Central GET HELP Experience: Single Input + Arrow */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              launchHelpEngine(currentHelpQuery);
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-3"
          >
            <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 text-slate-900 shadow-inner">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={currentHelpQuery}
                onChange={(e) => setCurrentHelpQuery(e.target.value)}
                placeholder="Describe what's happening... (e.g. My bank debited money without my permission)"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg shadow-md shrink-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                title="Send request"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Interactive Tappable Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mr-1">
                Frequent Issues:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => launchHelpEngine(prompt)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all text-left cursor-pointer hover:border-white/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </form>

          {/* Single Secondary Action */}
          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('check')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CHECK SOMETHING</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE FRAUD & SAFETY ALERTS NEAR YOU */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Active India Alerts</h2>
              <p className="text-[11px] text-slate-500 font-medium">Real citizen reports & verified fraud patterns</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('check')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
          >
            <span>Check Risk Database</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            onClick={() => setActiveTab('check')}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span>🚨 Discom Bill Cutoff Scam</span>
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              29 reports • Fake APK links threatening power cutoff at 9:30 PM unless paid via UPI.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('feed')}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span>🚧 Dangerous Road Hazard</span>
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                CIVIC
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              18 reports • Potholes & broken streetlights reported near Highway bypass.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('check')}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span>💼 Fake Telegram Job Offer</span>
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              14 reports • Part-time job task scams demanding initial security deposit.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('check')}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span>📱 Illegal Loan App Threat</span>
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                HARASSMENT
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              11 reports • Illegal Instant Loan Apps morphing contact lists.
            </p>
          </div>
        </div>
      </div>

      {/* 3. WHAT'S HAPPENING AROUND YOU: CLEAN CONSUMER FEED */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  What's happening around you
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time consumer feed of verified local warnings, scam reports, and citizen confirmations
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
            <button
              onClick={handleShareConcernClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>＋ Share a Concern</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Full Feed</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Location & Category Quick Filter Toolbar */}
        <div className="space-y-3">
          {/* Cities Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Location:</span>
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedCity === city
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Topic:</span>
            </span>
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Notice */}
        {(selectedCity !== 'All' || selectedCategory !== 'all') && (
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 font-bold flex items-center justify-between">
            <span>
              Showing reports {selectedCity !== 'All' ? `near 📍 ${selectedCity}` : ''}{' '}
              {selectedCategory !== 'all' ? `in topic ${CATEGORY_FILTERS.find((c) => c.id === selectedCategory)?.label}` : ''}
            </span>
            <button
              onClick={() => {
                setSelectedCity('All');
                setSelectedCategory('all');
              }}
              className="text-[11px] text-indigo-600 hover:underline font-extrabold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Feed List of Compact Consumer Cards */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-3 pt-1">
            {filteredPosts.slice(0, 6).map((post) => (
              <CompactReportCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-2">
            <p className="text-sm font-bold text-slate-800">No community reports found matching your criteria.</p>
            <p className="text-xs text-slate-500">Be the first to share an update or warning near {selectedCity}!</p>
            <button
              onClick={handleShareConcernClick}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-extrabold cursor-pointer"
            >
              ＋ Share a Concern
            </button>
          </div>
        )}

        {/* Footer Jump to Full Feed */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveTab('feed')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-slate-200/80 hover:border-indigo-200 transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>View All {posts.length} Community Updates & Experience Reports</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. OFFICIAL EMERGENCY HELPLINES */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-100/90 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-slate-600" />
            <span>Official Emergency Helplines (India)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold">24x7 Government Support</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <a
            href="tel:1930"
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-red-300 hover:bg-red-50/50 transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div>
              <span className="block font-black text-slate-900 group-hover:text-red-700">1930</span>
              <span className="text-[10px] text-slate-500 font-medium">Cybercrime Fraud</span>
            </div>
            <PhoneCall className="w-4 h-4 text-red-500" />
          </a>

          <a
            href="tel:112"
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div>
              <span className="block font-black text-slate-900 group-hover:text-indigo-700">112</span>
              <span className="text-[10px] text-slate-500 font-medium">National Emergency</span>
            </div>
            <PhoneCall className="w-4 h-4 text-indigo-500" />
          </a>

          <a
            href="tel:181"
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/50 transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div>
              <span className="block font-black text-slate-900 group-hover:text-purple-700">181</span>
              <span className="text-[10px] text-slate-500 font-medium">Women Helpline</span>
            </div>
            <PhoneCall className="w-4 h-4 text-purple-500" />
          </a>

          <a
            href="tel:1915"
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex items-center justify-between group shadow-2xs"
          >
            <div>
              <span className="block font-black text-slate-900 group-hover:text-emerald-700">1915</span>
              <span className="text-[10px] text-slate-500 font-medium">Consumer Helpline</span>
            </div>
            <PhoneCall className="w-4 h-4 text-emerald-500" />
          </a>
        </div>
      </div>
    </div>
  );
};
