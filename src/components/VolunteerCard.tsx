import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Languages, MapPin, BadgeCheck, HeartHandshake, Plus, X } from 'lucide-react';
import { VolunteerProfile } from '../types';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';

interface VolunteerCardProps {
  volunteer: VolunteerProfile;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-base">
              {volunteer.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900">{volunteer.fullName}</span>
                {volunteer.status === 'verified' && (
                  <BadgeCheck className="w-4 h-4 text-emerald-600" title="Verified Volunteer" />
                )}
              </div>
              <span className="text-xs text-indigo-600 font-bold">{volunteer.username}</span>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Verified Helper
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed font-medium">
          {volunteer.aboutMe}
        </p>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            <span>{volunteer.languages.join(', ')}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>
              {volunteer.locationCity}, {volunteer.locationState}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {volunteer.categories.map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 capitalize"
            >
              {cat.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ApplyVolunteerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addVolunteerApplication } = useCommunity();
  const { currentUser, ensureAuth } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['community_support']);
  const [languagesText, setLanguagesText] = useState('English, Hindi');
  const [aboutMe, setAboutMe] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuth('submitting volunteer application')) return;
    addVolunteerApplication({
      fullName,
      email,
      locationCity: city || 'Mumbai',
      locationState: state || 'Maharashtra',
      categories: selectedCategories as any,
      languages: languagesText.split(',').map((l) => l.trim()),
      aboutMe,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-800">Join as Parwah Volunteer</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <BadgeCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Application Submitted!</h4>
            <p className="text-xs text-slate-500">
              Our moderation team will review your application. Thank you for making India safer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Safety Warning */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-extrabold block">Safety Guideline:</span>
              Volunteers provide digital navigation, language support, and information. Volunteers must NEVER physically confront offenders or enter dangerous situations.
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">City:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">State:</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Languages Spoken:</label>
              <input
                type="text"
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder="e.g. English, Hindi, Marathi, Tamil"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">How can you help?</label>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { id: 'language', label: 'Language Helper' },
                  { id: 'digital_help', label: 'Digital Assistance' },
                  { id: 'community_support', label: 'Community Support' },
                  { id: 'legal_navigation', label: 'Legal/Form Navigation' },
                  { id: 'accessibility', label: 'Accessibility Helper' },
                  { id: 'ngo_rep', label: 'NGO Representative' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-colors ${
                      selectedCategories.includes(c.id)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">About Your Motivation / Experience:</label>
              <textarea
                rows={2}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="Describe briefly how you can assist fellow citizens..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
