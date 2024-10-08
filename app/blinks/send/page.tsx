'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send } from 'lucide-react'

interface Blink {
  id: string
  name: string
}

export default function SendBlinkPage() {
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [selectedBlink, setSelectedBlink] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (connected && publicKey) {
      fetchBlinks()
    }
  }, [connected, publicKey])

  const fetchBlinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blinks?owner=${publicKey?.toBase58()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch Blinks')
      }
      const data = await response.json()
      setBlinks(data.blinks)
    } catch (error) {
      console.error('Error fetching Blinks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your Blinks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send a Blink.",
        variant: "destructive",
      })
      return
    }

    if (!selectedBlink || !recipient) {
      toast({
        title: "Invalid input",
        description: "Please select a Blink and enter a recipient address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blinkId: selectedBlink,
          recipientAddress: recipient,
          senderAddress: publicKey.toBase58(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send Blink')
      }

      const { transaction } = await response.json()

      toast({
        title: "Blink Sent",
        description: `Successfully sent Blink to ${recipient}`,
      })

      setSelectedBlink('')
      setRecipient('')
    } catch (error) {
      console.error('Error sending Blink:', error)
      toast({
        title: "Error",
        description: "Failed to send Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Send Blink</h1>
        <p className="mb-4">Please connect your wallet to send Blinks.</p>
        <Button>Connect Wallet</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Blink</CardTitle>
          <CardDescription>Transfer a Blink to another address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendBlink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blink-select">Select Blink</Label>
              <Select value={selectedBlink} onValueChange={setSelectedBlink}>
                <SelectTrigger id="blink-select">
                  <SelectValue placeholder="Choose a Blink" />
                </SelectTrigger>
                <SelectContent>
                  {blinks.map((blink) => (
                    <SelectItem key={blink.id} value={blink.id}>
                      {blink.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSendBlink}
            disabled={isLoading || !selectedBlink || !recipient}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Blink
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}