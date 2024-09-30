import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { BlinkIDL, BLINK_PROGRAM_ID } from './blink_idl';

const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
const payer = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.PAYER_SECRET_KEY!)));

const provider = new AnchorProvider(
  connection,
  new web3.Wallet(payer),
  { preflightCommitment: 'processed' }
);

const program = new Program(BlinkIDL, BLINK_PROGRAM_ID, provider);

export async function updateBlinkOnChain(
  mintAddress: string,
  name?: string,
  description?: string,
  imageUrl?: string,
  blinkType?: string
): Promise<string> {
  try {
    const blinkAccount = new PublicKey(mintAddress);

    const tx = await program.methods.updateBlink({
      name: name || null,
      description: description || null,
      imageUrl: imageUrl || null,
      blinkType: blinkType || null,
    })
      .accounts({
        blink: blinkAccount,
        authority: provider.wallet.publicKey,
      })
      .transaction();

    const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log('Blink updated on-chain. Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error updating blink on-chain:', error);
    throw new Error('Failed to update blink on-chain');
  }
}

export async function deleteBlinkFromChain(mintAddress: string): Promise<string> {
  try {
    const blinkAccount = new PublicKey(mintAddress);

    const tx = await program.methods.deleteBlink()
      .accounts({
        blink: blinkAccount,
        authority: provider.wallet.publicKey,
      })
      .transaction();

    const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log('Blink deleted from chain. Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error deleting blink from chain:', error);
    throw new Error('Failed to delete blink from chain');
  }
}

export async function getBlinkMetadata(mintAddress: string): Promise<any> {
  try {
    const blinkAccount = new PublicKey(mintAddress);
    const blinkData = await program.account.blink.fetch(blinkAccount);
    return blinkData;
  } catch (error) {
    console.error('Error fetching blink metadata:', error);
    throw new Error('Failed to fetch blink metadata');
  }
}