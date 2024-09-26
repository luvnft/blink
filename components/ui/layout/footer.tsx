"use client";

import React from 'react'
import { Twitter, Instagram, Send, FileText, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const socialLinks = [
  { href: "https://medium.com/@barkprotocol", label: "Medium", icon: FileText },
  { href: "https://t.me/bark_protocol", label: "Telegram", icon: Send },
  { href: "https://twitter.com/bark_protocol", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com/bark.protocol", label: "Instagram", icon: Instagram },
  { href: "https://discord.gg/barkprotocol", label: "Discord", icon: MessageSquare },
]

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm mt-20">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <nav aria-label="Social media links" className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Follow Us</h3>
          <ul className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <motion.li key={link.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.label}
                  className="block"
                >
                  <link.icon className="w-6 h-6 text-[#D0BFB4] hover:text-[#C0AFA4] transition-colors" />
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        <nav aria-label="Legal links" className="flex space-x-4 mb-4">
          <Link href="/pages/terms" className="text-sm text-gray-700 hover:text-[#D0BFB4] transition-colors">
            Terms of Use
          </Link>
          <Link href="/pages/privacy" className="text-sm text-gray-700 hover:text-[#D0BFB4] transition-colors">
            Privacy Policy
          </Link>
        </nav>
        
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} BARK Protocol. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer