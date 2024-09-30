import { PublicKey } from '@solana/web3.js';

export function validatePublicKey(publicKey: string): boolean {
  try {
    new PublicKey(publicKey);
    return true;
  } catch {
    return false;
  }
}