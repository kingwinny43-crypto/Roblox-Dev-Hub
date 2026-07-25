import React, { useState } from 'react';
import { X, Download, CheckCircle, FileText, ArrowRight, ShieldCheck, Box, ExternalLink } from 'lucide-react';
import { Asset } from '../types';
import { generateRbxmContent, triggerBrowserDownload } from '../lib/rbxmGenerator';
import { incrementAssetDownloads } from '../lib/firebase';

interface DownloadPageModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const DownloadPageModal: React.FC<DownloadPageModalProps> = ({ asset, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  if (!asset) return null;

  const isExternalLink =
    asset.fileURL &&
    (asset.fileURL.startsWith('http://') ||
      asset.fileURL.startsWith('https://') ||
      asset.fileURL.startsWith('blob:'));

  const handleStartDownload = () => {
    if (downloading) return;

    // Increment database download counter
    incrementAssetDownloads(asset.id);

    if (isExternalLink) {
      window.open(asset.fileURL, '_blank');
      setDownloaded(true);
      return;
    }

    setDownloading(true);
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setDownloading(false);
        setDownloaded(true);

        // Generate and trigger browser file download
        const content = generateRbxmContent(asset.name, asset.category, asset.codeSnippet);
        const fileName = asset.fileName || `${asset.name.replace(/\s+/g, '')}.rbxm`;
        triggerBrowserDownload(fileName, content);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-blue-400">
              <Box className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white">{asset.name}</h2>
          <p className="text-xs text-zinc-400">Ready to download for Roblox Studio</p>
        </div>

        {/* Metadata Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-left text-xs">
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-400">Version:</span>
            <span className="font-bold text-white">v{asset.version}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-400">File Name:</span>
            <span className="font-mono text-blue-400 font-semibold">{asset.fileName}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-400">Created By:</span>
            <span className="font-bold text-white">{asset.creator}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-400">Total Downloads:</span>
            <span className="font-bold text-white">{asset.downloads.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">File Size:</span>
            <span className="font-bold text-zinc-300">{asset.fileSize || '2.4 MB'}</span>
          </div>
        </div>

        {/* Progress Bar during Download */}
        {downloading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Generating .rbxm model package...</span>
              <span className="font-bold text-blue-400">{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300 shadow-md shadow-blue-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* BIG BLUE DOWNLOAD BUTTON */}
        {!downloaded ? (
          <button
            onClick={handleStartDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-blue-600/40 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isExternalLink ? (
              <>
                <ExternalLink className="w-6 h-6 animate-pulse" />
                <span>GO TO DOWNLOAD LINK</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6 animate-bounce" />
                <span>DOWNLOAD ASSET ({asset.fileType?.toUpperCase() || '.RBXM'})</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Download Complete! File saved to your device.</span>
            </div>
            <p className="text-xs text-emerald-400/80">
              Drag and drop <code className="font-mono text-white">{asset.fileName}</code> into your Roblox Studio place.
            </p>
          </div>
        )}

        {/* Post Download Instructions */}
        <div className="pt-2 text-left space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Roblox Studio Import Steps</span>
          </h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            1. Open Roblox Studio → 2. Right click Workspace in Explorer → 3. Click "Insert from File..." → 4. Select your downloaded file.
          </p>
        </div>
      </div>
    </div>
  );
};
