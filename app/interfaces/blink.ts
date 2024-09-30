import { PublicKey } from '@solana/web3.js';
import { User } from './user';

export interface Blink {
  id: string;
  name: string;
  description: string;
  creator: User;
  ownerPublicKey: PublicKey;
  mintAddress: PublicKey;
  supply: number;
  maxSupply: number;
  royalties: number;
  isTransferable: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes?: BlinkAttribute[];
  category: BlinkCategory;
  rarity?: number;
  isVerified: boolean;
  lastSalePrice?: number;
  currentListingPrice?: number;
  blinkType: BlinkType;
  metadataUri: string;
  collectionId?: string;
}

export type BlinkCategory = 'Art' | 'Music' | 'Video' | 'Photography' | 'Gaming' | 'Memes' | 'Other';

export type BlinkType = 'Standard' | 'Premium' | 'Limited' | 'Exclusive';

export interface BlinkAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date';
  max_value?: number;
  frequency?: number; // Percentage of Blinks with this trait
}

export interface BlinkCreationParams {
  name: string;
  description: string;
  supply: number;
  maxSupply: number;
  royalties: number;
  isTransferable: boolean;
  imageFile: File;
  animationFile?: File;
  externalUrl?: string;
  attributes?: BlinkAttribute[];
  category: BlinkCategory;
  blinkType: BlinkType;
  collectionId?: string;
}

export interface BlinkTransferParams {
  blinkId: string;
  fromPublicKey: PublicKey;
  toPublicKey: PublicKey;
  amount: number;
}

export interface BlinkCollection {
  id: string;
  name: string;
  description: string;
  creator: User;
  blinks: Blink[];
  coverImageUrl: string;
  floorPrice?: number;
  totalVolume?: number;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  category: BlinkCategory;
  socialLinks?: {
    website?: string;
    twitter?: string;
    discord?: string;
  };
}

export interface BlinkTransaction {
  id: string;
  blink: Blink;
  from: User;
  to: User;
  amount: number;
  price: number;
  timestamp: Date;
  transactionSignature: string;
  transactionType: 'mint' | 'transfer' | 'sale' | 'burn';
  marketplace?: string;
  fees: {
    royalty: number;
    platform: number;
  };
}

export interface BlinkListing {
  id: string;
  blink: Blink;
  seller: User;
  price: number;
  amount: number;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  listingType: 'fixed' | 'auction';
  minBid?: number;
  reservePrice?: number;
  currentBid?: number;
  currentBidder?: User;
}

export interface BlinkSearchParams {
  query?: string;
  collectionId?: string;
  category?: BlinkCategory;
  blinkType?: BlinkType;
  attributes?: { [key: string]: string | number }[];
  minPrice?: number;
  maxPrice?: number;
  creator?: PublicKey;
  owner?: PublicKey;
  isVerified?: boolean;
  sortBy?: 'price' | 'createdAt' | 'rarity' | 'popularity';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BlinkActivityParams {
  blinkId?: string;
  collectionId?: string;
  activityType?: ('mint' | 'transfer' | 'sale' | 'burn')[];
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export interface BlinkRoyaltyPayout {
  id: string;
  blink: Blink;
  transaction: BlinkTransaction;
  recipient: User;
  amount: number;
  timestamp: Date;
}

export interface BlinkMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: BlinkAttribute[];
  properties: {
    files: { uri: string; type: string }[];
    category: BlinkCategory;
    creators: { address: string; share: number }[];
  };
}