'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Gift, ArrowRight } from 'lucide-react'

interface BlinkPreviewProps {
  id: string
  name: string
  description: string
  imageUrl: string
  type: 'standard' | 'premium' | 'limited'
  supply: number
  ownerAddress: string
}

export function BlinkPreview({ id, name, description, imageUrl, type, supply, ownerAddress }: BlinkPreviewProps) {
  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Supply: {supply}</span>
          <span>Owner: {truncateAddress(ownerAddress)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          Customize
        </Button>
        <Button variant="outline" size="sm">
          <Gift className="mr-2 h-4 w-4" />
          Gift
        </Button>
        <Button variant="default" size="sm">
          View
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}