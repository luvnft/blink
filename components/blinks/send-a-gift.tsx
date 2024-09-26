'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Gift, Loader2, ArrowRight } from 'lucide-react'

export const CreateAGift: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a gift.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Here you would implement the logic to create a gift on the blockchain
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Gift created successfully!",
        description: `Your gift has been sent to ${recipientAddress}.`,
      })
    } catch (error) {
      console.error('Error creating gift:', error)
      toast({
        title: "Error",
        description: "Failed to create gift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Gift className="mr-2 h-8 w-8" style={{ color: '#D0BFB4' }} />
          Create a Gift
        </h2>
        <form onSubmit={handleCreateGift} className="space-y-6">
          <div>
            <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <Input
              id="recipientAddress"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
              placeholder="Enter recipient's Solana address"
              className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (SOL)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="Enter amount in SOL"
              className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Gift Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message for the recipient"
              className="w-full px-3 py-2 border border-sand-300 rounded-md focus:ring-sand-500 focus:border-sand-500"
              rows={4}
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit"
              className="w-full bg-sand-400 text-white transition-all text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating || !connected}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Gift...
                </>
              ) : (
                <>
                  Send Gift
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