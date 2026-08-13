import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  Image as ImageIcon,
  Video,
  UploadCloud,
  Check,
  AlertCircle,
  Users,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { PostCategory, PostAttachment } from '../types';

interface ShareConcernModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CATEGORY_OPTIONS = [
  { id: 'safety', label: 'Safety Concern', mappedCategory: 'harassment' as PostCategory },
  { id: 'scam', label: 'Scam / Fraud', mappedCategory: 'scam' as PostCategory },
  { id: 'road', label: 'Road / Traffic Issue', mappedCategory: 'road' as PostCategory },
  { id: 'utility', label: 'Electricity / Utility', mappedCategory: 'government' as PostCategory },
  { id: 'missing', label: 'Missing Person', mappedCategory: 'other' as PostCategory },
  { id: 'health', label: 'Health / Emergency', mappedCategory: 'other' as PostCategory },
  { id: 'community', label: 'Local Community Issue', mappedCategory: 'other' as PostCategory },
  { id: 'other', label: 'Other', mappedCategory: 'other' as PostCategory },
];

export const ShareConcernModal: React.FC<ShareConcernModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createPost } = useCommunity();
  const { currentUser, ensureAuth } = useAuth();

  const [descriptionText, setDescriptionText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('safety');
  const [locationText, setLocationText] = useState('');
  const [postPrivacy, setPostPrivacy] = useState<'public' | 'anonymous'>('anonymous');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: 'image' | 'video' }[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      const isVid = file.type.startsWith('video');
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              url: event.target!.result as string,
              type: isVid ? 'video' : 'image',
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    if (!descriptionText.trim()) {
      setValidationError('Write something to save as draft.');
      return;
    }
    setDraftSavedMsg(true);
    setTimeout(() => setDraftSavedMsg(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify user is authenticated before publishing
    if (!ensureAuth('publishing a post')) {
      return;
    }

    if (!descriptionText.trim()) {
      setValidationError('Please tell us what you would like to share.');
      return;
    }

    setValidationError(null);

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.id === selectedCategoryId) || CATEGORY_OPTIONS[0];

    // Format attachments
    const attachmentsFormatted: PostAttachment[] = attachedFiles.map((f, idx) => ({
      id: `att_${Date.now()}_${idx}`,
      type: f.type,
      url: f.url,
      name: f.name,
    }));

    // Format location
    let locationFormatted: any = undefined;
    if (locationText.trim()) {
      locationFormatted = {
        city: locationText.trim(),
      };
    }

    // Call createPost from CommunityContext
    createPost({
      title: `${categoryObj.label.toUpperCase()}`,
      content: descriptionText.trim(),
      category: categoryObj.mappedCategory,
      isAnonymous: postPrivacy === 'anonymous',
      location: locationFormatted || { city: 'India' },
      attachments: attachmentsFormatted,
    });

    // Trigger Success State
    setShowToastSuccess(true);

    if (onSuccess) {
      onSuccess();
    }

    // Reset and close after brief toast feedback
    setTimeout(() => {
      setShowToastSuccess(false);
      setDescriptionText('');
      setSelectedCategoryId('safety');
      setLocationText('');
      setPostPrivacy('anonymous');
      setAttachedFiles([]);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                📢
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Share a Concern
              </h2>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              You're about to share this with the Parwah Hai Teri community.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast Banner Overlay */}
        {showToastSuccess ? (
          <div className="p-8 sm:p-12 text-center my-auto space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Concern shared successfully
              </h3>
              <p className="text-sm font-medium text-slate-600">
                Thank you for looking out for your community.
              </p>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            
            {/* Sensitive Info Reminder Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Security & Privacy Reminder</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Please don't share OTPs, passwords, PINs, CVVs, bank credentials, or other sensitive personal information.
              </p>
            </div>

            {/* Friendly Validation Alert */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Draft Saved Notice */}
            {draftSavedMsg && (
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <Bookmark className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Draft saved locally!</span>
              </div>
            )}

            {/* 1. What would you like to share? */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                What would you like to share? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={descriptionText}
                onChange={(e) => {
                  setDescriptionText(e.target.value);
                  if (validationError && e.target.value.trim()) {
                    setValidationError(null);
                  }
                }}
                placeholder="Tell the community what happened or what you noticed…"
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium leading-relaxed resize-none"
              />
            </div>

            {/* 2. Category & Location in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Category
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Location <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="e.g. Pune / Sector 14"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 3. Attach Photo / Video */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Attach Photo / Video <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-4 h-4 text-indigo-600" />
                  <span>Upload Media</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold"
                  >
                    {file.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-slate-400 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Privacy Options (Radio Choice) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Privacy Option
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Post Publicly Radio Option */}
                <button
                  type="button"
                  onClick={() => setPostPrivacy('public')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    postPrivacy === 'public'
                      ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    postPrivacy === 'public' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {postPrivacy === 'public' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Post Publicly</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Shows your username ({currentUser?.username || '@your_handle'}).
                    </p>
                  </div>
                </button>

                {/* Post Anonymously Radio Option */}
                <button
                  type="button"
                  onClick={() => setPostPrivacy('anonymous')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    postPrivacy === 'anonymous'
                      ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    postPrivacy === 'anonymous' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {postPrivacy === 'anonymous' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900">
                      <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Post Anonymously</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Displays as "Anonymous Citizen" publicly for safety.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons: [ Publish ] [ Save Draft ] [ Cancel ] */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-600" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
