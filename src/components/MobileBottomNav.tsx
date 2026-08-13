import React from 'react';
import { Home, ShieldCheck, Users, Bell } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { BrandSymbolIcon } from './BrandLogo';

interface MobileBottomNavProps {
  onOpenWhatHappened: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenWhatHappened }) => {
  const { activeTab, setActiveTab, notifications } = useCommunity();
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-40 px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'home' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('check')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'check' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Check</span>
        </button>

        {/* Central Prominent Floating Action Button */}
        <button
          onClick={onOpenWhatHappened}
          className="-mt-6 w-13 h-13 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 animate-gentle-pulse border-2 border-indigo-400 p-2 cursor-pointer"
          title="Get Help - Parwah Hai Teri"
        >
          <BrandSymbolIcon size="sm" isDarkBg={true} />
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'feed' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Community</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'notifications' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Alerts</span>
          {unreadNotifs > 0 && (
            <span className="absolute top-0.5 right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadNotifs}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

