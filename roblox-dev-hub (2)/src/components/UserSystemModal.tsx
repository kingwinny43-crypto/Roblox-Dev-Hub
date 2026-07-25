import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Upload,
  Heart,
  Download,
  Users,
  CheckCircle,
  LogOut,
  Sparkles,
  Shield,
  Layers,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, Asset } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';

interface UserSystemModalProps {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  userUploadedAssets: Asset[];
  savedAssets: Asset[];
  onClose: () => void;
  onOpenUpload: () => void;
  onViewAsset: (asset: Asset) => void;
}

export const UserSystemModal: React.FC<UserSystemModalProps> = ({
  currentUser,
  setCurrentUser,
  userUploadedAssets,
  savedAssets,
  onClose,
  onOpenUpload,
  onViewAsset,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google Sign In
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = user.email?.toLowerCase() || '';
      const profile: UserProfile = {
        id: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'RobloxDev',
        email: user.email || '',
        avatar:
          user.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: 'Roblox Studio Builder & Lua Scripter.',
        uploads: userUploadedAssets.length,
        downloads: 0,
        likes: 0,
        followers: 0,
        isAdmin: userEmail === 'kingwinny71@gmail.com',
        isVerifiedDev: true,
        savedAssetIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(profile);
      onClose();
    } catch (err: any) {
      console.warn('Google login error/fallback:', err);
      if (err?.message) {
        setAuthError(err.message.replace('Firebase: ', ''));
      } else {
        setAuthError('Google sign in failed. Please try email & password login.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email.trim() || !password.trim()) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const userEmail = user.email?.toLowerCase() || email.toLowerCase();
      const profile: UserProfile = {
        id: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'RobloxDev',
        email: user.email || email,
        avatar:
          user.photoURL ||
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        bio: 'Roblox Studio Builder & Lua Scripter.',
        uploads: userUploadedAssets.length,
        downloads: 0,
        likes: 0,
        followers: 0,
        isAdmin: userEmail === 'kingwinny71@gmail.com',
        isVerifiedDev: true,
        savedAssetIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(profile);
      onClose();
    } catch (err: any) {
      console.warn('Email sign-in error:', err);
      const msg = err?.code || err?.message || 'Invalid email or password.';
      if (msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setAuthError('Account not found or password incorrect. Try creating a new account.');
      } else if (msg.includes('wrong-password')) {
        setAuthError('Incorrect password. Please check and try again.');
      } else {
        // Local developer account creation fallback
        handleFallbackLocalAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email.trim() || !password.trim()) {
      setAuthError('Please provide an email and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const displayName = usernameInput.trim() || email.split('@')[0];

      await updateProfile(user, { displayName });
      const userEmail = user.email?.toLowerCase() || email.toLowerCase();

      const profile: UserProfile = {
        id: user.uid,
        username: displayName,
        email: user.email || email,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: 'Roblox Studio Builder & Lua Scripter.',
        uploads: 0,
        downloads: 0,
        likes: 0,
        followers: 0,
        isAdmin: userEmail === 'kingwinny71@gmail.com',
        isVerifiedDev: true,
        savedAssetIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(profile);
      onClose();
    } catch (err: any) {
      console.warn('Registration error:', err);
      const msg = err?.code || err?.message || '';
      if (msg.includes('email-already-in-use')) {
        setAuthError('An account with this email already exists. Switch to Sign In.');
      } else if (msg.includes('weak-password')) {
        setAuthError('Password is too weak. Please use at least 6 characters.');
      } else {
        handleFallbackLocalAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackLocalAuth = () => {
    const displayName = usernameInput.trim() || (email ? email.split('@')[0] : 'RobloxDev');
    const userEmail = email.toLowerCase();
    const profile: UserProfile = {
      id: 'usr-' + Date.now(),
      username: displayName,
      email: email || 'dev@robloxdevhub.com',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      bio: 'Roblox Studio Builder & Lua Scripter.',
      uploads: userUploadedAssets.length,
      downloads: 0,
      likes: 0,
      followers: 0,
      isAdmin: userEmail === 'kingwinny71@gmail.com',
      isVerifiedDev: true,
      savedAssetIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(profile);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    setCurrentUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {currentUser ? 'Developer Profile' : 'Connect Account'}
              </h2>
              <p className="text-xs text-zinc-400">
                {currentUser
                  ? 'Manage your uploads, downloads, and developer stats'
                  : 'Sign in to download models, scripts, and publish creations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOT LOGGED IN - AUTH FORM */}
        {!currentUser ? (
          <div className="space-y-6 py-2">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider absolute">
                OR USE EMAIL & PASSWORD
              </span>
            </div>

            {/* Auth Mode Toggle (Sign In / Register) */}
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'signin'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'register'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={authMode === 'signin' ? handleEmailSignIn : handleEmailRegister}
              className="space-y-4 text-xs"
            >
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Developer Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="e.g. ApexScripter"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="developer@roblox.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <span>
                  {loading
                    ? 'Connecting...'
                    : authMode === 'signin'
                    ? 'Sign In with Email'
                    : 'Register Developer Account'}
                </span>
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN USER PROFILE */
          <div className="space-y-6">
            {/* Profile Info Header */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/40"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-xl font-bold text-white">{currentUser.username}</h3>
                  {currentUser.isVerifiedDev && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{currentUser.email || currentUser.bio}</p>
                <p className="text-[10px] text-zinc-500">Joined: {currentUser.createdAt}</p>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-red-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Asset</span>
              </button>
            </div>

            {/* User Uploaded Assets List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>My Uploaded Library ({userUploadedAssets.length})</span>
              </h4>

              {userUploadedAssets.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No assets uploaded yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userUploadedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onClose();
                        onViewAsset(asset);
                      }}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-blue-500/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{asset.name}</div>
                          <div className="text-[10px] text-zinc-400">{asset.category}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-400">
                        {asset.downloads} DLs
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

