import React, { useState } from 'react';
import { Users, Filter, PlusCircle, Search } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { PostCategory } from '../types';

interface CommunityPageProps {
  onOpenWhatHappened: () => void;
  onOpenShareConcern?: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onOpenWhatHappened, onOpenShareConcern }) => {
  const { posts, globalSearch } = useCommunity();
  const { ensureAuth } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleShareClick = () => {
    if (!ensureAuth('sharing a community concern')) return;
    if (onOpenShareConcern) {
      onOpenShareConcern();
    } else {
      onOpenWhatHappened();
    }
  };

  const categoryOptions: { id: PostCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'scam', label: 'Scams & Fraud' },
    { id: 'banking', label: 'Banking / Money' },
    { id: 'jobs', label: 'Fake Job / Task' },
    { id: 'road', label: 'Road & Potholes' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'domestic', label: 'Domestic Safety' },
    { id: 'consumer', label: 'Consumer Rights' },
    { id: 'government', label: 'Government Services' },
    { id: 'investment', label: 'Investment Fraud' },
  ];

  let filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  if (searchQuery.trim()) {
    const { matchedPosts } = globalSearch(searchQuery);
    filteredPosts = matchedPosts;
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">People Helping People</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Real experiences, community support, and local guidance across India.
          </p>
        </div>

        <button
          onClick={handleShareClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>＋ Share a Concern</span>
        </button>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search community posts by keyword, handle, category, or city..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs font-medium">
            No community posts match your selected filter or search query.
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
