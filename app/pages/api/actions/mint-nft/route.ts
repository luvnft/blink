import { NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'

export async function POST(req: Request) {
  try {
    const { name, description, image, attributes } = await req.json()
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')

    // In a real-world scenario, you would use the user's wallet to sign transactions
    // For this example, we're using a dummy keypair
    const payer = Keypair.generate()

    // Fund the payer account (this step is for demonstration purposes only)
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 1000000000)
    await connection.confirmTransaction(airdropSignature)

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(payer))
      .use(bundlrStorage())

    // Upload metadata
    const { uri } = await metaplex.nfts().uploadMetadata({
      name,
      description,
      image,
      attributes,
    })

    // Create mint account
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      0 // 0 decimals for NFT
    )

    // Get the token account of the payer address and if it does not exist, create it
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    )

    // Mint 1 token to the payer's token account
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer,
      1 // Mint exactly 1 token
    )

    // Create NFT
    const { nft } = await metaplex.nfts().create({
      uri,
      name,
      sellerFeeBasisPoints: 500, // 5% royalty
      useNewMint: mint,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'NFT minted successfully',
      mintAddress: nft.address.toBase58(),
      metadataUri: uri,
    })
  } catch (error) {
    console.error('Error minting NFT:', error)
    return NextResponse.json({ success: false, message: 'Failed to mint NFT' }, { status: 500 })
  }
}