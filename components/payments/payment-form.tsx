'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from 'lucide-react'

interface PaymentFormProps {
  onSubmit: (recipient: string, amount: number) => Promise<void>
  isLoading: boolean
  selectedPaymentMethod: string
}

export function PaymentForm({ onSubmit, isLoading, selectedPaymentMethod }: PaymentFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (recipient && amount) {
      await onSubmit(recipient, parseFloat(amount))
      setRecipient('')
      setAmount('')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Payment</CardTitle>
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
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({selectedPaymentMethod.toUpperCase()})</Label>
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Payment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}