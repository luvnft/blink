import { NextResponse } from 'next/server'
import * as web3 from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Connect to Solana network
    const connection = new web3.Connection(process.env.SOLANA_RPC_ENDPOINT!, 'confirmed')
    const metaplex = Metaplex.make(connection)

    // Fetch all NFTs created by the BARK BLINK program
    const nfts = await metaplex.nfts().findAllByCreator({ creator: new web3.PublicKey(process.env.BLINK_PROGRAM_ID!) })

    // Filter for Merchant Blinks that are for sale
    const merchBlinks = nfts.filter(nft => 
      nft.symbol === 'MERC_BLINK' && 
      nft.json?.attributes?.some(attr => attr.trait_type === 'ForSale' && attr.value === 'true')
    )

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedMerchBlinks = merchBlinks.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedMerchBlinks,
      totalItems: merchBlinks.length,
      currentPage: page,
      totalPages: Math.ceil(merchBlinks.length / limit),
    })
  } catch (error) {
    console.error('Error fetching marketplace items:', error)
    return NextResponse.json({ error: 'Failed to fetch marketplace items' }, { status: 500 })
  }
}