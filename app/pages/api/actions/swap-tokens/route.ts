import { NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'
import { env } from '@/lib/env'

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote'
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap'

export async function POST(req: Request) {
  try {
    const { inputMint, outputMint, amount, userPublicKey } = await req.json()

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Step 1: Get quote from Jupiter
    const quoteResponse = await fetch(`${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`)
    if (!quoteResponse.ok) {
      throw new Error('Failed to get quote from Jupiter')
    }
    const quoteData = await quoteResponse.json()

    // Step 2: Get swap transaction
    const swapResponse = await fetch(JUPITER_SWAP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey: userPublicKey,
        wrapUnwrapSOL: true
      })
    })
    if (!swapResponse.ok) {
      throw new Error('Failed to get swap transaction from Jupiter')
    }
    const swapData = await swapResponse.json()

    // Step 3: Return the swap transaction
    return NextResponse.json({
      swapTransaction: swapData.swapTransaction,
      inputAmount: quoteData.inputAmount,
      outputAmount: quoteData.outputAmount,
      price: quoteData.price
    })
  } catch (error) {
    console.error('Error in Jupiter swap:', error)
    return NextResponse.json({ error: 'Failed to create swap transaction', details: error.message }, { status: 500 })
  }
}