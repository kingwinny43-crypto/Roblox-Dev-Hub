import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Users,
  Layers,
  Download,
  AlertTriangle,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Asset } from '../types';

interface AdminDashboardProps {
  assets: Asset[];
  onApprove: (assetId: string) => void;
  onDelete: (assetId: string) => void;
  onToggleTrending: (assetId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  assets,
  onApprove,
  onDelete,
  onToggleTrending,
}) => {
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);

  const totalDownloads = assets.reduce((acc, a) => acc + a.downloads, 0);
  const pendingUploads = assets.filter((a) => a.status === 'pending');

  const handleBanUser = (username: string) => {
    if (bannedUsers.includes(username)) {
      setBannedUsers(bannedUsers.filter((u) => u !== username));
    } else {
      setBannedUsers([...bannedUsers, username]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title */}
      <div className="flex items-center space-x-3 border-b border-zinc-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Moderation Dashboard</h1>
          <p className="text-xs text-zinc-400">
            Roblox Dev Hub platform analytics, security audit logs, and asset moderation actions
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">15,420</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span>Total Library Assets</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{assets.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span>Total Platform Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {totalDownloads.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span>Pending Asset Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingUploads.length}</div>
        </div>
      </div>

      {/* Assets Management Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Asset Moderation & Security Audit</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="text-[11px] font-bold text-zinc-500 uppercase bg-zinc-950/80 border-b border-zinc-800">
              <tr>
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Creator</th>
                <th className="p-3">Downloads</th>
                <th className="p-3">Security Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {assets.map((asset) => {
                const isUserBanned = bannedUsers.includes(asset.creator);
                return (
                  <tr key={asset.id} className="hover:bg-zinc-800/40">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-white">{asset.name}</div>
                          <div className="text-[10px] text-zinc-500">v{asset.version}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-blue-400">{asset.category}</td>
                    <td className="p-3">
                      <span className={isUserBanned ? 'text-red-400 line-through' : 'text-zinc-200'}>
                        {asset.creator}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{asset.downloads.toLocaleString()}</td>
                    <td className="p-3">
                      {asset.hasSuspiciousScript ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          ⚠ Caution (External Calls)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          🛡 Verified Safe
                        </span>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => onToggleTrending(asset.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          asset.isTrending
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                        title="Toggle Trending Flag"
                      >
                        🔥 Trend
                      </button>

                      <button
                        onClick={() => handleBanUser(asset.creator)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isUserBanned
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {isUserBanned ? 'Unban Dev' : 'Ban Dev'}
                      </button>

                      <button
                        onClick={() => onDelete(asset.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[10px] font-bold transition-all"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
