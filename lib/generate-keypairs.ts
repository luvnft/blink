import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

/**
 * Generates a new Solana keypair.
 * @returns {Keypair} A new Solana keypair.
 */
export function generateKeypair(): Keypair {
  return Keypair.generate();
}

/**
 * Generates a mnemonic phrase.
 * @param {number} wordCount - The number of words in the mnemonic (12, 15, 18, 21, or 24).
 * @returns {string} A mnemonic phrase.
 */
export function generateMnemonic(wordCount: 12 | 15 | 18 | 21 | 24 = 12): string {
  return bip39.generateMnemonic((wordCount * 11) - (wordCount / 3));
}

/**
 * Derives a Solana keypair from a mnemonic phrase and an optional derivation path.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {string} derivationPath - The derivation path (default: "m/44'/501'/0'/0'").
 * @returns {Keypair} A Solana keypair derived from the mnemonic.
 * @throws {Error} If the mnemonic is invalid.
 */
export function keypairFromMnemonic(mnemonic: string, derivationPath: string = "m/44'/501'/0'/0'"): Keypair {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
  return Keypair.fromSeed(derivedSeed);
}

/**
 * Generates a new Blink keypair with associated mnemonic.
 * @returns {Object} An object containing the keypair and mnemonic.
 */
export function generateBlinkKeypair() {
  const mnemonic = generateMnemonic();
  const keypair = keypairFromMnemonic(mnemonic);

  return {
    keypair,
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString('hex'),
  };
}

/**
 * Recovers a Blink keypair from a mnemonic phrase.
 * @param {string} mnemonic - The mnemonic phrase to recover the keypair from.
 * @returns {Object} An object containing the recovered keypair and related information.
 * @throws {Error} If the mnemonic is invalid.
 */
export function recoverBlinkKeypair(mnemonic: string) {
  const keypair = keypairFromMnemonic(mnemonic);

  return {
    keypair,
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString('hex'),
  };
}