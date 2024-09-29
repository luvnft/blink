'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart2, Zap, Send, Gift, Coins, ShoppingBag, Landmark, Plus, Search, Heart, CreditCard, GiftIcon, Users } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { Progress } from "@/components/ui/progress"

interface Blink {
  id: string
  name: string
  description: string
  image: string
}

interface CrowdfundingProject {
  id: string
  name: string
  description: string
  goal: number
  raised: number
  backers: number
}

export default function Blinkboard() {
  const { connected, publicKey } = useWallet()
  const [blinks, setBlinks] = useState<Blink[]>([
    { id: '1', name: 'Cosmic Blink', description: 'A mesmerizing cosmic-themed Blink', image: '/placeholder.svg?height=100&width=100' },
    { id: '2', name: 'Nature Blink', description: 'A serene nature-inspired Blink', image: '/placeholder.svg?height=100&width=100' },
    { id: '3', name: 'Tech Blink', description: 'A futuristic tech-themed Blink', image: '/placeholder.svg?height=100&width=100' },
  ])
  const [crowdfundingProjects, setCrowdfundingProjects] = useState<CrowdfundingProject[]>([
    { id: '1', name: 'Community Garden', description: 'Fund a local community garden project', goal: 5000, raised: 2500, backers: 50 },
    { id: '2', name: 'Tech Education', description: 'Provide tech education for underprivileged youth', goal: 10000, raised: 7500, backers: 150 },
  ])

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet to Access Blinkboard</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to Your Blinkboard</h1>
        <p className="text-gray-600">Manage your Blinks and explore BARK BLINK features</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Your Blinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input className="pl-8" placeholder="Search Blinks" />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Blink
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blinks.map((blink) => (
                <Card key={blink.id}>
                  <CardContent className="p-4">
                    <img src={blink.image} alt={blink.name} className="w-full h-32 object-cover rounded-md mb-2" />
                    <h3 className="font-semibold">{blink.name}</h3>
                    <p className="text-sm text-gray-600">{blink.description}</p>
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
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
                <AvatarFallback>PK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Connected Wallet</p>
                <p className="text-sm text-gray-600">{publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>Total Blinks:</strong> {blinks.length}</p>
              <p><strong>BARK Balance:</strong> 1000 BARK</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="mt-8">
        <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
          <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Create</TabsTrigger>
          <TabsTrigger value="send" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Send</TabsTrigger>
          <TabsTrigger value="use" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Use</TabsTrigger>
          <TabsTrigger value="swap" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Swap</TabsTrigger>
          <TabsTrigger value="stake" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Stake</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-4">
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
                <Button type="submit">Create Blink</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="send" className="mt-4">
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
                <Button type="submit">Send Blink</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="use" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Use Your Blinks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Heart className="h-12 w-12 text-[#D0BFB4] mb-2" />
                    <h3 className="font-semibold text-center mb-2">Donation</h3>
                    <Button size="sm">Donate Blink</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <CreditCard className="h-12 w-12 text-[#D0BFB4] mb-2" />
                    <h3 className="font-semibold text-center mb-2">Payment</h3>
                    <Button size="sm">Pay with Blink</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <GiftIcon className="h-12 w-12 text-[#D0BFB4] mb-2" />
                    <h3 className="font-semibold text-center mb-2">Gift</h3>
                    <Button size="sm">Gift Blink</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="swap" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Token swapping feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stake" className="mt-4">
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Crowdfunding Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {crowdfundingProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((project.raised / project.goal) * 100)}%</span>
                  </div>
                  <Progress value={(project.raised / project.goal) * 100} className="w-full" />
                  <div className="flex justify-between text-sm">
                    <span>{project.raised} BARK raised</span>
                    <span>{project.goal} BARK goal</span>
                  </div>
                  <p className="text-sm">{project.backers} backers</p>
                </div>
                <Button className="w-full mt-4">Support Project</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart2 className="h-12 w-12 text-[#D0BFB4] mb-2" />
            <h3 className="font-semibold text-center">Analytics</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Gift className="h-12 w-12 text-[#D0BFB4] mb-2" />
            <h3 className="font-semibold text-center">Gifts</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-12 w-12 text-[#D0BFB4] mb-2" />
            <h3 className="font-semibold text-center">Marketplace</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Landmark className="h-12 w-12 text-[#D0BFB4] mb-2" />
            <h3 className="font-semibold text-center">Governance</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}