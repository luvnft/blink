'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SolanaWalletProvider } from '@/components/SolanaWalletProvider'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

const tokens = ['SOL', 'BARK', 'USDC']

export default function Swap() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [amount, setAmount] = useState('')

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement swap logic here
    console.log('Swapping:', { fromToken, toToken, amount })
    alert('Swap executed successfully!')
  }

  return (
    <SolanaWalletProvider>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Swap Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSwap} className="space-y-4">
              <div>
                <Label htmlFor="fromToken">From</Label>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token} value={token}>{token}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="toToken">To</Label>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token} value={token}>{token}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Swap</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SolanaWalletProvider>
  )
}