import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor'
import { IDL } from './blink_idl'

// Constants
const BLINK_PROGRAM_ID = new PublicKey('YOUR_BLINK_PROGRAM_ID')
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com')

// Types
interface BlinkParams {
  owner: PublicKey
  name: string
  description: string
  blinkType: string
  isNFT: boolean
  isDonation: boolean
  isGift: boolean
  isPayment: boolean
  isPoll: boolean
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
    // Generate keypairs
    const payer = Keypair.generate() // In a real app, this would be your server's keypair
    const mintKeypair = Keypair.generate()

    // Create AnchorProvider
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: payer.publicKey,
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs
      },
      { commitment: 'confirmed' }
    )

    // Initialize program
    const program = new Program(IDL, BLINK_PROGRAM_ID, provider)

    // Find PDA for Blink account
    const [blinkPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('blink'), mintKeypair.publicKey.toBuffer()],
      program.programId
    )

    // Create transaction
    const transaction = new Transaction()

    // Add instruction to create mint account
    transaction.add(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        0,
        payer.publicKey,
        payer.publicKey
      )
    )

    // Add instruction to create Blink account
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
    )

    // Sign and send transaction
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair]
    )

    console.log(`Blink created with signature ${signature}`)

    return mintKeypair.publicKey.toBase58()
  } catch (error) {
    console.error('Error creating Blink:', error)
    throw new Error('Failed to create Blink')
  }
}