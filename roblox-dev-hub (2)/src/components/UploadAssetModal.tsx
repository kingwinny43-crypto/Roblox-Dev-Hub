import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  CheckCircle,
  FileCode,
  Image as ImageIcon,
  UploadCloud,
  FileText,
  Check,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';
import { Asset, AssetCategory, GameType, AssetStyle } from '../types';
import { addAssetToFirestore } from '../lib/firebase';

interface UploadAssetModalProps {
  currentUser: any;
  onClose: () => void;
  onAssetUploaded: (newAsset: Asset) => void;
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
  'General',
];

const STYLES: AssetStyle[] = ['Realistic', 'Low Poly', 'Anime', 'Modern', 'Cartoon'];

export const UploadAssetModal: React.FC<UploadAssetModalProps> = ({
  currentUser,
  onClose,
  onAssetUploaded,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Models');
  const [gameType, setGameType] = useState<GameType>('Roleplay');
  const [style, setStyle] = useState<AssetStyle>('Modern');
  const [tagsInput, setTagsInput] = useState('roblox, model, studio');
  
  // Game File Upload State
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('.rbxm');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Image Upload State
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
  );
  const [downloadLinkInput, setDownloadLinkInput] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  // Format file size helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Game File Selection Handlers
  const handleAssetFileSelected = (file: File) => {
    setAssetFile(file);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));

    const ext = '.' + (file.name.split('.').pop() || 'rbxm').toLowerCase();
    setFileType(ext);

    // Auto fill asset name if blank
    if (!name.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAssetFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Preview Image Selection Handlers
  const handleImageFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const finalImage = imagePreview;
    const finalFileURL =
      downloadLinkInput.trim() ||
      (assetFile ? URL.createObjectURL(assetFile) : `/downloads/${name.replace(/\s+/g, '')}.rbxm`);

    const newAssetData: Omit<Asset, 'id'> = {
      name,
      description,
      category,
      gameType,
      style,
      tags: tagsArr.length > 0 ? tagsArr : ['roblox'],
      image:
        finalImage ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      fileURL: finalFileURL,
      fileName: fileName || `${name.replace(/\s+/g, '')}.rbxm`,
      fileType: fileType || '.rbxm',
      fileSize: fileSize || '1.5 MB',
      creator: currentUser?.username || 'Verified Creator',
      creatorAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      downloads: 1,
      rating: 5.0,
      reviewsCount: 1,
      version: '1.0',
      isTrending: true,
      status: 'approved',
      securityStatus: 'verified',
      hasSuspiciousScript: false,
      suspiciousWarnings: [],
      codeSnippet: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const createdAsset = await addAssetToFirestore(newAssetData);
    onAssetUploaded(createdAsset);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Upload Developer Asset</h2>
              <p className="text-xs text-zinc-400">Share your model, script, map or UI with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* SECTION 1: DROP GAME / MODEL FILE */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-200 text-sm flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>1. Drop Roblox Game / Asset File *</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">
                Supports .rbxm, .rbxl, .zip, .lua
              </span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept=".rbxm,.rbxl,.zip,.lua,.model,.rbxmx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAssetFileSelected(e.target.files[0]);
                }
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDraggingFile
                  ? 'border-blue-500 bg-blue-500/10'
                  : assetFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-blue-500/50 hover:bg-zinc-900'
              }`}
            >
              {assetFile ? (
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs truncate max-w-[280px]">
                        {fileName}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {fileSize} • {fileType.toUpperCase()} file attached
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssetFile(null);
                        setFileName('');
                        setFileSize('');
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">
                      Drag & Drop your Roblox Studio file here
                    </span>
                    <span className="text-zinc-400 text-xs block mt-0.5">
                      or <span className="text-blue-400 underline font-semibold">browse files</span> on your computer
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">
                    Upload .rbxm model files, .rbxl place files, or .lua script files directly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: DROP PREVIEW IMAGE (UNDER THE GAME FILE DROP) */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-zinc-200 text-sm flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>2. Upload Asset Preview Image *</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">
                JPG, PNG, WebP or Image Link
              </span>
            </label>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFileSelected(e.target.files[0]);
                }
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Image Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingImage(true);
                }}
                onDragLeave={() => setIsDraggingImage(false)}
                onDrop={handleImageDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`sm:col-span-2 border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDraggingImage
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-blue-500/50 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white text-xs block">
                      Drop cover image here or click to browse
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      Recommended aspect ratio 16:9 for Roblox Studio model cards
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Image Preview Box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group shadow-md">
                <img
                  src={imagePreview}
                  alt="Asset Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-white bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                    Preview Card
                  </span>
                </div>
              </div>
            </div>

            {/* Asset Download Link Input */}
            <div className="pt-2 space-y-1">
              <label className="font-bold text-zinc-200 text-xs flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>External Asset Download Link</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">Roblox Library / Drive / MediaFire Link</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Paste download link (e.g. https://www.roblox.com/library/123456 or MediaFire / Google Drive link)"
                  value={downloadLinkInput}
                  onChange={(e) => setDownloadLinkInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Asset Name */}
          <div className="space-y-1.5 pt-2">
            <label className="font-bold text-zinc-200">Asset Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Modern Police Station, Quest System V2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-200">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what your asset does, features, setup steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category / Game Type / Style Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-200">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-200">Game Type *</label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {GAME_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-200">Visual Style *</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as AssetStyle)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-200">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="police, map, roleplay, building"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Submit Asset to Roblox Dev Hub</span>
          </button>
        </form>
      </div>
    </div>
  );
};

