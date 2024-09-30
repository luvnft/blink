import { PublicKey } from '@solana/web3.js';
import { User } from './user';

export interface Token {
  symbol: string;
  name: string;
  mint: PublicKey;
  decimals: number;
  logoURI: string;
}

export interface SwapRoute {
  inAmount: number;
  outAmount: number;
  priceImpactPct: number;
  marketInfos: MarketInfo[];
  swapTransaction: string; // Base64 encoded transaction
}

export interface MarketInfo {
  id: string;
  label: string;
  inputMint: PublicKey;
  outputMint: PublicKey;
  notEnoughLiquidity: boolean;
  inAmount: number;
  outAmount: number;
  priceImpactPct: number;
  lpFee: {
    amount: number;
    mint: PublicKey;
    pct: number;
  };
  platformFee: {
    amount: number;
    mint: PublicKey;
    pct: number;
  };
}

export interface SwapParams {
  inputMint: PublicKey;
  outputMint: PublicKey;
  amount: number;
  slippage: number;
  userPublicKey: PublicKey;
}

export interface SwapQuote {
  route: SwapRoute;
  otherAmountThreshold: number;
  swapMode: 'ExactIn' | 'ExactOut';
}

export interface SwapTransaction {
  id: string;
  user: User;
  inputToken: Token;
  outputToken: Token;
  inputAmount: number;
  outputAmount: number;
  route: SwapRoute;
  status: 'pending' | 'completed' | 'failed';
  transactionSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwapFees {
  networkFee: number;
  platformFee: number;
  lpFee: number;
  totalFees: number;
}

export interface SwapSettings {
  slippageTolerance: number;
  autoRouting: boolean;
  preferredDexes?: string[];
}

export interface TokenPair {
  tokenA: Token;
  tokenB: Token;
}

export interface LiquidityPool {
  id: string;
  tokenPair: TokenPair;
  totalLiquidity: number;
  apr: number;
  volume24h: number;
}

export interface SwapStats {
  totalVolumeUSD: number;
  volume24hUSD: number;
  totalSwaps: number;
  uniqueUsers: number;
  topTokenPairs: TokenPair[];
}

export interface CreateSwapParams {
  inputToken: Token;
  outputToken: Token;
  amount: number;
  slippage: number;
  userPublicKey: PublicKey;
}

export interface ExecuteSwapParams {
  swapQuote: SwapQuote;
  userPublicKey: PublicKey;
}

export interface SwapHistoryParams {
  userPublicKey: PublicKey;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface SwapEventType {
  SWAP_INITIATED: 'SWAP_INITIATED';
  SWAP_COMPLETED: 'SWAP_COMPLETED';
  SWAP_FAILED: 'SWAP_FAILED';
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE';
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED';
}

export interface SwapEvent {
  type: SwapEventType[keyof SwapEventType];
  transaction: SwapTransaction;
  timestamp: Date;
  details?: any;
}