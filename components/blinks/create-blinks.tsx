'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Loader2, Upload, Gift, DollarSign, Vote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

export const CreateBlinkTool: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [blinkType, setBlinkType] = useState('standard')
  const [image, setImage] = useState<File | null>(null)
  const [isNFT, setIsNFT] = useState(false)
  const [isDonation, setIsDonation] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [isPayment, setIsPayment] = useState(false)
  const [isPoll, setIsPoll] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
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
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('blinkType', blinkType)
      formData.append('isNFT', isNFT.toString())
      formData.append('isDonation', isDonation.toString())
      formData.append('isGift', isGift.toString())
      formData.append('isPayment', isPayment.toString())
      formData.append('isPoll', isPoll.toString())
      formData.append('ownerAddress', publicKey.toBase58())
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch('/api/v1/blinks', {
        method: 'POST',
        body: formData,
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
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <h2 className="font-inter text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 text-center">
        Create Your Blink
      </h2>
      <form onSubmit={handleCreateBlink} className="space-y-6 sm:space-y-8 bg-sand-50 shadow-xl rounded-2xl p-6 sm:p-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Blink Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter a name for your Blink"
            className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your Blink"
            className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="blinkType" className="block text-sm font-medium text-gray-700 mb-2">
            Blink Type
          </label>
          <Select value={blinkType} onValueChange={setBlinkType}>
            <SelectTrigger className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blink Image
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-sand-300 border-dashed rounded-md transition-colors duration-200 ease-in-out ${
              isDragActive ? 'border-sand-500 bg-sand-50' : 'hover:border-sand-400 hover:bg-sand-50'
            }`}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-sand-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-sand-600 hover:text-sand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sand-500"
                >
                  <span>Upload a file</span>
                  <input {...getInputProps()} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {image && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {image.name}
            </p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">NFT</span>
            <Switch
              checked={isNFT}
              onCheckedChange={setIsNFT}
              className="bg-sand-200 data-[state=checked]:bg-sand-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Donation</span>
            <Switch
              checked={isDonation}
              onCheckedChange={setIsDonation}
              className="bg-sand-200 data-[state=checked]:bg-sand-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Gift</span>
            <Switch
              checked={isGift}
              onCheckedChange={setIsGift}
              className="bg-sand-200 data-[state=checked]:bg-sand-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Payment</span>
            <Switch
              checked={isPayment}
              onCheckedChange={setIsPayment}
              className="bg-sand-200 data-[state=checked]:bg-sand-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Poll / Vote (DAO)</span>
            <Switch
              checked={isPoll}
              onCheckedChange={setIsPoll}
              className="bg-sand-200 data-[state=checked]:bg-sand-500"
            />
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <Button 
            type="submit"
            className="w-full sm:w-auto bg-sand-400 text-white transition-all text-base sm:text-lg px-6 sm:px-10 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
    </motion.div>
  )
}