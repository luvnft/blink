import { NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
const DONATION_WALLET = process.env.DONATION_WALLET || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'

export async function POST(req: Request) {
  try {
    const { amount, donorPublicKey } = await req.json()
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')

    // In a real-world scenario, you would use the user's wallet to sign transactions
    // For this example, we're using a dummy keypair
    const payer = Keypair.generate()

    // Fund the payer account (this step is for demonstration purposes only)
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 1000000000)
    await connection.confirmTransaction(airdropSignature)

    const donationAmount = amount * LAMPORTS_PER_SOL // Convert SOL to lamports

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(donorPublicKey),
        toPubkey: new PublicKey(DONATION_WALLET),
        lamports: donationAmount,
      })
    )

    // Set the payer and recent blockhash
    transaction.feePayer = payer.publicKey
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash

    // Sign the transaction (in a real scenario, this would be done client-side)
    transaction.sign(payer)

    // Send the transaction
    const signature = await connection.sendRawTransaction(transaction.serialize())

    // Confirm the transaction
    await connection.confirmTransaction(signature)

    return NextResponse.json({ 
      success: true, 
      message: 'Donation processed successfully',
      signature,
      amount: amount,
    })
  } catch (error) {
    console.error('Error processing donation:', error)
    return NextResponse.json({ success: false, message: 'Failed to process donation' }, { status: 500 })
  }
}