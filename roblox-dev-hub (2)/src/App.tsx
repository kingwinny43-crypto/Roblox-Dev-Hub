import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrendingAssets } from './components/TrendingAssets';
import { CategoryGrid } from './components/CategoryGrid';
import { AssetCard } from './components/AssetCard';
import { AssetFilterSidebar } from './components/AssetFilterSidebar';
import { AssetDetailsModal } from './components/AssetDetailsModal';
import { DownloadPageModal } from './components/DownloadPageModal';
import { UploadAssetModal } from './components/UploadAssetModal';
import { UserSystemModal } from './components/UserSystemModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { Asset, AssetCategory, GameType, AssetStyle, UserProfile } from './types';
import { SAMPLE_ASSETS } from './data/sampleAssets';
import { getAssetsFromFirestore, auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Layers, RotateCcw, AlertCircle, LogIn } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);

  // User State - Defaults to null to require login/signin before getting models
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<AssetCategory[]>([]);
  const [selectedGameTypes, setSelectedGameTypes] = useState<GameType[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<AssetStyle[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'downloads' | 'rating'>('downloads');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Modals
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<Asset | null>(null);
  const [selectedAssetForDownload, setSelectedAssetForDownload] = useState<Asset | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch Firestore Assets on mount
  useEffect(() => {
    getAssetsFromFirestore().then((data) => {
      if (data && data.length > 0) setAssets(data);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userEmail = firebaseUser.email?.toLowerCase() || '';
        const isUserAdmin = userEmail === 'kingwinny71@gmail.com';

        setCurrentUser({
          id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'RobloxDev',
          email: firebaseUser.email || '',
          avatar:
            firebaseUser.photoURL ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          bio: 'Roblox Studio Builder & Lua Scripter.',
          uploads: 0,
          downloads: 0,
          likes: 0,
          followers: 0,
          isAdmin: isUserAdmin,
          isVerifiedDev: true,
          savedAssetIds: [],
          createdAt: firebaseUser.metadata?.creationTime
            ? new Date(firebaseUser.metadata.creationTime).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Require auth to download or get any model
  const handleDownloadAsset = (asset: Asset) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedAssetForDownload(asset);
  };

  const handleOpenUpload = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setUploadModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Search query check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = asset.name.toLowerCase().includes(q);
          const matchDesc = asset.description.toLowerCase().includes(q);
          const matchCreator = asset.creator.toLowerCase().includes(q);
          const matchTags = asset.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCreator && !matchTags) return false;
        }

        // Category Check
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(asset.category)
        ) {
          return false;
        }

        // Game Type Check
        if (
          selectedGameTypes.length > 0 &&
          !selectedGameTypes.includes(asset.gameType)
        ) {
          return false;
        }

        // Style Check
        if (selectedStyles.length > 0 && !selectedStyles.includes(asset.style)) {
          return false;
        }

        // Security check
        if (onlyVerified && asset.hasSuspiciousScript) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'rating') return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    assets,
    searchQuery,
    selectedCategories,
    selectedGameTypes,
    selectedStyles,
    sortBy,
    onlyVerified,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedGameTypes([]);
    setSelectedStyles([]);
    setSortBy('downloads');
    setOnlyVerified(false);
  };

  const handleSelectCategoryFromGrid = (cat: AssetCategory) => {
    setSelectedCategories([cat]);
    setActiveTab('explore');
  };

  const handleAssetUploaded = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  const handleApproveAsset = (id: string) => {
    setAssets(
      assets.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a))
    );
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleToggleTrending = (id: string) => {
    setAssets(
      assets.map((a) => (a.id === id ? { ...a, isTrending: !a.isTrending } : a))
    );
  };

  const userUploadedAssets = assets.filter(
    (a) => a.creator === currentUser?.username
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenUpload={handleOpenUpload}
      />

      {/* Login requirement banner if guest */}
      {!currentUser && (
        <div className="bg-blue-600/15 border-b border-blue-500/30 text-blue-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <LogIn className="w-4 h-4 text-blue-400" />
          <span>Notice: You need to log in or sign in first to download or upload Roblox Studio models and assets.</span>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="underline font-bold hover:text-white ml-1 cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1">
        {/* PAGE 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExplore={() => setActiveTab('explore')}
              onUpload={handleOpenUpload}
            />

            <TrendingAssets
              assets={assets}
              onView={(a) => setSelectedAssetForDetails(a)}
              onDownload={handleDownloadAsset}
              onSeeAll={() => setActiveTab('explore')}
            />

            <CategoryGrid onSelectCategory={handleSelectCategoryFromGrid} />
          </div>
        )}

        {/* PAGE 2: ASSET LIBRARY / EXPLORE PAGE */}
        {(activeTab === 'explore' || activeTab === 'categories') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="w-full md:w-64 shrink-0">
                <AssetFilterSidebar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedGameTypes={selectedGameTypes}
                  setSelectedGameTypes={setSelectedGameTypes}
                  selectedStyles={selectedStyles}
                  setSelectedStyles={setSelectedStyles}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onlyVerified={onlyVerified}
                  setOnlyVerified={setOnlyVerified}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Main Assets Grid */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-black text-white">Asset Library</h1>
                    <p className="text-xs text-zinc-400">
                      Showing {filteredAssets.length} Roblox Studio resources
                    </p>
                  </div>
                </div>

                {filteredAssets.length === 0 ? (
                  <div className="py-16 text-center space-y-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
                    <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-white">No Assets Match Filters</h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                        Try adjusting your search terms or resetting filters to view all models and scripts.
                      </p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredAssets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        onView={(a) => setSelectedAssetForDetails(a)}
                        onDownload={handleDownloadAsset}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 7: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          currentUser?.isAdmin || currentUser?.email?.toLowerCase() === 'kingwinny71@gmail.com' ? (
            <AdminDashboard
              assets={assets}
              onApprove={handleApproveAsset}
              onDelete={handleDeleteAsset}
              onToggleTrending={handleToggleTrending}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white">Access Restricted</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The Admin Moderation Dashboard is restricted exclusively to <strong>kingwinny71@gmail.com</strong>.
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
              >
                Return to Home Page
              </button>
            </div>
          )
        )}

        {/* PAGE 11: COMMUNITY FORUM */}
        {activeTab === 'community' && <CommunitySection />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* MODALS */}

      {/* Asset Details Modal */}
      {selectedAssetForDetails && (
        <AssetDetailsModal
          asset={selectedAssetForDetails}
          currentUser={currentUser}
          onClose={() => setSelectedAssetForDetails(null)}
          onGoToDownload={(asset) => {
            setSelectedAssetForDetails(null);
            handleDownloadAsset(asset);
          }}
          onRequireAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Dedicated Download Page Modal */}
      {selectedAssetForDownload && (
        <DownloadPageModal
          asset={selectedAssetForDownload}
          onClose={() => setSelectedAssetForDownload(null)}
        />
      )}

      {/* Upload Asset Modal */}
      {uploadModalOpen && (
        <UploadAssetModal
          currentUser={currentUser}
          onClose={() => setUploadModalOpen(false)}
          onAssetUploaded={handleAssetUploaded}
        />
      )}

      {/* User Auth & Profile Modal */}
      {authModalOpen && (
        <UserSystemModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          userUploadedAssets={userUploadedAssets}
          savedAssets={[]}
          onClose={() => setAuthModalOpen(false)}
          onOpenUpload={handleOpenUpload}
          onViewAsset={(a) => setSelectedAssetForDetails(a)}
        />
      )}
    </div>
  );
}
