import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Send, Gift, Sparkles } from 'lucide-react'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  text: string
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text }) => (
  <Link href={href} passHref>
    <motion.a
      className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="mt-2 text-sm font-medium text-gray-900">{text}</span>
    </motion.a>
  </Link>
)

export const BlinkActionNav: React.FC = () => {
  return (
    <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
      <NavItem href="/blinks/create" icon={<Plus className="h-6 w-6" style={{ color: '#D0BFB4' }} />} text="Create Blink" />
      <NavItem href="/blinks/send" icon={<Send className="h-6 w-6" style={{ color: '#D0BFB4' }} />} text="Send Blink" />
      <NavItem href="/blinks/gifts" icon={<Gift className="h-6 w-6" style={{ color: '#D0BFB4' }} />} text="Gift Blink" />
      <NavItem href="/blinks/mint" icon={<Sparkles className="h-6 w-6" style={{ color: '#D0BFB4' }} />} text="Mint NFT Blink" />
    </nav>
  )
}