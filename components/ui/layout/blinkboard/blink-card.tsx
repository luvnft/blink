import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import Image from 'next/image'

interface BlinkCardProps {
  id: string
  name: string
  description: string
  image: string
  createdAt: string
  likes: number
}

export function BlinkCard({ id, name, description, image, createdAt, likes }: BlinkCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Created {createdAt}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="ghost" className="p-0">
          <Heart className="h-5 w-5 text-red-500 mr-1" />
          <span>{likes}</span>
        </Button>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  )
}