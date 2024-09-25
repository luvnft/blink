'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolanaWalletProvider } from '@/components/providers/solana-wallet-provider'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/components/ui/use-toast"
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    totalBlinks: 0,
    blinksSent: 0,
    blinksReceived: 0,
    activeMerchBlinks: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Simulate API call to fetch user data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (!connected) {
          throw new Error("Wallet not connected")
        }

        // Simulated data
        setStats({
          totalBlinks: 42,
          blinksSent: 18,
          blinksReceived: 24,
          activeMerchBlinks: 3
        })

        setActivities([
          { id: '1', type: 'received', description: 'Received a gift Blink from @bark_friend1', timestamp: Date.now() - 3600000 },
          { id: '2', type: 'sent', description: 'Sent a Blink to @bark_friend2', timestamp: Date.now() - 7200000 },
          { id: '3', type: 'created', description: 'Created a new NFT Blink', timestamp: Date.now() - 86400000 },
          { id: '4', type: 'sold', description: 'Sold Merch Blink #1234', timestamp: Date.now() - 172800000 },
        ])

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [connected])

  const handleBackToMain = () => {
    router.push('/')
  }

  const handleCreateBlink = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }
    router.push('/create-blink')
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate refreshing data
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Your BlinkBoard has been updated with the latest data.",
      })
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <SolanaWalletProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image
                src={LOGO_URL}
                alt="BARK BLINK logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold text-gray-900">Blinkboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToMain}
                className="hidden sm:flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Main Page
              </Button>
              <ConnectWalletButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png" alt="@bark_protocol" />
                    <AvatarFallback>BP</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <TabsList className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {navItems.map((item) => (
                  <TabsTrigger
                    key={item.name}
                    value={item.name}
                    className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md"
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon}
                    <span className="hidden sm:inline ml-2">{item.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToMain}
                  className="flex sm:hidden items-center flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] flex-1 sm:flex-none"
                  onClick={handleCreateBlink}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Blink
                </Button>
              </div>
            </div>

            <TabsContent value="Overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Summary</span>
                      <RefreshCw 
                        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" 
                        onClick={handleRefresh}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Blinks</span>
                        <span className="font-bold">{stats.totalBlinks}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Blinks Sent</span>
                        <span className="font-bold">{stats.blinksSent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Blinks Received</span>
                        <span className="font-bold">{stats.blinksReceived}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Merch Blinks</span>
                        <span className="font-bold">{stats.activeMerchBlinks}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {activities.map((activity) => (
                        <li key={activity.id} className="flex items-center space-x-3">
                          {activity.type === 'received' && <Gift className="w-5 h-5 text-[#D0BFB4]" />}
                          {activity.type === 'sent' && <Send className="w-5 h-5 text-[#D0BFB4]" />}
                          {activity.type === 'created' && <Plus className="w-5 h-5 text-[#D0BFB4]" />}
                          {activity.type === 'sold' && <ShoppingBag className="w-5 h-5 text-[#D0BFB4]" />}
                          <div>
                            <span>{activity.description}</span>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="Tokens">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="mr-2 h-6 w-6 text-[#D0BFB4]" />
                    Your SPL Tokens
                  </CardTitle>
                  <CardDescription>Manage and track your token portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokens.map((token, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={token.icon}
                            alt={`${token.name} icon`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold">{token.name}</h3>
                            <p className="text-sm text-gray-600">Balance: {token.balance.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${token.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Value in USD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => router.push('/swap')}>
                      <ArrowLeftRight className="w-4 h-4 mr-2" />
                      Swap Tokens
                    </Button>
                    <Button onClick={() => router.push('/staking')}>
                      <Layers className="w-4 h-4 mr-2" />
                      Stake Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add other TabsContent components for NFT, Commerce, Marketplace, Staking, and Gift */}
          </Tabs>
        </main>
      </div>
    </SolanaWalletProvider>
  )
}