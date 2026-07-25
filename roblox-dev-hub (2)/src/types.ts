export type AssetCategory =
  | 'Models'
  | 'Vehicles'
  | 'Maps'
  | 'Scripts'
  | 'UI Systems'
  | 'Plugins'
  | 'Audio';

export type GameType =
  | 'Roleplay'
  | 'Simulator'
  | 'Horror'
  | 'Fighting'
  | 'Racing'
  | 'Adventure'
  | 'General';

export type AssetStyle =
  | 'Realistic'
  | 'Low Poly'
  | 'Anime'
  | 'Modern'
  | 'Cartoon';

export type SecurityStatus = 'verified' | 'warning' | 'flagged';

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  gameType: GameType;
  style: AssetStyle;
  tags: string[];
  image: string;
  fileURL: string;
  fileName: string;
  fileType: string; // .rbxm, .rbxl, .lua, .mp3
  fileSize?: string;
  creator: string;
  creatorId?: string;
  creatorAvatar?: string;
  downloads: number;
  rating: number;
  reviewsCount: number;
  version: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  status: 'approved' | 'pending' | 'flagged';
  securityStatus: SecurityStatus;
  hasSuspiciousScript: boolean;
  suspiciousWarnings: string[];
  codeSnippet?: string;
  requirements?: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  uploads: number;
  downloads: number;
  likes: number;
  followers: number;
  isAdmin?: boolean;
  isVerifiedDev?: boolean;
  savedAssetIds: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  assetID: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  rating: number;
  date: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: 'Scripting Help' | 'Asset Showcase' | 'Studio Feedback' | 'General';
  likes: number;
  repliesCount: number;
  date: string;
  tags: string[];
}

export interface SecurityScanResult {
  isSafe: boolean;
  status: SecurityStatus;
  scannedLines: number;
  suspiciousFindings: {
    type: 'require' | 'loadstring' | 'getfenv' | 'http_webhook' | 'obfuscation';
    line: number;
    code: string;
    description: string;
  }[];
  recommendation: string;
}
