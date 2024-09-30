'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gift, CreditCard, Coins, Banknote, Image } from 'lucide-react'

const donationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  message: z.string().optional(),
})

const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  recipient: z.string().min(1, "Recipient is required"),
})

const crowdfundingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  goal: z.number().min(1, "Goal must be at least 1"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

const giftSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  message: z.string().optional(),
})

export default function Component() {
  const [activeTab, setActiveTab] = useState("donations")
  const [crowdfundingProgress, setCrowdfundingProgress] = useState(0)
  const [isNFTForSale, setIsNFTForSale] = useState(false)

  const { register: registerDonation, handleSubmit: handleSubmitDonation } = useForm({
    resolver: zodResolver(donationSchema),
  })

  const { register: registerPayment, handleSubmit: handleSubmitPayment } = useForm({
    resolver: zodResolver(paymentSchema),
  })

  const { register: registerCrowdfunding, handleSubmit: handleSubmitCrowdfunding } = useForm({
    resolver: zodResolver(crowdfundingSchema),
  })

  const { register: registerGift, handleSubmit: handleSubmitGift } = useForm({
    resolver: zodResolver(giftSchema),
  })

  const onDonationSubmit = (data: z.infer<typeof donationSchema>) => {
    console.log("Donation submitted:", data)
    // Here you would typically send this data to your backend
  }

  const onPaymentSubmit = (data: z.infer<typeof paymentSchema>) => {
    console.log("Payment submitted:", data)
    // Here you would typically send this data to your backend
  }

  const onCrowdfundingSubmit = (data: z.infer<typeof crowdfundingSchema>) => {
    console.log("Crowdfunding campaign created:", data)
    // Here you would typically send this data to your backend
  }

  const onGiftSubmit = (data: z.infer<typeof giftSchema>) => {
    console.log("Gift sent:", data)
    // Here you would typically send this data to your backend
  }

  const handleNFTSaleToggle = () => {
    setIsNFTForSale(!isNFTForSale)
    // Here you would typically update the NFT status in your backend
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Financial</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
          <TabsTrigger value="nft">NFT</TabsTrigger>
          <TabsTrigger value="gift">Gift</TabsTrigger>
        </TabsList>
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>Support BARK Blinks with your contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDonation(onDonationSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="donationAmount">Amount</Label>
                    <Input id="donationAmount" type="number" placeholder="Enter amount" {...registerDonation('amount', { valueAsNumber: true })} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="donationMessage">Message (optional)</Label>
                    <Input id="donationMessage" placeholder="Enter a message" {...registerDonation('message')} />
                  </div>
                </div>
                <Button type="submit" className="mt-4">Donate</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Send BARK Blinks to another user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPayment(onPaymentSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="paymentAmount">Amount</Label>
                    <Input id="paymentAmount" type="number" placeholder="Enter amount" {...registerPayment('amount', { valueAsNumber: true })} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="paymentRecipient">Recipient</Label>
                    <Input id="paymentRecipient" placeholder="Enter recipient's address" {...registerPayment('recipient')} />
                  </div>
                </div>
                <Button type="submit" className="mt-4">Send Payment</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crowdfunding">
          <Card>
            <CardHeader>
              <CardTitle>Start a Crowdfunding Campaign</CardTitle>
              <CardDescription>Raise funds for your BARK Blinks project</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCrowdfunding(onCrowdfundingSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="crowdfundingTitle">Campaign Title</Label>
                    <Input id="crowdfundingTitle" placeholder="Enter campaign title" {...registerCrowdfunding('title')} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="crowdfundingGoal">Funding Goal</Label>
                    <Input id="crowdfundingGoal" type="number" placeholder="Enter funding goal" {...registerCrowdfunding('goal', { valueAsNumber: true })} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="crowdfundingDescription">Description</Label>
                    <Input id="crowdfundingDescription" placeholder="Describe your campaign" {...registerCrowdfunding('description')} />
                  </div>
                </div>
                <Button type="submit" className="mt-4">Start Campaign</Button>
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Label>Campaign Progress</Label>
                <Progress value={crowdfundingProgress} className="mt-2" />
                <p className="text-sm text-gray-500 mt-1">{crowdfundingProgress}% funded</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="nft">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your NFT</CardTitle>
              <CardDescription>View and update your BARK Blinks NFT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="NFT" />
                  <AvatarFallback><Image className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">BARK Blink #1234</h3>
                  <p className="text-sm text-gray-500">Owned by you</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Switch id="nft-sale" checked={isNFTForSale} onCheckedChange={handleNFTSaleToggle} />
                <Label htmlFor="nft-sale">List for sale</Label>
              </div>
              {isNFTForSale && (
                <div className="mt-4">
                  <Label htmlFor="nftPrice">Sale Price</Label>
                  <Input id="nftPrice" type="number" placeholder="Enter price" className="mt-1" />
                  <Button className="mt-2">Confirm Listing</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gift">
          <Card>
            <CardHeader>
              <CardTitle>Send a Gift</CardTitle>
              <CardDescription>Send BARK Blinks as a gift to another user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitGift(onGiftSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="giftRecipient">Recipient</Label>
                    <Input id="giftRecipient" placeholder="Enter recipient's address" {...registerGift('recipient')} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="giftMessage">Message (optional)</Label>
                    <Input id="giftMessage" placeholder="Enter a message" {...registerGift('message')} />
                  </div>
                </div>
                <Button type="submit" className="mt-4">Send Gift</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,678</div>
            <p className="text-xs text-muted-foreground">+10.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFTs Owned</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 listed for sale</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}