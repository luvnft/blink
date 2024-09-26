import { NextResponse } from 'next/server'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'
import { env } from '@/lib/env'

export async function POST(req: Request) {
  try {
    const { name, description, image, recipient, attributes } = await req.json()

    // Validate input
    if (!name || !description || !image || !recipient) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Connect to Solana network
    const connection = new web3.Connection(env.NEXT_PUBLIC_RPC_ENDPOINT, 'confirmed')

    // Create a new account for the Blink
    const blinkAccount = web3.Keypair.generate()

    // Set up Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(blinkAccount))
      .use(bundlrStorage())

    // Upload metadata
    const { uri } = await metaplex.nfts().uploadMetadata({
      name,
      description,
      image,
      attributes,
    })

    // Create mint account
    const mint = await token.createMint(
      connection,
      blinkAccount,
      blinkAccount.publicKey,
      null,
      0
    )

    // Create associated token account for recipient
    const recipientPublicKey = new web3.PublicKey(recipient)
    const associatedTokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      blinkAccount,
      mint,
      recipientPublicKey
    )

    // Mint 1 token to the recipient
    await token.mintTo(
      connection,
      blinkAccount,
      mint,
      associatedTokenAccount.address,
      blinkAccount,
      1
    )

    // Create NFT using Metaplex
    const { nft } = await metaplex.nfts().create({
      uri,
      name,
      sellerFeeBasisPoints: 0,
      mintAddress: mint,
    })

    return NextResponse.json({ 
      message: 'Blink created successfully',
      blinkAddress: nft.address.toString(),
      metadataUri: uri,
      mint: mint.toString(),
    })
  } catch (error) {
    console.error('Error creating Blink:', error)
    return NextResponse.json({ error: 'Failed to create Blink', details: error.message }, { status: 500 })
  }
}