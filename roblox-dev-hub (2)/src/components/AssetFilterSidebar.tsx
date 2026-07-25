import React from 'react';
import { Search, Filter, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { AssetCategory, GameType, AssetStyle } from '../types';

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategories: AssetCategory[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
  selectedGameTypes: GameType[];
  setSelectedGameTypes: React.Dispatch<React.SetStateAction<GameType[]>>;
  selectedStyles: AssetStyle[];
  setSelectedStyles: React.Dispatch<React.SetStateAction<AssetStyle[]>>;
  sortBy: 'latest' | 'downloads' | 'rating';
  setSortBy: (s: 'latest' | 'downloads' | 'rating') => void;
  onlyVerified: boolean;
  setOnlyVerified: (v: boolean) => void;
  onReset: () => void;
}

const CATEGORIES: AssetCategory[] = [
  'Models',
  'Scripts',
  'Maps',
  'Vehicles',
  'UI Systems',
  'Plugins',
  'Audio',
];

const GAME_TYPES: GameType[] = [
  'Roleplay',
  'Simulator',
  'Horror',
  'Fighting',
  'Racing',
  'Adventure',
];

const STYLES: AssetStyle[] = ['Realistic', 'Low Poly', 'Anime', 'Modern'];

export const AssetFilterSidebar: React.FC<FilterSidebarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedGameTypes,
  setSelectedGameTypes,
  selectedStyles,
  setSelectedStyles,
  sortBy,
  setSortBy,
  onlyVerified,
  setOnlyVerified,
  onReset,
}) => {
  const toggleCategory = (cat: AssetCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleGameType = (gt: GameType) => {
    if (selectedGameTypes.includes(gt)) {
      setSelectedGameTypes(selectedGameTypes.filter((g) => g !== gt));
    } else {
      setSelectedGameTypes([...selectedGameTypes, gt]);
    }
  };

  const toggleStyle = (st: AssetStyle) => {
    if (selectedStyles.includes(st)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== st));
    } else {
      setSelectedStyles([...selectedStyles, st]);
    }
  };

  return (
    <aside className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 space-y-6 sticky top-20">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filters & Search</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-300">Keyword Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Name, tags, creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-300">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="downloads">Most Downloaded</option>
          <option value="latest">Latest Released</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Category Filter Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 block">Category</label>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center space-x-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-zinc-800/50 transition-all"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Game Type Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 block">Game Type</label>
        <div className="space-y-1.5">
          {GAME_TYPES.map((gt) => {
            const isChecked = selectedGameTypes.includes(gt);
            return (
              <label
                key={gt}
                onClick={() => toggleGameType(gt)}
                className="flex items-center space-x-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-zinc-800/50 transition-all"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{gt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Style Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 block">Visual Style</label>
        <div className="space-y-1.5">
          {STYLES.map((st) => {
            const isChecked = selectedStyles.includes(st);
            return (
              <label
                key={st}
                onClick={() => toggleStyle(st)}
                className="flex items-center space-x-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-zinc-800/50 transition-all"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{st}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Security Checkbox */}
      <div className="pt-3 border-t border-zinc-800">
        <label
          onClick={() => setOnlyVerified(!onlyVerified)}
          className="flex items-center space-x-2.5 text-xs text-emerald-400 font-medium cursor-pointer select-none p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              onlyVerified
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'border-emerald-700 bg-zinc-950'
            }`}
          >
            {onlyVerified && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Only Verified Safe Scripts</span>
          </div>
        </label>
      </div>
    </aside>
  );
};
