// constants/solana.ts

import { PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const BARK_BLINKS_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_BARK_BLINKS_PROGRAM_ID || '11111111111111111111111111111111' // Implement program
);

export const BARK_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_BARK_TOKEN_MINT || '2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg'
);

export const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || '';

export const SOLANA_COMMITMENT = 'confirmed';

export const MAX_RETRIES = 3;

export const RETRY_DELAY = 1000; // 1 second

export const TRANSACTION_TIMEOUT = 30000; // 30 seconds

export const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 1 billion lamports

export const MINIMUM_BALANCE_FOR_RENT_EXEMPTION = 0.00089088; // Minimum balance to keep an account alive (in SOL)

export const DEFAULT_ROYALTY_PERCENTAGE = 5; // 5%

export const MAX_ROYALTY_PERCENTAGE = 15; // 15%

export const NFT_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  '11111111111111111111111111111111'
);

export const SYSVAR_RENT_PUBKEY = new PublicKey(
  'SysvarRent111111111111111111111111111111111'
);

export const SYSVAR_CLOCK_PUBKEY = new PublicKey(
  'SysvarC1ock11111111111111111111111111111111'
);