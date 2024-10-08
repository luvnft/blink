'use client'

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MicroPaymentFormProps {
  onSubmit: (recipient: string, amount: number) => Promise<void>
}

export function MicroPaymentForm({ onSubmit }: MicroPaymentFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { connected } = useWallet()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment.",
        variant: "destructive",
      })
      return
    }

    if (!recipient || !amount) {
      toast({
        title: "Invalid input",
        description: "Please enter both recipient address and amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(recipient, parseFloat(amount))
      setRecipient('')
      setAmount('')
      toast({
        title: "Payment sent",
        description: `Successfully sent ${amount} Blinks to ${recipient}`,
      })
    } catch (error) {
      console.error('Error sending payment:', error)
      toast({
        title: "Error",
        description: "Failed to send payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send Micro Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Blinks)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min="0.000001"
              step="0.000001"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || !recipient || !amount}
        >
          {isLoading ? 'Sending...' : 'Send Payment'}
        </Button>
      </CardFooter>
    </Card>
  )
}