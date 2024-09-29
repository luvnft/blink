export const APP_NAME = 'BARK Blinks';
export const APP_DESCRIPTION = 'A decentralized platform for creating and trading digital assets';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blinks.barkprotocol.net';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const DEFAULT_AVATAR = '/images/default-avatar.png';

export const PAGINATION_LIMIT = 20;

export const TRANSACTION_TYPES = {
  MINT: 'MINT',
  TRANSFER: 'TRANSFER',
  BURN: 'BURN',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
  REWARD: 'REWARD',
};

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
};

export const NFT_CATEGORIES = [
  'Art',
  'Collectibles',
  'Music',
  'Photography',
  'Sports',
  'Virtual Worlds',
  'Other',
];

export const CURRENCY_DECIMALS = 9; // Solana uses 9 decimal places

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  INVALID_INPUT: 'Invalid input provided',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
};

export const SUCCESS_MESSAGES = {
  NFT_MINTED: 'NFT minted successfully',
  NFT_TRANSFERRED: 'NFT transferred successfully',
  NFT_BURNED: 'NFT burned successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  CREATE: '/create',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
};

export const API_ROUTES = {
  MINT_NFT: '/api/v1/nfts/mint',
  TRANSFER_NFT: '/api/v1/nfts/transfer',
  BURN_NFT: '/api/v1/nfts/burn',
  GET_USER_NFTS: '/api/v1/users/nfts',
  UPDATE_PROFILE: '/api/v1/users/profile',
};