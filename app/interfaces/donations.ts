import { PublicKey } from '@solana/web3.js';
import { User } from './user';
import { Blink } from './blink';

export interface Donation {
  id: string;
  donor: User;
  recipient: User;
  amount: number;
  currency: 'SOL' | 'USDC' | 'BARK';
  message?: string;
  transactionSignature: string;
  createdAt: Date;
  campaign?: DonationCampaign;
  isAnonymous: boolean;
  tier?: DonationTier;
  blink?: Blink; // If the donation is associated with a Blink
}

export interface DonationCampaign {
  id: string;
  creator: User;
  title: string;
  description: string;
  goal: number;
  currency: 'SOL' | 'USDC' | 'BARK';
  currentAmount: number;
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  donations: Donation[];
  createdAt: Date;
  updatedAt: Date;
  tiers: DonationTier[];
  category: string;
  tags: string[];
  coverImage: string;
  isVerified: boolean;
  socialLinks?: {
    website?: string;
    twitter?: string;
    discord?: string;
  };
  updates: CampaignUpdate[];
}

export interface DonationTier {
  id: string;
  campaign: DonationCampaign;
  name: string;
  description: string;
  minimumAmount: number;
  rewards: string[];
  maxDonors?: number;
  currentDonors: number;
  blink?: Blink; // If a Blink is offered as a reward
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  topDonors: {
    user: User;
    totalAmount: number;
    donationCount: number;
  }[];
  recentDonations: Donation[];
  averageDonationAmount: number;
  mostPopularCurrency: 'SOL' | 'USDC' | 'BARK';
  donationsByDay: { date: string; amount: number }[];
}

export interface DonationParams {
  recipient: PublicKey;
  amount: number;
  currency: 'SOL' | 'USDC' | 'BARK';
  message?: string;
  campaignId?: string;
  isAnonymous?: boolean;
  tierId?: string;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  goal: number;
  currency: 'SOL' | 'USDC' | 'BARK';
  startDate: Date;
  endDate?: Date;
  tiers?: Omit<DonationTier, 'id' | 'campaign' | 'currentDonors'>[];
  category: string;
  tags: string[];
  coverImage: File;
}

export interface UpdateCampaignParams {
  campaignId: string;
  title?: string;
  description?: string;
  goal?: number;
  endDate?: Date;
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  tiers?: Omit<DonationTier, 'id' | 'campaign' | 'currentDonors'>[];
  category?: string;
  tags?: string[];
  coverImage?: File;
}

export interface CampaignUpdate {
  id: string;
  campaign: DonationCampaign;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DonationSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  status?: ('draft' | 'active' | 'paused' | 'completed' | 'cancelled')[];
  creator?: PublicKey;
  minGoal?: number;
  maxGoal?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  sortBy?: 'createdAt' | 'currentAmount' | 'endDate';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface DonationActivityParams {
  campaignId?: string;
  donorId?: string;
  recipientId?: string;
  fromDate?: Date;
  toDate?: Date;
  currency?: 'SOL' | 'USDC' | 'BARK';
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}

export interface DonationWebhookEvent {
  type: 'donation.created' | 'campaign.created' | 'campaign.updated' | 'campaign.completed';
  data: Donation | DonationCampaign;
  createdAt: Date;
}