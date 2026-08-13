import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, Shield, ChevronRight, X, ExternalLink } from 'lucide-react';
import { NATIONAL_HELPLINES } from '../data/mockData';

export const EmergencyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-red-50 border-b border-red-100 text-red-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Left Warning Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>EMERGENCY HELPLINES</span>
            </span>
            <span className="text-xs font-semibold text-red-800 hidden md:inline">
              Financial Fraud? Call Cybercrime <strong className="font-black text-red-900">1930</strong> immediately within 2 hours.
            </span>
          </div>

          {/* Quick Dial Helplines */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <a
              href="tel:1930"
              className="bg-white hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-colors shadow-xs shrink-0"
            >
              <PhoneCall className="w-3 h-3 text-red-600" />
              <span>1930 (Cyber Fraud)</span>
            </a>

            <a
              href="tel:112"
              className="bg-white hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-colors shadow-xs shrink-0"
            >
              <PhoneCall className="w-3 h-3 text-red-600" />
              <span>112 (Emergency)</span>
            </a>

            <a
              href="tel:181"
              className="bg-white hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-colors shadow-xs shrink-0"
            >
              <PhoneCall className="w-3 h-3 text-red-600" />
              <span>181 (Women)</span>
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-red-700 hover:text-red-900 underline underline-offset-2 flex items-center gap-0.5 ml-1 shrink-0"
            >
              <span>{isExpanded ? 'Hide All' : 'All Helplines'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-red-400 hover:text-red-700 p-1 rounded-full"
            title="Dismiss Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Helpline Cards */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-red-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn pb-2">
            {NATIONAL_HELPLINES.map((h, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 border border-red-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                      {h.category}
                    </span>
                    {h.is24x7 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        24x7 Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5">{h.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{h.description}</p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${h.number}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {h.number}</span>
                  </a>

                  {h.website && (
                    <a
                      href={h.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
