import React from 'react'
import { motion } from 'framer-motion'

export const About: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About BARK BLINK
        </motion.h2>
        <div className="max-w-3xl mx-auto text-center">
          <motion.p 
            className="text-lg mb-6 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            BARK BLINK is a revolutionary Blink As A Service platform built on the Solana blockchain. 
            We empower creators, collectors, and innovators to easily mint, manage, and trade unique digital assets.
          </motion.p>
          <motion.p 
            className="text-lg mb-6 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Our mission is to democratize access to blockchain technology and provide a user-friendly interface 
            for creating and interacting with Solana Blinks. Whether you're an artist, entrepreneur, or blockchain enthusiast, 
            BARK BLINK offers the tools you need to bring your ideas to life in the digital realm.
          </motion.p>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Join us in shaping the future of digital ownership and expression with BARK BLINK.
          </motion.p>
        </div>
      </div>
    </section>
  )
}