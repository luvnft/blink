import { PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { barkBlinkSdk } from './bark-blink-sdk';

export async function prepareTransaction(instructions: TransactionInstruction[], payer: PublicKey) {
  try {
    // Fetch the latest blockhash with max commitment
    const { blockhash } = await barkBlinkSdk.connection.getLatestBlockhash({ commitment: 'max' });

    // Create a transaction message for versioned transaction
    const messageV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    // Return the constructed versioned transaction
    return new VersionedTransaction(messageV0);
  } catch (error) {
    console.error('Error preparing transaction:', error);
    throw new Error('Failed to prepare the transaction.');
  }
}
