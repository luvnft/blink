'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Plus, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { motion } from 'framer-motion'

interface Campaign {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  creator: string
  endDate: Date
}

export default function CrowdfundingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', goal: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (connected) {
      fetchCampaigns()
    }
  }, [connected])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      // In a real application, you would fetch the actual campaigns from your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          title: 'BARK Blink Community Event',
          description: 'Help us organize a community meetup for BARK Blink enthusiasts!',
          goal: 5000,
          raised: 3500,
          creator: '5CreatorAddressHere...',
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
          id: '2',
          title: 'BARK Blink NFT Art Contest',
          description: 'Fund prizes for our upcoming NFT art contest featuring BARK Blink themes.',
          goal: 2000,
          raised: 1200,
          creator: '5AnotherCreatorAddressHere...',
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        },
      ]
      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast({
        title: "Error",
        description: "Failed to fetch campaigns. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a campaign.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real application, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      const newCampaignData: Campaign = {
        id: (campaigns.length + 1).toString(),
        title: newCampaign.title,
        description: newCampaign.description,
        goal: parseFloat(newCampaign.goal),
        raised: 0,
        creator: publicKey.toBase58(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
      setCampaigns([...campaigns, newCampaignData])
      setNewCampaign({ title: '', description: '', goal: '' })
      toast({
        title: "Campaign Created",
        description: "Your crowdfunding campaign has been successfully created.",
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonate = async (campaignId: string, amount: number) => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to donate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real application, you would send this donation to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === campaignId) {
          return { ...campaign, raised: campaign.raised + amount }
        }
        return campaign
      })
      setCampaigns(updatedCampaigns)
      toast({
        title: "Donation Successful",
        description: `You have successfully donated ${amount} BARK to the campaign.`,
      })
    } catch (error) {
      console.error('Error donating:', error)
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/" passHref>
        <Button variant="ghost" className="mb-4 hover:bg-primary/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">BARK Blink Crowdfunding</CardTitle>
            <CardDescription>Support community projects or create your own campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {connected ? (
              <>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Create New Campaign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Campaign Title</Label>
                        <Input
                          id="title"
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                          required
                          placeholder="Enter campaign title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Campaign Description</Label>
                        <Textarea
                          id="description"
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                          required
                          placeholder="Enter campaign description"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goal">Funding Goal (BARK)</Label>
                        <Input
                          id="goal"
                          type="number"
                          value={newCampaign.goal}
                          onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                          required
                          placeholder="Enter funding goal"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Campaign
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <CardTitle>{campaign.title}</CardTitle>
                        <CardDescription>Created by: {campaign.creator}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{campaign.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {((campaign.raised / campaign.goal) * 100).toFixed(2)}%</span>
                            <span>{campaign.raised} / {campaign.goal} BARK</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.goal) * 100} />
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Ends on: {campaign.endDate.toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          const amount = parseFloat((e.target as HTMLFormElement).amount.value)
                          handleDonate(campaign.id, amount)
                        }} className="flex w-full space-x-2">
                          <Input
                            name="amount"
                            type="number"
                            placeholder="Amount to donate"
                            required
                            min="0"
                            step="0.01"
                          />
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                            <span className="sr-only">Donate</span>
                          </Button>
                        </form>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 text-lg text-muted-foreground">Please connect your wallet to view and create crowdfunding campaigns.</p>
                <ConnectWalletButton />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}