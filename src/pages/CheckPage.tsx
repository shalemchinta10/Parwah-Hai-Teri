import React from 'react';
import { ShieldCheck, Layers, Phone, Link, QrCode, Building, AlertTriangle } from 'lucide-react';
import { ScamCheckWidget } from '../components/ScamCheckWidget';
import { useCommunity } from '../context/CommunityContext';

export const CheckPage: React.FC = () => {
  const { scamIdentifiers, scamCampaigns } = useCommunity();

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Check Before You Trust</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Verify Phone Numbers, UPI IDs, Bank Accounts, or Links before transferring money or sharing details.
        </p>
      </div>

      {/* Main Check Tool */}
      <ScamCheckWidget />

      {/* Known Scam Campaigns in India */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">Known Scam Campaigns in India</h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            DEMO DATA
          </span>
        </div>

        <div className="space-y-3">
          {scamCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">{camp.title}</h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    DEMO DATA
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {camp.totalAffected} Reports (Demo)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium">{camp.description}</p>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-indigo-900 font-medium space-y-1">
                <div>
                  <strong className="font-extrabold text-indigo-700">Pattern:</strong> {camp.patternSummary}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span><strong>SOURCE:</strong> Community Heuristic Advisory</span>
                  <span><strong>LAST UPDATED:</strong> {camp.firstSeenDate}</span>
                  <span><strong>STATUS:</strong> {camp.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-xs text-emerald-800 font-bold">
                <strong>Official Advice:</strong> {camp.officialAdvice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Identifiers Database */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-extrabold text-slate-900">Community Flagged Identifiers</h2>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scamIdentifiers.map((scam) => (
            <div
              key={scam.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono font-bold text-xs text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  {scam.value}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {scam.reportsCount} Reports (Demo)
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-2">{scam.aiExplanation}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                <span>SOURCE: Community Reports</span>
                <span>LAST UPDATED: {scam.lastActiveAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
