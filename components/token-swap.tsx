'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

export function TokenSwap() {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSwap = async () => {
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/swap-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromToken, toToken, amount, userPublicKey: publicKey.toString() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create swap transaction')
      }

      const { transaction: serializedTransaction } = await response.json()
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))

      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Swap successful",
        description: `Swapped ${amount} ${fromToken} to ${toToken}`,
      })
    } catch (error) {
      console.error('Error swapping tokens:', error)
      toast({
        title: "Swap failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Swap Tokens</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fromToken" className="block text-sm font-medium text-gray-700 mb-1">From Token</label>
          <Select onValueChange={setFromToken} value={fromToken}>
            <SelectTrigger id="fromToken" aria-label="Select from token">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="BARK">BARK</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="toToken" className="block text-sm font-medium text-gray-700 mb-1">To Token</label>
          <Select onValueChange={setToToken} value={toToken}>
            <SelectTrigger id="toToken" aria-label="Select to token">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="BARK">BARK</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Enter amount to swap"
          />
        </div>
        <Button
          onClick={handleSwap}
          disabled={isLoading || !fromToken || !toToken || !amount}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRightLeft className="mr-2 h-4 w-4" />
          )}
          Swap Tokens
        </Button>
      </div>
    </div>
  )
}