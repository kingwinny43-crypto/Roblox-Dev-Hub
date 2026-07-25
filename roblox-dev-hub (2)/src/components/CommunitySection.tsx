import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Tag, Send, X, User } from 'lucide-react';
import { CommunityPost } from '../types';
import { SAMPLE_COMMUNITY_POSTS } from '../data/sampleAssets';

export const CommunitySection: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_COMMUNITY_POSTS);
  const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('Scripting Help');

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      title,
      content,
      category,
      author: 'RobloxStudioCreator',
      authorAvatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      likes: 1,
      repliesCount: 0,
      date: 'Just now',
      tags: ['RobloxStudio', category.replace(/\s+/g, '')],
    };

    setPosts([newPost, ...posts]);
    setNewTopicModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Roblox Dev Forum & Community
            </h1>
            <p className="text-xs text-zinc-400">
              Ask scripting questions, showcase models, and discuss Roblox Studio development
            </p>
          </div>
        </div>

        <button
          onClick={() => setNewTopicModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Discussion</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl">
            <MessageSquare className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Community Discussions Yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Be the first developer to start a discussion, ask for scripting help, or showcase your Roblox Studio creations!
            </p>
            <button
              onClick={() => setNewTopicModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start First Discussion</span>
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30"
                  />
                  <span className="text-xs font-bold text-white">{post.author}</span>
                  <span className="text-[10px] text-zinc-500">• {post.date}</span>
                </div>

                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                  {post.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{post.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1.5 hover:text-blue-400 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes} Likes</span>
                  </button>
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Replies</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {post.tags.map((t) => (
                    <span key={t} className="text-[10px] text-zinc-500">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Topic Modal */}
      {newTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Dev Forum Topic</h3>
              <button
                onClick={() => setNewTopicModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-200">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to handle Datastore session locks?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-200">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Scripting Help">Scripting Help</option>
                  <option value="Asset Showcase">Asset Showcase</option>
                  <option value="Studio Feedback">Studio Feedback</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-200">Topic Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or showcase details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
              >
                Post Discussion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
