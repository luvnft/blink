'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface BlinkCardProps {
  id: string
  name: string
  description: string
  image: string
  createdAt: string
  likes: number
  onLike?: (id: string) => void
  onViewDetails?: (id: string) => void
}

export function BlinkCard({ 
  id, 
  name, 
  description, 
  image, 
  createdAt, 
  likes, 
  onLike,
  onViewDetails 
}: BlinkCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike && onLike(id)
  }

  const handleViewDetails = () => {
    onViewDetails && onViewDetails(id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} mr-1 transition-colors duration-300`} />
            <span>{likes + (isLiked ? 1 : 0)}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}