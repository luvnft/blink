import { PublicKey } from '@solana/web3.js';

export interface WalletBalance {
  publicKey: PublicKey;
  solBalance: number;
  tokenBalances: TokenBalance[];
  totalValueInUSD: number;
}

export interface TokenBalance {
  mint: PublicKey;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  valueInUSD: number;
  logoURI?: string;
}

export interface Transaction {
  signature: string;
  blockTime?: number;
  slot: number;
  type: TransactionType;
  amount: number;
  token: string;
  from: PublicKey;
  to: PublicKey;
  fee: number;
  status: TransactionStatus;
  memo?: string;
  errorMessage?: string;
}

export type TransactionType = 'SEND' | 'RECEIVE' | 'SWAP' | 'MINT' | 'BURN' | 'STAKE' | 'UNSTAKE' | 'REWARD' | 'NFT_PURCHASE' | 'NFT_SALE';

export type TransactionStatus = 'CONFIRMED' | 'PENDING' | 'FAILED';

export interface WalletInfo {
  publicKey: PublicKey;
  isConnected: boolean;
  walletName: string;
  walletType: 'hardware' | 'software' | 'ledger' | 'paper';
}

export interface WalletActivity {
  transactions: Transaction[];
  totalTransactions: number;
  lastActivityDate: Date;
}

export interface TokenPrice {
  mint: PublicKey;
  symbol: string;
  price: number;
  change24h: number;
}

export interface StakeInfo {
  publicKey: PublicKey;
  stakedAmount: number;
  rewards: number;
  validator: PublicKey;
  activationEpoch: number;
  deactivationEpoch?: number;
}

export interface NFTInWallet {
  mint: PublicKey;
  name: string;
  symbol: string;
  imageUrl: string;
  collectionName?: string;
}

export interface WalletStats {
  totalValueLocked: number;
  totalTransactions: number;
  mostUsedToken: string;
  largestTransaction: Transaction;
}

export interface CreateTransactionParams {
  from: PublicKey;
  to: PublicKey;
  amount: number;
  token: string;
  memo?: string;
}

export interface FetchTransactionsParams {
  publicKey: PublicKey;
  limit?: number;
  before?: string; // Transaction signature to fetch transactions before
  tokenFilter?: string; // Filter transactions by token
  typeFilter?: TransactionType[]; // Filter transactions by type
}

export interface ImportWalletParams {
  mnemonic: string;
  walletName: string;
  derivationPath?: string;
}

export interface ExportWalletParams {
  publicKey: PublicKey;
  password: string;
}

export interface WalletEventType {
  BALANCE_CHANGE: 'BALANCE_CHANGE';
  NEW_TRANSACTION: 'NEW_TRANSACTION';
  WALLET_CONNECTED: 'WALLET_CONNECTED';
  WALLET_DISCONNECTED: 'WALLET_DISCONNECTED';
  NETWORK_CHANGE: 'NETWORK_CHANGE';
}

export interface WalletEvent {
  type: WalletEventType[keyof WalletEventType];
  data: any;
  timestamp: Date;
}