'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Transaction {
  id: string
  amount: number
  recipient: string
  timestamp: number
  type: 'send' | 'receive'
}

export default function PaymentsPage() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, connected, sendTransaction } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
      fetchTransactions()
    }
  }, [connected, publicKey])

  const fetchBalance = async () => {
    if (!publicKey) return
    try {
      const response = await fetch(`/api/solana/balance?address=${publicKey.toBase58()}`)
      const data = await response.json()
      setBalance(data.balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
      toast({
        title: "Error",
        description: "Failed to fetch balance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchTransactions = async () => {
    if (!publicKey) return
    try {
      const response = await fetch(`/api/solana/transactions?address=${publicKey.toBase58()}`)
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch transaction history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey || !sendTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send payments.",
        variant: "destructive",
      })
      return
    }

    if (!amount || !recipient) {
      toast({
        title: "Invalid input",
        description: "Please enter both amount and recipient address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const recipientPubkey = new PublicKey(recipient)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL

      const transaction = await fetch('/api/solana/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: lamports, recipient: recipientPubkey.toBase58() }),
      }).then(res => res.json())

      const signature = await sendTransaction(transaction, null)
      await fetch(`/api/solana/confirm-transaction?signature=${signature}`)

      toast({
        title: "Payment sent",
        description: `Successfully sent ${amount} SOL to ${recipient}`,
      })

      setAmount('')
      setRecipient('')
      fetchBalance()
      fetchTransactions()
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {connected ? (
              <form onSubmit={handleSendPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SOL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter Solana address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Payment'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="mb-4">Connect your wallet to send payments</p>
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Info</CardTitle>
          </CardHeader>
          <CardContent>
            {connected && publicKey ? (
              <div className="space-y-4">
                <div>
                  <Label>Wallet Address</Label>
                  <p className="font-mono text-sm break-all">{publicKey.toBase58()}</p>
                </div>
                <div>
                  <Label>Balance</Label>
                  <p className="text-2xl font-bold">{balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
                </div>
              </div>
            ) : (
              <p className="text-center">Connect your wallet to view balance</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={fetchBalance} disabled={!connected || isLoading} className="w-full">
              Refresh Balance
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {connected ? (
            transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.map((tx) => (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {tx.type === 'send' ? (
                        <ArrowUpRight className="text-red-500" />
                      ) : (
                        <ArrowDownLeft className="text-green-500" />
                      )}
                      <div>
                        <p className="font-semibold">{tx.amount} SOL</p>
                        <p className="text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm font-mono truncate max-w-[200px]">{tx.recipient}</p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No transactions found</p>
            )
          ) : (
            <p className="text-center">Connect your wallet to view transaction history</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}