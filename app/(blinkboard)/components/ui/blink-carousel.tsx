'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { BlinkCard } from '@/app/(blinkboard)/components/blink-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Blink {
  id: string
  name: string
  description: string
  image: string
  createdAt: Date
  likes: number
  shares: number
  comments: number
  views: number
}

interface BlinkCarouselProps {
  blinks: Blink[]
}

export const BlinkCarousel: React.FC<BlinkCarouselProps> = ({ blinks }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blinks.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blinks.length) % blinks.length)
  }

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      }
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-background p-4 rounded-lg shadow-md">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full"
        >
          <BlinkCard
            id={blinks[currentIndex].id}
            name={blinks[currentIndex].name}
            description={blinks[currentIndex].description}
            image={blinks[currentIndex].image}
            createdAt={blinks[currentIndex].createdAt.toLocaleDateString()}
            likes={blinks[currentIndex].likes}
            shares={blinks[currentIndex].shares}
            comments={blinks[currentIndex].comments}
            views={blinks[currentIndex].views}
          />
        </motion.div>
      </AnimatePresence>
      <Button 
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-background/80 hover:bg-background text-foreground"
        onClick={prevSlide}
        aria-label="Previous blink"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-background/80 hover:bg-background text-foreground"
        onClick={nextSlide}
        aria-label="Next blink"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {blinks.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-primary' : 'bg-primary/30'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to blink ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}