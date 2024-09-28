'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolanaWalletProvider } from '@/components/solana-wallet-provider'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from "@/components/ui/use-toast"
import { 
  Coins, 
  Gift, 
  Send, 
  Plus, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ShoppingBag,
  Truck,
  CreditCard,
  PlusCircle,
  ArrowLeftRight,
  Home,
  Palette,
  RefreshCw,
  Layers,
  Loader2,
  AlertCircle
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const LOGO_URL = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

const navItems = [
  { name: 'Overview', icon: <BarChart2 className="w-4 h-4 mr-2" />, href: '/blinkboard' },
  { name: 'NFT', icon: <Gift className="w-4 h-4 mr-2" />, href: '/nft/gallery' },
  { name: 'Tokens', icon: <Coins className="w-4 h-4 mr-2" />, href: '/swap' },
  { name: 'Commerce', icon: <ShoppingBag className="w-4 h-4 mr-2" />, href: '/commerce' },
  { name: 'Marketplace', icon: <Palette className="w-4 h-4 mr-2" />, href: '/nft/marketplace' },
  { name: 'Staking', icon: <Layers className="w-4 h-4 mr-2" />, href: '/staking' },
  { name: 'Gift', icon: <Gift className="w-4 h-4 mr-2" />, href: '/gift' },
]

const tokens = [
  { name: 'BARK', icon: '/images/icons/bark.png', balance: 1000, value: 100 },
  { name: 'USDC', icon: '/images/icons/usdc.png', balance: 500, value: 500 },
  { name: 'SOL', icon: '/images/icons/sol.png', balance: 10, value: 1000 },
]

interface Activity {
  id: string
  type: 'received' | 'sent' | 'created' | 'sold'
  description: string
  timestamp: number
}

export default function BlinkBoard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activities, setActivities] =