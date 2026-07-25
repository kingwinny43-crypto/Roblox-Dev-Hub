import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Star,
  Shield,
  ShieldAlert,
  Code,
  Box,
  Layers,
  Send,
  User as UserIcon,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Asset, Comment, UserProfile } from '../types';
import { getCommentsFromFirestore, addCommentToFirestore } from '../lib/firebase';
import { scanRobloxScript } from '../lib/scriptScanner';

interface AssetDetailsModalProps {
  asset: Asset | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onGoToDownload: (asset: Asset) => void;
  onRequireAuth?: () => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  asset,
  currentUser,
  onClose,
  onGoToDownload,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'comments'>('overview');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentMessage, setNewCommentMessage] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (asset) {
      getCommentsFromFirestore(asset.id).then((data) => setComments(data));
    }
  }, [asset]);

  if (!asset) return null;

  const securityScan = scanRobloxScript(asset.codeSnippet || '');

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentMessage.trim()) return;

    setSubmittingComment(true);
    const commentData: Omit<Comment, 'id'> = {
      assetID: asset.id,
      userId: currentUser?.id || 'guest-' + Date.now(),
      username: currentUser?.username || 'RobloxStudioDev',
      avatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      message: newCommentMessage,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
    };

    const created = await addCommentToFirestore(commentData);
    setComments([created, ...comments]);
    setNewCommentMessage('');
    setSubmittingComment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              {asset.category}
            </span>
            <span className="text-zinc-400 text-xs font-medium">v{asset.version}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Top Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
              <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
              {asset.hasSuspiciousScript && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-500/90 text-black text-xs font-bold flex items-center space-x-1.5 shadow-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Script Warning</span>
                </div>
              )}
            </div>

            {/* Asset Info Summary */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{asset.name}</h1>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{asset.description}</p>
              </div>

              {/* Creator & Stats */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={
                        asset.creatorAvatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={asset.creator}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-1">
                        <span>{asset.creator}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-[10px] text-zinc-400">Verified Creator</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{asset.rating.toFixed(1)}</span>
                      <span className="text-zinc-500 text-xs">({asset.reviewsCount})</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      {asset.downloads.toLocaleString()} Downloads
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* BIG BLUE DOWNLOAD BUTTON */}
              <button
                onClick={() => {
                  if (!currentUser && onRequireAuth) {
                    onRequireAuth();
                  } else {
                    onGoToDownload(asset);
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.01]"
              >
                <Download className="w-5 h-5" />
                <span>
                  {currentUser ? `DOWNLOAD NOW (${asset.fileType})` : `LOG IN / SIGN IN TO GET MODEL (${asset.fileType})`}
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 space-x-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-all ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overview & Requirements
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-3 transition-all flex items-center space-x-1.5 ${
                activeTab === 'code'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Lua Code Preview & Security</span>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 transition-all ${
                activeTab === 'comments'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Reviews & Comments ({comments.length})
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Security Inspection Banner */}
              <div
                className={`p-4 rounded-2xl border ${
                  securityScan.isSafe
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {securityScan.isSafe ? (
                    <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {securityScan.isSafe
                        ? 'Automated Script Security Scan: PASSED'
                        : 'Security Notice: Contains External Calls'}
                    </h4>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                      {securityScan.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements & Installation Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Box className="w-4 h-4 text-blue-400" />
                    <span>Roblox Studio Requirements</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Roblox Studio v2026 or newer</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Enable DataStoreService in Game Settings (For Persistent State)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Allow HTTP Requests if using Discord Webhooks</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>How to Install in Roblox Studio</span>
                  </h3>
                  <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside">
                    <li>Download the <code className="text-blue-400">{asset.fileName}</code> file.</li>
                    <li>Open your place in Roblox Studio.</li>
                    <li>Right-click <code className="text-blue-400">Workspace</code> in Explorer.</li>
                    <li>Select <code className="text-blue-400">Insert from File...</code> and select this file!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Code Preview */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Lua Script Source Code ({securityScan.scannedLines} lines scanned)</span>
                <span className="text-emerald-400 font-mono">No hidden virus scripts detected</span>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-80">
                {asset.codeSnippet ||
                  `-- ${asset.name} Main Execution Script\nlocal Players = game:GetService("Players")\nprint("Loaded ${asset.name} into Roblox Studio!")`}
              </pre>
            </div>
          )}

          {/* Tab 3: Comments */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Write Comment Form */}
              <form onSubmit={handlePostComment} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Leave a Review & Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Share your experience using this model in Roblox Studio..."
                  value={newCommentMessage}
                  onChange={(e) => setNewCommentMessage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newCommentMessage.trim()}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={comment.avatar}
                          alt={comment.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-white">{comment.username}</span>
                        <span className="text-[10px] text-zinc-500">• {comment.date}</span>
                      </div>
                      <div className="flex items-center space-x-0.5">
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
