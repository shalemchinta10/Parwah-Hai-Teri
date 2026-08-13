import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  MessageSquare,
  ThumbsUp,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bookmark,
  User,
} from 'lucide-react';
import { Post } from '../types';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';

interface CompactReportCardProps {
  post: Post;
}

export const CompactReportCard: React.FC<CompactReportCardProps> = ({ post }) => {
  const { toggleReaction, toggleSavePost, savedPostIds, addComment } = useCommunity();
  const { currentUser, ensureAuth } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = savedPostIds.includes(post.id);

  const handleConfirmClick = () => {
    if (!ensureAuth('confirming reports')) return;
    toggleReaction(post.id, 'same_issue');
  };

  const handleHelpClick = () => {
    if (!ensureAuth('offering volunteer assistance')) return;
    toggleReaction(post.id, 'can_help');
  };

  const handleSaveClick = () => {
    if (!ensureAuth('saving post to vault')) return;
    toggleSavePost(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuth('posting comments')) return;
    if (commentText.trim()) {
      addComment(post.id, commentText.trim(), true);
      setCommentText('');
    }
  };

  // Confirmations calculation
  const sameIssueCount = post.reactions?.['same_issue'] || 0;
  const verifiedCount = post.reactions?.['verified'] || 0;
  const importantCount = post.reactions?.['important'] || 0;
  const totalConfirmations = sameIssueCount + verifiedCount + importantCount;
  const canHelpCount = post.reactions?.['can_help'] || 0;

  const isUserConfirmed = post.userReactions?.[currentUser?.id || ''] === 'same_issue';

  // Category Badge Colors & Labels
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'scam':
        return { label: 'Scam & Fraud', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'banking':
        return { label: 'Banking & Financial', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'harassment':
        return { label: 'Safety & Harassment', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'road':
        return { label: 'Civic & Road Hazard', bg: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'consumer':
        return { label: 'Consumer Rights', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'jobs':
        return { label: 'Employment Scam', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Citizen Update', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const catInfo = getCategoryInfo(post.category);

  // Formatting date
  const timeFormatted = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 space-y-3">
      {/* 1. COMPACT TOP METADATA ROW */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Pill */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${catInfo.bg}`}>
            {catInfo.label}
          </span>

          {/* Location Badge */}
          <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100/80 px-2.5 py-0.5 rounded-full text-[11px] border border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {post.location?.area ? `${post.location.area}, ` : ''}
              {post.location?.city || 'India'}
            </span>
          </span>

          {/* Time Badge */}
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timeFormatted}</span>
          </span>
        </div>

        {/* Severity / Risk Status */}
        {post.isResolved ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolved</span>
          </span>
        ) : post.riskLevel === 'high' || post.riskLevel === 'critical' ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            <span>Verified Warning</span>
          </span>
        ) : null}
      </div>

      {/* 2. TITLE & EXCERPT */}
      <div className="space-y-1">
        <h3
          className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {post.title}
        </h3>
        <p className={`text-xs text-slate-600 leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-2'}`}>
          {post.content}
        </p>

        {post.content.length > 120 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 pt-0.5 cursor-pointer"
          >
            <span>{isExpanded ? 'Show less' : 'Read full report'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* AI Guidance snippet if present */}
      {post.aiAnalysisSummary && (
        <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100/90 text-xs text-indigo-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px]">
            <span className="font-extrabold text-indigo-900 block">Parwah AI Guidance:</span>
            <span className="text-indigo-800 font-medium leading-relaxed">{post.aiAnalysisSummary}</span>
          </div>
        </div>
      )}

      {/* 3. CONFIRMATIONS & METADATA BAR */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs text-slate-500 font-bold">
          {/* Author info */}
          <span className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
            <User className="w-3 h-3 text-slate-400" />
            <span>{post.isAnonymous ? 'Anonymous Citizen' : `@${post.authorUsername}`}</span>
          </span>

          <span className="text-slate-300">•</span>

          {/* Confirmations pill */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg ${
              totalConfirmations > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{totalConfirmations} Confirmations</span>
          </span>

          {canHelpCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{canHelpCount} Helping</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.commentsCount} comments</span>
          </span>
        </div>

        {/* 4. COMPACT ACTION FOOTER */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Confirm / Same Here Button */}
          <button
            onClick={handleConfirmClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              isUserConfirmed
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 hover:border-amber-300 border border-slate-200'
            }`}
            title="Confirm if you experienced this issue too"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{isUserConfirmed ? 'Confirmed' : 'Confirm'}</span>
          </button>

          {/* I Can Help Button */}
          <button
            onClick={handleHelpClick}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 transition-all cursor-pointer hidden sm:flex items-center gap-1"
            title="Offer assistance or advice"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Help</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative cursor-pointer"
            title="Share report"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink && (
              <span className="absolute -top-7 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-fadeIn">
                Copied!
              </span>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isSaved ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            title="Save to Evidence Vault"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Comments & Discussion Box */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your experience or advice..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
            >
              Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
