import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Share2,
  Bookmark,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Check,
  User,
  MoreVertical,
  Flag,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  UserCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Post, ReactionType } from '../types';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleReaction, addComment, toggleSavePost, savedPostIds, reportPost } = useCommunity();
  const { currentUser, ensureAuth } = useAuth();
  const { t } = useLanguage();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isAnonComment, setIsAnonComment] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = savedPostIds.includes(post.id);

  const handleReactionClick = (type: ReactionType) => {
    if (!ensureAuth('reacting to posts')) return;
    toggleReaction(post.id, type);
  };

  const handleSaveClick = () => {
    if (!ensureAuth('saving posts to vault')) return;
    toggleSavePost(post.id);
  };

  const handleReportClick = () => {
    if (!ensureAuth('reporting content')) return;
    reportPost(post.id, 'Inappropriate content');
    setIsReported(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureAuth('posting comments or replies')) return;
    if (commentText.trim()) {
      addComment(post.id, commentText.trim(), isAnonComment);
      setCommentText('');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = () => {
    reportPost(post.id, 'Inappropriate content');
    setIsReported(true);
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            {post.isAnonymous ? (
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                <User className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={
                  post.authorAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={post.authorUsername}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900">
                {post.authorUsername}
              </span>
              {post.isAnonymous && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  Anonymous Citizen
                </span>
              )}
              <span className="text-[11px] font-medium text-slate-400">• {formattedDate}</span>
            </div>

            {post.location && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>
                  {post.location.area ? `${post.location.area}, ` : ''}
                  {post.location.city}, {post.location.state}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Risk & Category Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              post.riskLevel === 'critical' || post.riskLevel === 'high'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Post Title & Content */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {post.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>
      </div>

      {/* Attachments / Screenshots */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {post.attachments.map((att) => (
            <div key={att.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
              <img
                src={att.url}
                alt={att.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xs p-2 text-[11px] text-white font-semibold truncate">
                📎 {att.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis Summary Box */}
      {post.aiAnalysisSummary && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-indigo-900 mr-1">Ask your Parwah AI:</span>
            <span className="text-indigo-900 font-medium">
              {post.aiAnalysisSummary.replace(/^(Sahay AI Advisory|Sahay AI|Sahay):\s*/i, '')}
            </span>
          </div>
        </div>
      )}

      {/* Reactions Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Reaction 1: Same Issue */}
          <button
            onClick={() => handleReactionClick('same_issue')}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              post.userReactions[currentUser?.id || ''] === 'same_issue'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t('sameIssue')}
          >
            <span>🙋‍♂️</span>
            <span className="hidden xs:inline">{t('sameIssue')}</span>
            <span className="font-extrabold ml-0.5">({post.reactions.same_issue || 0})</span>
          </button>

          {/* Reaction 2: I Can Help */}
          <button
            onClick={() => handleReactionClick('can_help')}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              post.userReactions[currentUser?.id || ''] === 'can_help'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t('canHelp')}
          >
            <span>🤝</span>
            <span className="hidden xs:inline">{t('canHelp')}</span>
            <span className="font-extrabold ml-0.5">({post.reactions.can_help || 0})</span>
          </button>

          {/* Reaction 3: Important */}
          <button
            onClick={() => handleReactionClick('important')}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              post.userReactions[currentUser?.id || ''] === 'important'
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t('important')}
          >
            <span>⚠️</span>
            <span className="hidden xs:inline">{t('important')}</span>
            <span className="font-extrabold ml-0.5">({post.reactions.important || 0})</span>
          </button>

          {/* Reaction 4: Verified */}
          <button
            onClick={() => handleReactionClick('verified')}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              post.userReactions[currentUser?.id || ''] === 'verified'
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={t('verifiedByMe')}
          >
            <span>✅</span>
            <span className="hidden sm:inline">{t('verifiedByMe')}</span>
            <span className="font-extrabold ml-0.5">({post.reactions.verified || 0})</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            title="Comments"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold">{post.commentsCount}</span>
          </button>

          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Save to Vault"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold shadow-md">
                Copied!
              </span>
            )}
          </button>

          <button
            onClick={handleReportClick}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isReported ? 'text-red-500' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Report Post"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a helpful response or guidance (you can mention @CyberCell)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={isAnonComment}
                  onChange={(e) => setIsAnonComment(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <span>Comment Anonymously</span>
              </label>

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
