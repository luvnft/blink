"use client"

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { motion } from 'framer-motion'

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="text-gray-700 dark:text-gray-300 hover:text-[#D0BFB4] dark:hover:text-[#E0CFC4] transition-colors duration-300 ease-in-out">
    {children}
  </Link>
)

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="font-poppins flex flex-col space-y-4">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="/pages/actions/api">API</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
          <ConnectWalletButton />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      className={`bg-white dark:bg-gray-900 sticky top-0 z-10 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="/pages/actions/api">API</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          <ConnectWalletButton />
          <ThemeToggle />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}