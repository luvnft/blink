import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { IDL } from './blink_idl';
import { ApiError } from './api-error';

const BLINK_PROGRAM_ID = new PublicKey('YOUR_BLINK_PROGRAM_ID');
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

interface BlinkParams {
  owner: PublicKey;
  name: string;
  description: string;
  blinkType: string;
  isNFT: boolean;
  isDonation: boolean;
  isGift: boolean;
  isPayment: boolean;
  isPoll: boolean;
}

export async function createBlink({
  owner,
  name,
  description,
  blinkType,
  isNFT,
  isDonation,
  isGift,
  isPayment,
  isPoll
}: BlinkParams): Promise<string> {
  try {
    const payer = Keypair.generate(); // In a real app, this would be your server's keypair
    const mintKeypair = Keypair.generate();

    const provider = new AnchorProvider(
      connection,
      {
        publicKey: payer.publicKey,
        signTransaction: async (tx: Transaction) => tx,
        signAllTransactions: async (txs: Transaction[]) => txs,
      },
      { commitment: 'confirmed' }
    );

    const program = new Program(IDL, BLINK_PROGRAM_ID, provider);

    const [blinkPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('blink'), mintKeypair.publicKey.toBuffer()],
      program.programId
    );

    const transaction = new Transaction();

    // Create mint account
    transaction.add(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        0,
        payer.publicKey,
        payer.publicKey
      )
    );

    // Create Blink account
    transaction.add(
      await program.methods.createBlink(name, description, blinkType, isNFT, isDonation, isGift, isPayment, isPoll)
        .accounts({
          blink: blinkPDA,
          mint: mintKeypair.publicKey,
          owner: owner,
          payer: payer.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction()
    );

    // Sign and send transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair],
      { commitment: 'confirmed' }
    );

    console.log(`Blink created with signature ${signature}`);

    return mintKeypair.publicKey.toBase58();
  } catch (error) {
    console.error('Error creating Blink:', error);
    throw new ApiError(500, 'Failed to create Blink', [(error as Error).message]);
  }
}