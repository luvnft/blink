'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Loader2, Upload, Gift, DollarSign, Vote, Sparkles, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlinkFormData {
  name: string
  description: string
  blinkType: string
  image: File | null
  isNFT: boolean
  isDonation: boolean
  isGift: boolean
  isPayment: boolean
  isPoll: boolean
}

export default function CreateBlinkPage() {
  const [formData, setFormData] = useState<BlinkFormData>({
    name: '',
    description: '',
    blinkType: 'standard',
    image: null,
    isNFT: false,
    isDonation: false,
    isGift: false,
    isPayment: false,
    isPoll: false,
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData(prev => ({ ...prev, image: acceptedFiles[0] }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, blinkType: value }))
  }

  const handleSwitchChange = (name: keyof BlinkFormData) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleCreateBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value)
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString())
        } else if (value !== null) {
          formDataToSend.append(key, value)
        }
      })
      formDataToSend.append('ownerAddress', publicKey.toBase58())

      const response = await fetch('/api/v1/blinks', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create Blink')
      }

      const data = await response.json()
      toast({
        title: "Blink created successfully!",
        description: `Your new Blink "${data.name}" has been minted.`,
      })
      router.push(`/blinks/${data.id}`)
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center text-foreground">Create Your Blink</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Design your unique Blink and share it with the world</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-6 sm:space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Blink Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter a name for your Blink"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your Blink"
                    rows={4}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blinkType">Blink Type</Label>
                  <Select value={formData.blinkType} onValueChange={handleSelectChange}>
                    <SelectTrigger id="blinkType" className="bg-background">
                      <SelectValue placeholder="Select Blink type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="limited">Limited Edition</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Blink Image</Label>
                  <div
                    {...getRootProps()}
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ease-in-out ${
                      isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {formData.image && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-muted-foreground"
                      >
                        Selected file: {formData.image.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <Label htmlFor="isNFT" className="cursor-pointer">NFT</Label>
                    </div>
                    <Switch
                      id="isNFT"
                      checked={formData.isNFT}
                      onCheckedChange={handleSwitchChange('isNFT')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <Label htmlFor="isDonation" className="cursor-pointer">Donation</Label>
                    </div>
                    <Switch
                      id="isDonation"
                      checked={formData.isDonation}
                      onCheckedChange={handleSwitchChange('isDonation')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <Label htmlFor="isGift" className="cursor-pointer">Gift</Label>
                    </div>
                    <Switch
                      id="isGift"
                      checked={formData.isGift}
                      onCheckedChange={handleSwitchChange('isGift')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <Label htmlFor="isPayment" className="cursor-pointer">Payment</Label>
                    </div>
                    <Switch
                      id="isPayment"
                      checked={formData.isPayment}
                      onCheckedChange={handleSwitchChange('isPayment')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Vote className="h-5 w-5 text-primary" />
                      <Label htmlFor="isPoll" className="cursor-pointer">Poll / Vote (DAO)</Label>
                    </div>
                    <Switch
                      id="isPoll"
                      checked={formData.isPoll}
                      onCheckedChange={handleSwitchChange('isPoll')}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center pt-4"
            >
              <Button 
                type="submit"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base sm:text-lg px-6 sm:px-10 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating || !connected}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Blink
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}