'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Gift, Loader2, ArrowRight, Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export const GiftBlink: React.FC = () => {
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [message, setMessage] = useState('')
  const [occasion, setOccasion] = useState('')
  const [blinkType, setBlinkType] = useState('standard')
  const [image, setImage] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  const onDrop = (acceptedFiles: File[]) => {
    setImage(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  })

  const handleCreateGiftBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a gift Blink.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Here you would implement the logic to create a gift Blink on the blockchain
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Gift Blink created successfully!",
        description: `Your gift Blink for ${recipientName} has been created and sent.`,
      })

      // Reset form after successful creation
      setRecipientName('')
      setRecipientAddress('')
      setMessage('')
      setOccasion('')
      setBlinkType('standard')
      setImage(null)
    } catch (error) {
      console.error('Error creating gift Blink:', error)
      toast({
        title: "Error",
        description: "Failed to create gift Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-card shadow-xl rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
          <Gift className="mr-2 h-8 w-8 text-[#D0BFB4]" />
          Create a Gift Blink
        </h2>
        <form onSubmit={handleCreateGiftBlink} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-muted-foreground mb-1">
                Recipient's Name
              </label>
              <Input
                id="recipientName"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                placeholder="Enter recipient's name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-muted-foreground mb-1">
                Recipient's Solana Address
              </label>
              <Input
                id="recipientAddress"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
                placeholder="Enter recipient's Solana address"
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
              Gift Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a personal message for your gift"
              className="w-full"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-muted-foreground mb-1">
                Occasion
              </label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="justBecause">Just Because</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="blinkType" className="block text-sm font-medium text-muted-foreground mb-1">
                Blink Type
              </label>
              <Select value={blinkType} onValueChange={setBlinkType}>
                <SelectTrigger className="w-full">
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
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Gift Image (optional)
            </label>
            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ease-in-out ${
                isDragActive ? 'border-[#D0BFB4] bg-[#D0BFB4]/10' : 'border-input hover:border-[#D0BFB4] hover:bg-[#D0BFB4]/10'
              }`}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-[#D0BFB4]" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-[#D0BFB4] hover:text-[#D0BFB4]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#D0BFB4]"
                  >
                    <span>Upload an image</span>
                    <input {...getInputProps()} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {image && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected file: {image.name}
              </p>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit"
              className="w-full bg-[#D0BFB4] text-white hover:bg-[#D0BFB4]/90 transition-all text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating || !connected}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Gift Blink...
                </>
              ) : (
                <>
                  Create and Send Gift Blink
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}