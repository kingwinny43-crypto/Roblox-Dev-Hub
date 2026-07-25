import React from 'react';
import { AssetCategory } from '../types';

interface CategoryGridProps {
  onSelectCategory: (category: AssetCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories: { name: AssetCategory; icon: string; count: string; color: string }[] = [
    { name: 'Models', icon: '🏠', count: '8,400+ items', color: 'from-blue-600/20 to-blue-900/20' },
    { name: 'Vehicles', icon: '🚗', count: '3,200+ items', color: 'from-cyan-600/20 to-blue-900/20' },
    { name: 'Maps', icon: '🏙️', count: '4,100+ items', color: 'from-indigo-600/20 to-blue-900/20' },
    { name: 'Scripts', icon: '📜', count: '6,800+ items', color: 'from-blue-500/20 to-teal-900/20' },
    { name: 'UI Systems', icon: '📱', count: '2,900+ items', color: 'from-sky-600/20 to-blue-900/20' },
    { name: 'Plugins', icon: '🔌', count: '1,500+ items', color: 'from-blue-700/20 to-indigo-900/20' },
    { name: 'Audio', icon: '🎵', count: '5,000+ items', color: 'from-purple-600/20 to-blue-900/20' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-800/60">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Browse Categories</h2>
        <p className="text-xs text-zinc-400">
          Filter resources by Roblox Studio development category
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold hover:border-blue-500/50 flex items-center gap-2.5 transition-all text-zinc-300 hover:text-white hover:bg-zinc-800/80 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] cursor-pointer"
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
