import React from 'react';
import { Download, Star, Shield, ShieldAlert, Eye, CheckCircle2 } from 'lucide-react';
import { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onView: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onView, onDownload }) => {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-600/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all flex flex-col h-full">
      {/* Image Preview Container */}
      <div className="relative h-36 bg-zinc-950 w-full overflow-hidden">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-zinc-900/90 pointer-events-none" />

        {/* Category Badge on Bottom-Left */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 z-10">
          <span className="bg-zinc-950/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded text-blue-400 font-bold uppercase tracking-widest border border-blue-500/20">
            {asset.category}
          </span>
          {asset.version && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-900/90 text-[10px] font-semibold text-zinc-300 border border-zinc-800">
              v{asset.version}
            </span>
          )}
        </div>

        {/* Security Indicator on Top-Right */}
        <div className="absolute top-2 right-2 z-10">
          {asset.hasSuspiciousScript ? (
            <div
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold backdrop-blur-sm"
              title="Contains third-party require or loadstring script"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Caution</span>
            </div>
          ) : (
            <div
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold backdrop-blur-sm"
              title="Verified Script Security Scan Passed"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Safe</span>
            </div>
          )}
        </div>

        {/* Trending Tag on Top-Left */}
        {asset.isTrending && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
              🔥 Trending
            </span>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
            {asset.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-zinc-400 mb-3 line-clamp-1 leading-relaxed">
            {asset.description}
          </p>

          {/* Creator & Stats Row */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80 mb-3">
            <div className="flex items-center space-x-1.5 truncate max-w-[120px]">
              <img
                src={
                  asset.creatorAvatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                }
                alt={asset.creator}
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
              />
              <span className="truncate text-zinc-300 font-medium">{asset.creator}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <div className="flex items-center space-x-1 text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{asset.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1 text-zinc-400">
                <Download className="w-3 h-3 text-blue-400" />
                <span>{(asset.downloads / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onView(asset)}
            className="w-full flex items-center justify-center space-x-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>View</span>
          </button>
          <button
            onClick={() => onDownload(asset)}
            className="w-full flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.25)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get</span>
          </button>
        </div>
      </div>
    </div>
  );
};
