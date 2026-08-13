import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Info,
  Phone,
  Link,
  QrCode,
  FileText,
  Building,
  Loader2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { ScamCampaign, ScamIdentifier } from '../types';

export const ScamCheckWidget: React.FC = () => {
  const { checkScamIdentifier, scamCampaigns } = useCommunity();

  const [queryInput, setQueryInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    scamMatch?: ScamIdentifier;
    campaignMatch?: ScamCampaign;
    aiResult?: any;
    queryChecked?: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setIsChecking(true);
    setCheckResult(null);

    const res = await checkScamIdentifier(queryInput.trim());

    setIsChecking(false);
    setCheckResult({
      ...res,
      queryChecked: queryInput.trim(),
    });
  };

  const sampleQuickSearches = [
    { label: '+91 98210 44321 (Electricity Discom)', query: '+91 98210 44321' },
    { label: 'instantpayout.tech@ybl (Job Scam UPI)', query: 'instantpayout.tech@ybl' },
    { label: 'sbi-kyc-update-portal-92.online', query: 'sbi-kyc-update-portal-92.online' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Parwah Scam Intelligence Check</span>
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Citizen Protection
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Check phone numbers, UPI IDs, bank links, websites, or suspicious text before transferring money.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCheck} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter Phone Number, UPI ID (e.g. name@ybl), Website URL, or Email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-28 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={isChecking || !queryInput.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-xs"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Check</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-medium">
          <span className="text-[11px] font-bold text-slate-400">Quick Check:</span>
          {sampleQuickSearches.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQueryInput(s.query);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors text-[11px] font-semibold"
            >
              {s.label}
            </button>
          ))}
        </div>
      </form>

      {/* Check Result Display */}
      {checkResult && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Checked Identifier:</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                {checkResult.queryChecked}
              </span>
            </div>

            <span
              className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${
                checkResult.scamMatch?.riskLevel === 'critical' || checkResult.aiResult?.riskLevel === 'high'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              Risk: {checkResult.scamMatch?.riskLevel || checkResult.aiResult?.riskLevel || 'Suspicious'}
            </span>
          </div>

          {/* Direct Community Database Hit Notice */}
          {checkResult.scamMatch ? (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-red-800">
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>Community Report Match Found ({checkResult.scamMatch.reportsCount} Reports)</span>
              </div>
              <p className="text-slate-700 font-medium">{checkResult.scamMatch.aiExplanation}</p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>AI Risk Assessment & Indicators</span>
              </div>
              <p className="text-slate-700 font-medium">
                {checkResult.aiResult?.aiExplanation ||
                  'Potentially suspicious identifier based on community heuristic patterns.'}
              </p>
            </div>
          )}

          {/* Linked Scam Campaign (Grouping related reports) */}
          {checkResult.campaignMatch && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-indigo-900 font-extrabold">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Linked Scam Campaign: {checkResult.campaignMatch.title}</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {checkResult.campaignMatch.totalAffected}+ Citizens Reported
                </span>
              </div>
              <p className="text-slate-700 font-medium">{checkResult.campaignMatch.patternSummary}</p>
              <p className="text-emerald-800 font-bold">
                Official Advice: {checkResult.campaignMatch.officialAdvice}
              </p>
            </div>
          )}

          {/* Recommended Precautions */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Recommended Precautions:
            </h4>
            <ul className="space-y-1 text-xs text-slate-700 font-medium list-disc list-inside">
              {(
                checkResult.scamMatch?.recommendedPrecautions ||
                checkResult.aiResult?.recommendedPrecautions || [
                  'Never share OTP or NetBanking password with anyone.',
                  'Verify through official bank / discom customer care before making payments.',
                ]
              ).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Risk levels are derived from AI analysis and citizen community reports. This is not an official legal determination. To report formal cyber fraud, dial <strong>1930</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
