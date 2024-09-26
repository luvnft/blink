import { NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const publicKey = searchParams.get('publicKey')

    if (!publicKey) {
      return NextResponse.json({ success: false, message: 'Public key is required' }, { status: 400 })
    }

    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')
    const pubkey = new PublicKey(publicKey)

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const blinks = tokenAccounts.value.map(accountInfo => ({
      mint: accountInfo.account.data.parsed.info.mint,
      tokenAmount: accountInfo.account.data.parsed.info.tokenAmount,
    }))

    return NextResponse.json({ 
      success: true, 
      blinks
    })
  } catch (error) {
    console.error('Error fetching user Blinks:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch user Blinks' }, { status: 500 })
  }
}