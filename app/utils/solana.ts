import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor'
import { IDL } from './blink_idl'

const BLINK_PROGRAM_ID = new PublicKey('YOUR_BLINK_PROGRAM_ID')
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com')

export async function createBlink(
  owner: PublicKey,
  name: string,
  description: string,
  blinkType: string,
  isNFT: boolean,
  isDonation: boolean,
  isGift: boolean,
  isPayment: boolean,
  isPoll: boolean
): Promise<string> {
  const payer = Keypair.generate() // In a real app, this would be your server's keypair
  const mintKeypair = Keypair.generate()

  const provider = new AnchorProvider(
    connection,
    { publicKey: payer.publicKey, signTransaction: async (tx) => tx, signAllTransactions: async (txs) => txs },
    { commitment: 'confirmed' }
  )

  const program = new Program(IDL, BLINK_PROGRAM_ID, provider)

  const [blinkPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('blink'), mintKeypair.publicKey.toBuffer()],
    program.programId
  )

  const transaction = new Transaction()

  // Create mint account
  transaction.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      0,
      payer.publicKey,
      payer.publicKey
    )
  )

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
  )

  // Sign and send transaction
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair]
  )

  console.log(`Blink created with signature ${signature}`)

  return mintKeypair.publicKey.toBase58()
}