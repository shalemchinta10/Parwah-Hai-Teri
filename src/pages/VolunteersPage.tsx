import React, { useState } from 'react';
import { UserCheck, HeartHandshake, ShieldAlert, Plus } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { VolunteerCard, ApplyVolunteerModal } from '../components/VolunteerCard';

export const VolunteersPage: React.FC = () => {
  const { volunteers } = useCommunity();
  const { ensureAuth } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleJoinVolunteer = () => {
    if (!ensureAuth('applying as a volunteer helper')) return;
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Be Someone's Support</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Community volunteers helping citizens with language translation, digital assistance, and community guidance.
          </p>
        </div>

        <button
          onClick={handleJoinVolunteer}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Join as Volunteer</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-sm text-amber-900">Volunteer Safety Rules:</span>
          Volunteers assist solely with guidance, form navigation, and language translation. Volunteers must NEVER physically confront alleged offenders, request sensitive passwords, or enter dangerous situations.
        </div>
      </div>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map((vol) => (
          <VolunteerCard key={vol.id} volunteer={vol} />
        ))}
      </div>

      {/* Application Modal */}
      <ApplyVolunteerModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
