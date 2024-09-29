import React from 'react'
import Image from "next/legacy/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CTAProps {
  onLaunchApp: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onLaunchApp }) => {
  return (
    <section id="cta" className="mb-20 py-16 sm:py-20 bg-gradient-to-r from-sand-300 to-sand-400 rounded-lg shadow-lg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="mb-6">
          <Image
            src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
            alt="BARK BLINK icon"
            width={64}
            height={64}
            className="mx-auto"
          />
        </div>
        <h2 className="font-inter text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
          Ready to Start Creating Blinks?
        </h2>
        <p className="font-light text-xl sm:text-2xl mb-10 text-gray-700 max-w-2xl mx-auto">
          Join the BARK community and start creating your Blinks today! Experience the future of digital interactions on Solana.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className="bg-[#C0AFA4] text-gray-900 hover:bg-[#C0AFA5] transition-all text-base px-6 py-3 rounded-full shadow-md hover:shadow-lg"
            onClick={onLaunchApp}
          >
            Create Now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </motion.div>
        <p className="mt-6 text-sm text-gray-600">
          No credit card required. Start for free and upgrade anytime.
        </p>
      </motion.div>
    </section>
  )
}