import { PublicKey } from '@solana/web3.js';
import { User } from './user';

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: NFTAttribute[];
  mintAddress: PublicKey;
  owner: User;
  creator: User;
  royalties: number; // Percentage
  supply: number;
  maxSupply: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  collectionId?: string;
  rarity?: number; // Rarity score or rank within the collection
  lastSalePrice?: number;
  currentListingPrice?: number;
  tokenStandard: 'NonFungible' | 'FungibleAsset' | 'Fungible' | 'NonFungibleEdition';
  metadataUri: string;
}

export interface NFTAttribute {
  traitType: string;
  value: string | number;
  frequency?: number; // Percentage of NFTs in the collection with this trait
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: User;
  nfts: NFT[];
  floorPrice?: number;
  totalVolume?: number;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  category: string;
  totalSupply: number;
  uniqueHolders: number;
  socialLinks: {
    website?: string;
    twitter?: string;
    discord?: string;
  };
}

export interface NFTTransaction {
  id: string;
  nft: NFT;
  from: User;
  to: User;
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

export interface NFTMintParams {
  name: string;
  description: string;
  image: File;
  animationUrl?: File;
  externalUrl?: string;
  attributes: NFTAttribute[];
  royalties: number;
  supply: number;
  maxSupply: number;
  collectionId?: string;
  tokenStandard: 'NonFungible' | 'FungibleAsset' | 'Fungible' | 'NonFungibleEdition';
}

export interface NFTListingParams {
  nft: NFT;
  price: number;
  duration?: number; // Duration in seconds, undefined means no expiration
  listingType: 'fixed' | 'auction';
  minBid?: number; // For auction listings
  reservePrice?: number; // For auction listings
}

export interface NFTListing {
  id: string;
  nft: NFT;
  seller: User;
  price: number;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  listingType: 'fixed' | 'auction';
  minBid?: number;
  reservePrice?: number;
  currentBid?: number;
  currentBidder?: User;
}

export interface NFTBid {
  id: string;
  listing: NFTListing;
  bidder: User;
  amount: number;
  timestamp: Date;
  status: 'active' | 'accepted' | 'outbid' | 'cancelled';
}

export interface NFTSearchParams {
  query?: string;
  collectionId?: string;
  attributes?: { [key: string]: string | number }[];
  minPrice?: number;
  maxPrice?: number;
  creator?: PublicKey;
  owner?: PublicKey;
  sortBy?: 'price' | 'createdAt' | 'rarity';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface NFTActivityParams {
  nftId?: string;
  collectionId?: string;
  activityType?: ('mint' | 'transfer' | 'sale' | 'burn')[];
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export interface NFTRoyaltyPayout {
  id: string;
  nft: NFT;
  transaction: NFTTransaction;
  recipient: User;
  amount: number;
  timestamp: Date;
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: NFTAttribute[];
  properties: {
    files: { uri: string; type: string }[];
    category: string;
    creators: { address: string; share: number }[];
  };
}