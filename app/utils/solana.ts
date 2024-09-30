import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, Commitment } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { IDL } from './blink_idl';
import { ApiError } from './api-error';

// Constants
export const BLINK_PROGRAM_ID = new PublicKey(process.env.BLINK_PROGRAM_ID || 'YOUR_BLINK_PROGRAM_ID');
export const NETWORK = process.env.SOLANA_NETWORK || 'devnet';
export const COMMITMENT: Commitment = 'confirmed';

// RPC URLs
const RPC_URLS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

// Initialize connection
export const connection = new Connection(
  process.env.SOLANA_RPC_URL || RPC_URLS[NETWORK as keyof typeof RPC_URLS],
  COMMITMENT
);

// Initialize provider and program
let provider: AnchorProvider;
let program: Program;

export function initializeProvider(wallet: Wallet) {
  provider = new AnchorProvider(connection, wallet, { commitment: COMMITMENT });
  program = new Program(IDL, BLINK_PROGRAM_ID, provider);
}

// Utility function to create a new blink
export async function createBlink(
  payer: Keypair,
  owner: PublicKey,
  name: string,
  description: string,
  blinkType: string,
  imageUrl?: string
): Promise<PublicKey> {
  try {
    const blinkKeypair = Keypair.generate();
    const [blinkPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('blink'), blinkKeypair.publicKey.toBuffer()],
      BLINK_PROGRAM_ID
    );

    const tx = await program.methods.createBlink(
      name,
      description,
      blinkType,
      imageUrl || ''
    )
    .accounts({
      blink: blinkPDA,
      owner: owner,
      payer: payer.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([payer, blinkKeypair])
    .rpc();

    console.log(`Blink created with signature ${tx}`);
    return blinkPDA;
  } catch (error) {
    console.error('Error creating blink:', error);
    throw new ApiError(500, 'Failed to create blink', [(error as Error).message]);
  }
}

// Add other utility functions for NFTs, collections, and assets here
// ...

export async function sendAndConfirmTransactionWithRetry(
  transaction: Transaction,
  signers: Keypair[],
  maxRetries: number = 3
): Promise<string> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        signers,
        { commitment: COMMITMENT }
      );
      console.log(`Transaction confirmed: ${signature}`);
      return signature;
    } catch (error) {
      console.error(`Transaction failed (attempt ${retries + 1}):`, error);
      retries++;
      if (retries >= maxRetries) {
        throw new ApiError(500, 'Failed to send and confirm transaction', [(error as Error).message]);
      }
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new ApiError(500, 'Failed to send and confirm transaction after max retries');
}