import { User } from './user';
import { PublicKey } from '@solana/web3.js';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginParams {
  publicKey: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp
}

export interface AuthContextProps {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  isUserLoading: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface ReactChildrenProps {
  children: React.ReactNode;
}

export interface RegisterParams {
  username: string;
  email: string;
  publicKey: string;
  signature: string;
  message: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmResetPasswordParams {
  email: string;
  token: string;
  newPassword: string;
}

export interface UpdateProfileParams {
  username?: string;
  email?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface VerifyEmailParams {
  token: string;
}

export interface TwoFactorAuthParams {
  type: '2fa_setup' | '2fa_verify';
  code: string;
}

export interface AuthErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export type AuthProvider = 'email' | 'google' | 'twitter' | 'discord';

export interface SocialAuthParams {
  provider: AuthProvider;
  token: string;
}

export interface WalletAuthParams {
  publicKey: PublicKey;
  signature: string;
  message: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
  };
}

export interface AuthConfig {
  tokenExpirationTime: number; // in seconds
  refreshTokenExpirationTime: number; // in seconds
  maxLoginAttempts: number;
  lockoutDuration: number; // in seconds
  passwordResetTokenExpiration: number; // in seconds
  emailVerificationRequired: boolean;
  twoFactorAuthEnabled: boolean;
}