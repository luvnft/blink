'use client'

import React from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CTAProps {
  onLaunchApp: () => void;
}

export function CTA({ onLaunchApp }: CTAProps) {
  return (
    <section id="cta" className="mt-8 mb-20 py-16 sm:py-20 bg-gradient-to-br from-background to-secondary rounded-lg shadow-lg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="mb-6 relative w-16 h-16 mx-auto">
          <Image
            src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
            alt="BARK BLINK icon"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="font-inter text-4xl sm:text-5xl font-bold mb-6 text-foreground">
          Ready to Start Creating Blinks?
        </h2>
        <p className="font-light text-xl sm:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto">
          Join the BARK community and start creating your Blinks today! Experience the future of digital interactions on Solana.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base px-6 py-3 rounded-full shadow-md hover:shadow-lg"
            onClick={onLaunchApp}
          >
            Create Now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </motion.div>
        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required. Start for free and upgrade anytime.
        </p>
      </motion.div>
    </section>
  )
}