'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { BarChart2, Zap, Send, Gift, Coins, ShoppingBag, Landmark, Plus, Search, ExternalLink } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import Link from 'next/link'

interface Blink {
  id: string
  name: string
  description: string
  type: string
}

export default function Blinkboard() {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [blinks, setBlinks] = useState<Blink[]>([
    { id: '1', name: 'Cosmic Blink', description: 'A mesmerizing cosmic-themed Blink', type: 'NFT' },
    { id: '2', name: 'Nature Blink', description: 'A serene nature-inspired Blink', type: 'Standard' },
    { id: '3', name: 'Tech Blink', description: 'A futuristic tech-themed Blink', type: 'Premium' },
  ])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])

  const handleCreateBlink = () => {
    router.push('/blinks/create')
  }

  const handleSendBlink = () => {
    toast({
      title: "Send Blink",
      description: "This feature is coming soon!",
    })
  }

  const filteredBlinks = blinks.filter(blink => 
    blink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blink.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet to Access Blinkboard</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Blinkboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Your Blinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-grow mr-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  className="pl-8" 
                  placeholder="Search Blinks" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateBlink}>
                <Plus className="mr-2 h-4 w-4" /> Create Blink
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlinks.map((blink) => (
                <Card key={blink.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{blink.name}</h3>
                    <p className="text-sm text-gray-600">{blink.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Type: {blink.type}</p>
                    <Link href={`/blinks/${blink.id}`} passHref>
                      <Button variant="link" className="mt-2 p-0">
                        View Details <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Connected Wallet:</strong></p>
              <p className="text-sm text-gray-600">{publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}</p>
              <p><strong>Total Blinks:</strong> {blinks.length}</p>
              <p><strong>BARK Balance:</strong> 1000 BARK</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="mt-8">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="stake">Stake</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Blink</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="blinkName">Blink Name</Label>
                  <Input id="blinkName" placeholder="Enter Blink name" />
                </div>
                <div>
                  <Label htmlFor="blinkDescription">Description</Label>
                  <Input id="blinkDescription" placeholder="Describe your Blink" />
                </div>
                <Button onClick={handleCreateBlink}>Create Blink</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send a Blink</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input id="recipient" placeholder="Enter recipient's Solana address" />
                </div>
                <div>
                  <Label htmlFor="blinkToSend">Select Blink to Send</Label>
                  <select id="blinkToSend" className="w-full p-2 border rounded">
                    {blinks.map((blink) => (
                      <option key={blink.id} value={blink.id}>{blink.name}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleSendBlink}>Send Blink</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="swap">
          <Card>
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Token swapping feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stake">
          <Card>
            <CardHeader>
              <CardTitle>Stake BARK Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Staking feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart2 className="h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold text-center">Analytics</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Gift className="h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold text-center">Gifts</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold text-center">Marketplace</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Landmark className="h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold text-center">Governance</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}