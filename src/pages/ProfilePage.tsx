import React, { useState } from 'react';
import {
  User,
  Lock,
  Bookmark,
  Shield,
  ShieldCheck,
  LogOut,
  Trash2,
  Edit3,
  Globe,
  X,
  CheckCircle2,
  FileText,
  Ban,
  Camera,
  Palette,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, THEME_OPTIONS } from '../context/ThemeContext';
import { PostCard } from '../components/PostCard';
import { SupportedLanguageCode } from '../types';
import { BrandLogo } from '../components/BrandLogo';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, updateProfile, toggleAnonymousDefault, deleteAccount, setShowAuthModal } =
    useAuth();
  const { posts, savedPostIds } = useCommunity();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser?.fullName || '');
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'vault' | 'saved' | 'my_posts'>('vault');

  if (!currentUser) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm flex flex-col items-center">
        <BrandLogo variant="stacked" size="lg" showTagline={true} />
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Create an account to keep evidence confidential or publish community safety reports.
        </p>
        <button
          onClick={() => setShowAuthModal(true, 'login')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editFullName.trim(),
      username: editUsername.startsWith('@') ? editUsername.trim() : `@${editUsername.trim()}`,
      email: editEmail.trim(),
      avatarUrl: editAvatarUrl.trim() || undefined,
    });
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  // Filter posts
  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const myVaultPosts = posts.filter((p) => p.authorId === currentUser.id && p.isPrivateVault);
  const mySavedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {profileSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xs">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {currentUser.fullName || currentUser.username}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-indigo-600">{currentUser.username}</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Joined {currentUser.joinedDate}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => {
                setEditFullName(currentUser.fullName || '');
                setEditUsername(currentUser.username || '');
                setEditEmail(currentUser.email || '');
                setEditAvatarUrl(currentUser.avatarUrl || '');
                setIsEditingProfile(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Language Preference */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Preferred Language</span>
            </h3>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguageCode)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Visual Theme Preferences */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Visual Theme</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {THEME_OPTIONS.map((tOpt) => (
                <button
                  key={tOpt.id}
                  onClick={() => setTheme(tOpt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === tOpt.id
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-slate-900">{tOpt.name}</span>
                    <div className={`w-3.5 h-3.5 rounded-full ${tOpt.primaryBg}`} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{tOpt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Confidentiality Preferences */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Identity Protection</span>
            </h3>
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <p className="font-bold text-slate-800">Post Anonymously by Default</p>
                <p className="text-[10px] text-slate-500 font-medium">Hide username on new reports</p>
              </div>

              <button
                onClick={toggleAnonymousDefault}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-colors border ${
                  currentUser.isAnonymousDefault
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {currentUser.isAnonymousDefault ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tabs: Vault, Bookmarks, My Posts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${
              activeTab === 'vault'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Private Vault ({myVaultPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${
              activeTab === 'saved'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>Saved Bookmarks ({mySavedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_posts')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${
              activeTab === 'my_posts'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Community Posts ({myPosts.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'vault' && (
          <div>
            {myVaultPosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs font-medium">
                No confidential reports in your vault yet. When reporting an issue, select "Keep Private (Vault Only)" to save evidence confidentially.
              </div>
            ) : (
              <div className="space-y-4">
                {myVaultPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {mySavedPosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs font-medium">
                You haven't bookmarked any posts yet. Tap the bookmark icon on any community post to save it here.
              </div>
            ) : (
              <div className="space-y-4">
                {mySavedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my_posts' && (
          <div>
            {myPosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs font-medium">
                You haven't posted any community reports yet.
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Deletion */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm space-y-2">
        <h3 className="text-sm font-extrabold text-red-900">Account & Privacy Control</h3>
        <p className="text-xs text-red-700 font-medium">
          Permanently clear your local profile, private vault cache, and stored authentication tokens.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your account data from this browser?')) {
              deleteAccount();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account Data</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Edit Profile Information</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name (Private unless consented):</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Public Handle:</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Avatar Image URL (Optional):</label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

