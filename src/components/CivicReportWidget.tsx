import React, { useState } from 'react';
import { MapPin, AlertTriangle, ThumbsUp, Camera, CheckCircle2, Plus } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { CivicReport } from '../types';

export const CivicReportWidget: React.FC = () => {
  const { civicReports, createCivicReport, upvoteCivicReport } = useCommunity();
  const { ensureAuth } = useAuth();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState<CivicReport['issueType']>('pothole');
  const [city, setCity] = useState('Bengaluru');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');

  const handleToggleForm = () => {
    if (!isOpenForm && !ensureAuth('reporting a civic hazard')) return;
    setIsOpenForm(!isOpenForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuth('submitting a civic report')) return;
    if (title.trim()) {
      createCivicReport({
        title,
        issueType,
        location: { city, state: 'Karnataka', area },
        description,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      });
      setTitle('');
      setDescription('');
      setIsOpenForm(false);
    }
  };

  const handleUpvote = (id: string) => {
    if (!ensureAuth('upvoting civic reports')) return;
    upvoteCivicReport(id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Road & Local Civic Issues</h3>
            <p className="text-xs text-slate-500 font-medium">Report potholes, dangerous roads, broken lights, or waterlogging.</p>
          </div>
        </div>

        <button
          onClick={handleToggleForm}
          className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report Hazard</span>
        </button>
      </div>

      {/* Form */}
      {isOpenForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fadeIn">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Hazard Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Pothole on Flyover Descent"
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Issue Type:</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
              >
                <option value="pothole">Pothole</option>
                <option value="waterlogging">Waterlogging</option>
                <option value="accident">Accident Prone Zone</option>
                <option value="broken_light">Broken Streetlight</option>
                <option value="dangerous_road">Dangerous Road Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">City & Area:</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area (e.g. Silk Board)"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact location landmark or damage..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-xs"
          >
            Submit Civic Hazard Report
          </button>
        </form>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {civicReports.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-slate-900">{report.title}</span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    report.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {report.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium line-clamp-2">{report.description}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-2">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>
                  {report.location.area ? `${report.location.area}, ` : ''}
                  {report.location.city}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-medium">Reported: {report.createdAt}</span>
              <button
                onClick={() => handleUpvote(report.id)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 border border-slate-200 shadow-xs cursor-pointer"
              >
                <ThumbsUp className="w-3 h-3 text-cyan-600" />
                <span>Upvote ({report.upvotes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
