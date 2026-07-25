import React, { useState } from 'react';
import {
  Box,
  Search,
  Upload,
  User as UserIcon,
  Shield,
  MessageSquare,
  Home,
  Grid,
  Menu,
  X,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onOpenUpload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore Assets', icon: Compass },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'admin', label: 'Admin Panel', icon: Shield, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all">
              <div className="w-4 h-4 bg-white rotate-45"></div>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">
                ROBLOX <span className="text-blue-500">DEV HUB</span>
              </span>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search models, scripts, UI, maps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveTab('explore');
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-zinc-400">
            {navItems.map((item) => {
              if (item.adminOnly && !currentUser?.isAdmin) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden xs:inline">Upload</span>
            </button>

            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-1.5 rounded-lg transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-md object-cover ring-2 ring-blue-500/40"
                />
                <div className="text-left hidden md:block pr-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-zinc-200">
                      {currentUser.username}
                    </span>
                    {currentUser.isVerifiedDev && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800 flex items-center space-x-1.5"
              >
                <UserIcon className="w-4 h-4 text-blue-400" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveTab('explore');
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200"
            />
          </div>

          {navItems.map((item) => {
            if (item.adminOnly && !currentUser?.isAdmin) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
