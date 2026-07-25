import React from 'react';
import { Box, Shield, MessageSquare, Github, ExternalLink, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 pt-12 pb-8 mt-16 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Box className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">Roblox Dev Hub</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The premier free Roblox Studio asset marketplace and developer resource engine. Download models, scripts, UI packages, and vehicles for your next game.
            </p>
            <div className="flex items-center space-x-3 text-xs text-zinc-400">
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield className="w-3 h-3" />
                <span>Automated Script Scanner</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Explore Library</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-blue-400 transition-colors">
                  Top Downloaded Models
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-blue-400 transition-colors">
                  Roleplay Systems & Scripts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-blue-400 transition-colors">
                  Modern GUI & HUD Packs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-blue-400 transition-colors">
                  Realistic Vehicles & A-Chassis
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Developer Tools</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-blue-400 transition-colors">
                  DevForum Community Feed
                </button>
              </li>
              <li>
                <span className="text-zinc-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-blue-400 inline mr-1" />
                  AI Asset Finder Assistant
                </span>
              </li>
              <li>
                <a href="https://create.roblox.com/docs" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Roblox Creator Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Join Community</h4>
            <p className="text-xs text-zinc-400 mb-4">
              Connect with 15,000+ Roblox Studio developers sharing open-source scripts and models.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500/50 transition-all"
                title="Discord"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500/50 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© 2026 Roblox Dev Hub. Built for Roblox Studio creators.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Developer Guidelines</span>
          </div>
        </div>

        {/* Sleek Status Bar */}
        <div className="mt-8 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2 font-mono">
          <div>24,812 Assets • 9,102 Verified Creators • 1.2M+ Downloads</div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Verified Script Security System Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
