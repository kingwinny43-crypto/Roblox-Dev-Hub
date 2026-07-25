import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Asset } from '../types';
import { AssetCard } from './AssetCard';

interface TrendingAssetsProps {
  assets: Asset[];
  onView: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
  onSeeAll: () => void;
}

export const TrendingAssets: React.FC<TrendingAssetsProps> = ({
  assets,
  onView,
  onDownload,
  onSeeAll,
}) => {
  const trendingList = assets.filter((a) => a.isTrending || a.downloads > 15000).slice(0, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Trending Assets</h2>
            <p className="text-xs text-zinc-400">
              Most downloaded Roblox Studio models and scripts this week
            </p>
          </div>
        </div>

        <button
          onClick={onSeeAll}
          className="flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-2 rounded-xl border border-blue-500/20"
        >
          <span>View All Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Trending Assets */}
      {trendingList.length === 0 ? (
        <div className="py-12 text-center bg-zinc-900/30 border border-zinc-800/60 rounded-2xl">
          <p className="text-xs text-zinc-400 font-medium">No trending models or scripts posted yet. Be the first to publish an asset!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {trendingList.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onView={onView} onDownload={onDownload} />
          ))}
        </div>
      )}
    </section>
  );
};
