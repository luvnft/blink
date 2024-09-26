import { NextResponse } from 'next/server'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { Metaplex } from '@metaplex-foundation/js'
import { env } from '@/lib/env'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userAddress = searchParams.get('address')

    if (!userAddress) {
      return NextResponse.json({ error: 'Missing user address' }, { status: 400 })
    }

    // Connect to Solana network
    const connection = new web3.Connection(env.NEXT_PUBLIC_RPC_ENDPOINT, 'confirmed')
    const metaplex = Metaplex.make(connection)

    const userPublicKey = new web3.PublicKey(userAddress)

    // Fetch user's NFTs
    const nfts = await metaplex.nfts().findAllByOwner({ owner: userPublicKey })

    // Count Blinks, Merch Blinks, and Gift Blinks
    const blinkCount = nfts.filter(nft => nft.symbol === 'BLINK').length
    const merchBlinkCount = nfts.filter(nft => nft.symbol === 'MERCH_BLINK').length
    const giftBlinkCount = nfts.filter(nft => nft.symbol === 'GIFT_BLINK').length

    // Fetch token accounts
    const tokenAccounts = await connection.getTokenAccountsByOwner(userPublicKey, {
      programId: token.TOKEN_PROGRAM_ID,
    })

    // Calculate total balance in SOL. USDC, BARK
    const solBalance = await connection.getBalance(userPublicKey) / web3.LAMPORTS_PER_SOL

    // Get total value of all tokens (simplified, in a real scenario you'd need to fetch current prices)
    const tokenBalance = tokenAccounts.value.reduce((total, account) => {
      const accountInfo = token.AccountLayout.decode(account.account.data)
      return total + Number(accountInfo.amount)
    }, 0)

    return NextResponse.json({
      blinks: blinkCount,
      merchBlinks: merchBlinkCount,
      giftBlinks: giftBlinkCount,
      solBalance,
      tokenBalance,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}