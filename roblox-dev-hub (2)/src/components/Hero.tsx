import React from 'react';
import { Search, Upload, ArrowRight, ShieldCheck, Download, Code2, Layers, CheckCircle } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExplore: () => void;
  onUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExplore,
  onUpload,
}) => {
  return (
    <div className="relative overflow-hidden bg-zinc-950 pt-10 pb-16 border-b border-zinc-800/60">
      {/* Background Neon Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>100% Free Open Source Roblox Studio Creator Library</span>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Build Your <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Roblox Game Faster
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Discover thousands of free Roblox Studio models, scripts, maps, UI systems, and developer resources with built-in script security verification.
          </p>
        </div>

        {/* Large Search Bar with Sleek Ambient Glow */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-1 bg-blue-500/20 blur-md rounded-2xl pointer-events-none"></div>
          <div className="relative flex items-center bg-zinc-900 border border-zinc-700/80 rounded-xl p-1.5 shadow-2xl">
            <Search className="w-5 h-5 text-zinc-400 ml-3 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search models, scripts, UI, maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onExplore();
              }}
              className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none py-2 px-1"
            />
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onExplore}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center space-x-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-zinc-400">
            <span className="text-zinc-400">Popular:</span>
            {['Police System', 'City Map', 'Vehicle Pack', 'Inventory UI', 'Quest System'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  onExplore();
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/40 hover:text-white transition-all text-zinc-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onExplore}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Explore Assets</span>
          </button>
          <button
            onClick={onUpload}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Upload Asset</span>
          </button>
        </div>

        {/* Platform Stat Callouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-800/60 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-2xl font-black text-white">25,000+</div>
            <div className="text-xs text-zinc-400">Developer Assets</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-2xl font-black text-blue-400">120,000+</div>
            <div className="text-xs text-zinc-400">Total Downloads</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-xs text-zinc-400">Verified Free</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center">
            <div className="text-2xl font-black text-cyan-400">Shielded</div>
            <div className="text-xs text-zinc-400">Script Security Scan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
