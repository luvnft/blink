"use client";

import { Twitter, Instagram, MessageCircle, FileText, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm mt-20">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-8">
          <Image
            src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
            alt="BARK BLINK logo"
            width={38}
            height={38}
            className="rounded-full"
          />
          <span className="font-bold text-2xl text-gray-800">BARK</span>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Follow Us</h3>
          <div className="flex space-x-6">
            <a href="https://medium.com/@barkprotocol" target="_blank" rel="noopener noreferrer" aria-label="Medium" className="hover:transform hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-gray-600 hover:text-[#D0BFB4] transition-colors" />
            </a>
            <a href="https://t.me/bark_protocol" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:transform hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-[#D0BFB4] transition-colors" />
            </a>
            <a href="https://twitter.com/bark_protocol" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:transform hover:scale-110 transition-transform">
              <Twitter className="w-6 h-6 text-gray-600 hover:text-[#D0BFB4] transition-colors" />
            </a>
            <a href="https://instagram.com/bark.protocol" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:transform hover:scale-110 transition-transform">
              <Instagram className="w-6 h-6 text-gray-600 hover:text-[#D0BFB4] transition-colors" />
            </a>
            <a href="https://discord.gg/barkprotocol" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:transform hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-gray-600 hover:text-[#D0BFB4] transition-colors" />
            </a>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <Link href="/pages/terms" className="text-sm text-gray-700 hover:text-[#D0BFB4] transition-colors">
            Terms of Use
          </Link>
          <Link href="/pages/privacy" className="text-sm text-gray-700 hover:text-[#D0BFB4] transition-colors">
            Privacy Policy
          </Link>
        </div>
        
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} BARK Protocol. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer