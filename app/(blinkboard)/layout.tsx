"use client"

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { SolanaWalletProvider } from '@/components/providers/solana-wallet-provider'
import { 
  BarChart2, 
  Gift, 
  Coins, 
  ShoppingBag, 
  Palette, 
  Layers, 
  Settings,
  Bell,
  ChevronLeft,
  Menu,
  X,
  Heart,
  Repeat,
  Users,
  Sun,
  Moon,
  LogOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const LOGO_URL = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

const navItems = [
  { name: 'Overview', icon: <BarChart2 className="w-5 h-5" />, href: '/blinkboard' },
  { name: 'NFT', icon: <Palette className="w-5 h-5" />, href: '/blinkboard/nft' },
  { name: 'Payments', icon: <Coins className="w-5 h-5" />, href: '/blinkboard/payments' },
  { name: 'Donations', icon: <Heart className="w-5 h-5" />, href: '/blinkboard/donations' },
  { name: 'Commerce', icon: <ShoppingBag className="w-5 h-5" />, href: '/blinkboard/commerce' },
  { name: 'Gift', icon: <Gift className="w-5 h-5" />, href: '/blinkboard/gift' },
  { name: 'Swap', icon: <Repeat className="w-5 h-5" />, href: '/blinkboard/swap' },
  { name: 'Staking', icon: <Layers className="w-5 h-5" />, href: '/blinkboard/staking' },
  { name: 'DAO', icon: <Users className="w-5 h-5" />, href: '/blinkboard/dao' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/blinkboard/settings' },
]

export default function BlinkBoardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleBackToMain = () => {
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  return (
    <SolanaWalletProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-200">
          <nav className={`w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg fixed md:static h-full z-30 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'left-0' : '-left-full md:left-0'}`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <Image
                  src={LOGO_URL}
                  alt="BARK BLINK logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">Blinkboard</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                <X className="h-6 w-6 text-[#D0BFB4]" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-10rem)] md:h-[calc(100vh-14rem)] py-4">
              <ul className="space-y-2 px-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          href={item.href} 
                          className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${pathname === item.href ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className={`${pathname === item.href ? 'text-primary' : 'text-[#D0BFB4]'}`}>
                            {React.cloneElement(item.icon, { className: `w-5 h-5 ${pathname === item.href ? 'text-primary' : 'text-[#D0BFB4]'}` })}
                          </span>
                          <span className={`ml-3 ${pathname === item.href ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{item.name}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={handleBackToMain}
              >
                <ChevronLeft className="w-4 h-4 mr-2 text-[#D0BFB4]" />
                Back to Main Page
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 mr-2 text-[#D0BFB4]" /> : <Moon className="w-4 h-4 mr-2 text-[#D0BFB4]" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </nav>

          <div className="flex-1 flex flex-col min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6 text-[#D0BFB4]" />
                </Button>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <ConnectWalletButton />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5 text-[#D0BFB4]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>New Blink received</DropdownMenuItem>
                      <DropdownMenuItem>Blink sold on marketplace</DropdownMenuItem>
                      <DropdownMenuItem>Staking rewards available</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png" alt="@bark_protocol" />
                        <AvatarFallback>BP</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4 text-[#D0BFB4]" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Coins className="mr-2 h-4 w-4 text-[#D0BFB4]" />
                        <span>Billing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4 text-[#D0BFB4]" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4 text-[#D0BFB4]" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            <main className="flex-1 p-4 sm:p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} BARK Protocol. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </TooltipProvider>
    </SolanaWalletProvider>
  )
}