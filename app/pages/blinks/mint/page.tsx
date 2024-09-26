import React from 'react'
import { MintNFT } from '@/components/blinks/mint-nft'

export const metadata = {
  title: 'Mint NFT Blink | BARK Blinks',
  description: 'Mint your own unique NFT Blink on the Solana network.',
}

export default function MintNFTBlinkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Mint NFT Blink</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Create and mint your own unique NFT Blink on the Solana network. Turn your digital creations into valuable, tradeable assets.
      </p>
      <MintNFT />
    </div>
  )
}