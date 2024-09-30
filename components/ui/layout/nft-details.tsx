import React from 'react'
import { NFT } from '@/interfaces/nft'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, ExternalLink } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface NFTDetailsProps {
  nft: NFT
}

export function NFTDetails({ nft }: NFTDetailsProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: nft.name,
        text: nft.description,
        url: `https://blink.barkprotocol.com/nft/${nft.id}`,
      })
    } catch (error) {
      console.error('Error sharing:', error)
      toast({
        title: "Sharing failed",
        description: "Unable to share this NFT. Try copying the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full h-64 sm:h-96">
        <Image
          src={nft.image}
          alt={nft.name}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{nft.name}</h2>
        <p className="text-muted-foreground">{nft.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {nft.attributes.map((attr, index) => (
          <Badge key={index} variant="secondary">
            {attr.trait_type}: {attr.value}
          </Badge>
        ))}
      </div>
      <div className="space-y-2">
        <p><strong>Creator:</strong> {nft.creator}</p>
        <p><strong>Owner:</strong> {nft.owner}</p>
        <p><strong>Mint Address:</strong> {nft.mintAddress}</p>
        <p><strong>Token Standard:</strong> {nft.tokenStandard}</p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" asChild>
          <a href={`https://explorer.solana.com/address/${nft.mintAddress}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </a>
        </Button>
      </div>
    </div>
  )
}