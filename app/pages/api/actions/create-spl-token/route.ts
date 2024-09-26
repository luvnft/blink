import { NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'

export async function POST(req: Request) {
  try {
    const { name, symbol, decimals, initialSupply } = await req.json()
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')

    // In a real-world scenario, you would use the user's wallet to sign transactions
    // For this example, we're using a dummy keypair
    const payer = Keypair.generate()

    // Fund the payer account (this step is for demonstration purposes only)
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 1000000000)
    await connection.confirmTransaction(airdropSignature)

    const mintAccount = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      decimals,
      TOKEN_PROGRAM_ID
    )

    const tokenAccount = await mintAccount.createAccount(payer.publicKey)

    await mintAccount.mintTo(
      tokenAccount,
      payer,
      [],
      initialSupply * Math.pow(10, decimals)
    )

    // In a real implementation, you would store token metadata on-chain or in a decentralized storage solution

    return NextResponse.json({ 
      success: true, 
      message: 'SPL Token created successfully',
      mintAddress: mintAccount.publicKey.toBase58(),
      tokenAccount: tokenAccount.toBase58(),
      name,
      symbol,
      decimals,
      initialSupply
    })
  } catch (error) {
    console.error('Error creating SPL Token:', error)
    return NextResponse.json({ success: false, message: 'Failed to create SPL Token' }, { status: 500 })
  }
}