import { PublicKey } from '@solana/web3.js';
import { User } from './user';
import { Blink } from './blink';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'sol' | 'usdc' | 'bark' | 'credit_card' | 'paypal' | 'bank_transfer';
export type PaymentType = 'purchase' | 'subscription' | 'donation' | 'refund' | 'blink_transfer';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  type: PaymentType;
  sender: User;
  recipient: User;
  description: string;
  transactionSignature?: string; // For blockchain transactions
  createdAt: Date;
  updatedAt: Date;
  fees: {
    platformFee: number;
    networkFee: number;
  };
  metadata: Record<string, any>; // Additional data specific to the payment type
  relatedBlink?: Blink; // If the payment is related to a Blink
  ipAddress: string;
  userAgent: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  type: PaymentType;
  sender: User;
  recipient: User;
  description: string;
  expiresAt: Date;
  createdAt: Date;
  metadata: Record<string, any>;
  paymentMethods: PaymentMethod[]; // Allowed payment methods for this intent
  redirectUrl: string; // URL to redirect after successful payment
  webhookUrl: string; // URL to send webhook notifications
}

export interface Subscription {
  id: string;
  user: User;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  paymentMethod: PaymentMethod;
  lastPayment?: Payment;
  nextPaymentAmount: number;
  cancelReason?: string;
  metadata: Record<string, any>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  intervalCount: number; // Number of intervals between payments
  features: string[];
  trialPeriodDays?: number;
  metadata: Record<string, any>;
}

export interface Refund {
  id: string;
  originalPayment: Payment;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'rejected';
  processedAt?: Date;
  createdAt: Date;
  refundMethod: PaymentMethod;
  refundTransactionSignature?: string;
  adminNotes?: string;
}

export interface PaymentAccount {
  id: string;
  user: User;
  balance: number;
  currency: string;
  isDefault: boolean;
  type: 'wallet' | 'bank_account' | 'credit_card' | 'paypal';
  details: WalletDetails | BankAccountDetails | CreditCardDetails | PayPalDetails;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface WalletDetails {
  address: PublicKey;
  walletProvider?: string;
}

export interface BankAccountDetails {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountHolderName: string;
  accountType: 'checking' | 'savings';
  country: string;
}

export interface CreditCardDetails {
  last4: string;
  brand: string;
  expirationMonth: number;
  expirationYear: number;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PayPalDetails {
  email: string;
  paypalAccountId: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  recipientId: string;
  description: string;
  metadata?: Record<string, any>;
  relatedBlinkId?: string;
}

export interface ProcessPaymentParams {
  paymentIntentId: string;
  paymentMethod: PaymentMethod;
  paymentDetails: any; // Depends on the payment method
  savePaymentMethod?: boolean;
}

export interface CreateSubscriptionParams {
  userId: string;
  planId: string;
  paymentMethod: PaymentMethod;
  startDate?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  planId?: string;
  paymentMethod?: PaymentMethod;
  status?: 'active' | 'paused';
  metadata?: Record<string, any>;
}

export interface CancelSubscriptionParams {
  subscriptionId: string;
  reason?: string;
  cancelImmediately: boolean;
}

export interface RequestRefundParams {
  paymentId: string;
  amount: number;
  reason: string;
  refundMethod?: PaymentMethod;
}

export interface PaymentStats {
  totalRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  topPaymentMethods: { method: PaymentMethod; count: number; total: number }[];
  recentTransactions: Payment[];
  revenueByDay: { date: string; amount: number }[];
  revenueByPaymentType: { type: PaymentType; amount: number }[];
  subscriptionStats: {
    activeSubscriptions: number;
    mrr: number; // Monthly Recurring Revenue
    averageSubscriptionDuration: number; // in days
  };
}

export interface PaymentWebhookEvent {
  id: string;
  type: 'payment.created' | 'payment.succeeded' | 'payment.failed' | 'refund.created' | 'refund.processed' | 'subscription.created' | 'subscription.cancelled' | 'subscription.updated' | 'payment_account.created' | 'payment_account.updated';
  data: Payment | Refund | Subscription | PaymentAccount;
  createdAt: Date;
}

export interface PaymentSearchParams {
  userId?: string;
  status?: PaymentStatus[];
  method?: PaymentMethod[];
  type?: PaymentType[];
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'createdAt' | 'amount';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreatePaymentAccountParams {
  userId: string;
  type: 'wallet' | 'bank_account' | 'credit_card' | 'paypal';
  details: WalletDetails | BankAccountDetails | CreditCardDetails | PayPalDetails;
  isDefault?: boolean;
}

export interface UpdatePaymentAccountParams {
  accountId: string;
  details?: Partial<WalletDetails | BankAccountDetails | CreditCardDetails | PayPalDetails>;
  isDefault?: boolean;
  status?: 'active' | 'inactive';
}