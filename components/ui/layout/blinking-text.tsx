"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const BlinkingText: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.span 
          className="font-medium text-[#D0BFB4] dark:text-[#E0CFC4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          BLINK
        </motion.span>
      )}
    </AnimatePresence>
  )
}