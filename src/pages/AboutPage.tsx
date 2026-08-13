import React from 'react';
import { HelpCircle, Shield, PhoneCall, ExternalLink, Heart, Globe, Sparkles, AlertTriangle } from 'lucide-react';
import { NATIONAL_HELPLINES } from '../data/mockData';
import { BrandLogo } from '../components/BrandLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <BrandLogo variant="hero" showTagline={true} />
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl pt-2">
          Parwah Hai Teri is a citizen-first community platform designed to bridge language barriers, help citizens find guidance, check suspicious offers, share experiences, and connect with volunteers and official resources.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">AI Guidance & Triaging</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Instant categorization and actionable next steps tailored for cybercrime, financial fraud, or local hazards.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Multilingual & Accessible</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Speak or type in Hindi, Tamil, Telugu, Marathi, Kannada, Bengali, and other major Indian languages.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Strict Privacy & Confidentiality</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Default anonymity options and private vault options ensure victims can document incidents safely.
          </p>
        </div>
      </div>

      {/* National Helplines Directory */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <PhoneCall className="w-5 h-5 text-red-600" />
          <h2 className="text-base font-extrabold text-slate-900">Official Emergency Helplines in India</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NATIONAL_HELPLINES.map((h, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {h.category}
                  </span>
                  {h.is24x7 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      24x7 Active
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mt-2">{h.name}</h4>
                <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">{h.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`tel:${h.number}`}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial {h.number}</span>
                </a>

                {h.website && (
                  <a
                    href={h.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-sm">Important Platform Disclaimer:</span>
          Parwah Hai Teri does not replace emergency services, police, lawyers, doctors, banks, government authorities or other professional services. For immediate physical emergencies, dial <strong>112</strong>. For financial cyber fraud, call <strong>1930</strong> immediately.
        </div>
      </div>
    </div>
  );
};
