import { PublicKey } from '@solana/web3.js';
import { Blink } from './blink';
import { NFT } from './nft';
import { Donation } from './donations';
import { Payment } from './payments';
import { SwapTransaction } from './swap';

export interface User {
  id: string;
  username: string;
  email?: string;
  publicKey: PublicKey;
  createdAt: Date;
  updatedAt: Date;
  blinks: Blink[];
  nfts: NFT[];
  profileImageUrl?: string;
  bio?: string;
  isVerified: boolean;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export type UserRole = 'user' | 'creator' | 'admin' | 'moderator';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newFollowerNotification: boolean;
  newBlinkNotification: boolean;
  newDonationNotification: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'followers';
  showEmail: boolean;
  showBlinks: boolean;
  showNFTs: boolean;
}

export interface UserProfile {
  username: string;
  email?: string;
  bio?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  joinedAt: Date;
  totalBlinks: number;
  totalNFTs: number;
}

export interface UserStats {
  totalBlinks: number;
  totalNFTs: number;
  totalFollowers: number;
  totalFollowing: number;
  totalDonationsReceived: number;
  totalDonationsMade: number;
  totalSwaps: number;
}

export interface UserActivity {
  blinks: Blink[];
  nfts: NFT[];
  donations: Donation[];
  payments: Payment[];
  swaps: SwapTransaction[];
}

export interface FollowRelation {
  followerId: string;
  followedId: string;
  createdAt: Date;
}

export interface CreateUserParams {
  username: string;
  email: string;
  publicKey: PublicKey;
  profileImageUrl?: string;
  bio?: string;
}

export interface UpdateUserParams {
  username?: string;
  email?: string;
  profileImageUrl?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserSearchParams {
  query: string;
  limit?: number;
  offset?: number;
  sortBy?: 'username' | 'createdAt' | 'totalBlinks';
  sortOrder?: 'asc' | 'desc';
}