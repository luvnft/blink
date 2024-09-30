import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NFT } from '@/interfaces/nft'
import Image from 'next/image'

interface NFTCardProps {
  nft: NFT
  onClick: (nft: NFT) => void
}

export function NFTCard({ nft, onClick }: NFTCardProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => onClick(nft)}>
      <CardHeader>
        <CardTitle className="truncate">{nft.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48">
          <Image
            src={nft.image}
            alt={nft.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{nft.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation()
          onClick(nft)
        }}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}