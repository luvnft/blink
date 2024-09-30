'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useToastContext } from '@/components/ui/toast-provider'
import { motion } from "framer-motion"

export default function CreateBlinkPage() {
  const router = useRouter()
  const { connected } = useWallet()
  const { toast } = useToastContext()
  const [isLoading, setIsLoading] = useState(false)
  const [blinkData, setBlinkData] = useState({
    name: '',
    description: '',
    type: 'standard',
    supply: '1',
    royalties: '5',
    isTransferable: true,
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBlinkData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((value: string) => {
    setBlinkData(prev => ({ ...prev, type: value }))
  }, [])

  const handleSwitchChange = useCallback((checked: boolean) => {
    setBlinkData(prev => ({ ...prev, isTransferable: checked }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!blinkData.name || !blinkData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Here you would typically call an API to create the Blink
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success!",
        description: `Your Blink "${blinkData.name}" has been created.`,
        variant: "success",
      })
      router.push('/blinkboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [blinkData.name, blinkData.description, toast, router])

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Connect Your Wallet to Create a Blink</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Blink</CardTitle>
          <CardDescription>Fill in the details to create your new Blink</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Blink Name</Label>
              <Input
                id="name"
                name="name"
                value={blinkData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter Blink name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={blinkData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your Blink"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Blink Type</Label>
              <Select value={blinkData.type} onValueChange={handleSelectChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supply">Supply</Label>
              <Input
                id="supply"
                name="supply"
                type="number"
                value={blinkData.supply}
                onChange={handleInputChange}
                min="1"
                max="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="royalties">Royalties (%)</Label>
              <Input
                id="royalties"
                name="royalties"
                type="number"
                value={blinkData.royalties}
                onChange={handleInputChange}
                min="0"
                max="15"
                step="0.5"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isTransferable"
                checked={blinkData.isTransferable}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isTransferable">Transferable</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Blink'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}