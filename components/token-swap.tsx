'use client'

import { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightLeft, Loader2, Info } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const tokenIcons = {
  SOL: '/images/icons/sol.png',
  BARK: '/images/icons/bark.png',
  USDC: '/images/icons/usdc.png',
}

declare global {
  interface Window {
    Jupiter: any;
  }
}

export function TokenSwap() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [jupiterLoaded, setJupiterLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://terminal.jup.ag/main-v2.js'
    script.async = true
    script.onload = () => setJupiterLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleSwap = useCallback(async () => {
    if (!wallet.publicKey || !jupiterLoaded) {
      toast({
        title: "Cannot perform swap",
        description: wallet.publicKey ? "Jupiter Terminal is not loaded yet." : "Please connect your wallet to swap tokens.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const jupiter = new window.Jupiter({
        connection,
        cluster: 'mainnet-beta',
        userPublicKey: wallet.publicKey.toBase58(),
      })

      await jupiter.init()

      const result = await jupiter.swap({
        inputMint: fromToken,
        outputMint: toToken,
        amount,
        slippage: 1, // 1% slippage
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Swap successful",
        description: `Swapped ${amount} ${fromToken} to ${toToken}`,
        variant: "success",
      })
    } catch (error) {
      console.error('Error swapping tokens:', error)
      toast({
        title: "Swap failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [wallet.publicKey, jupiterLoaded, connection, fromToken, toToken, amount, toast])

  const TokenIcon = ({ token }: { token: string }) => (
    token ? (
      <Image
        src={tokenIcons[token]}
        alt={`${token} icon`}
        width={24}
        height={24}
        className="mr-2"
      />
    ) : null
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-card shadow-lg border border-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Swap Tokens</CardTitle>
          <CardDescription className="text-center">Powered by Jupiter Terminal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fromToken" className="block text-sm font-medium text-foreground">From Token</label>
              <Select onValueChange={setFromToken} value={fromToken}>
                <SelectTrigger id="fromToken" aria-label="Select from token" className="w-full">
                  <div className="flex items-center">
                    <TokenIcon token={fromToken} />
                    <SelectValue placeholder="Select token" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(tokenIcons).map((token) => (
                    <SelectItem key={token} value={token} className="flex items-center">
                      <TokenIcon token={token} />
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-t border-primary/20 w-full"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  <ArrowRightLeft className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="toToken" className="block text-sm font-medium text-foreground">To Token</label>
              <Select onValueChange={setToToken} value={toToken}>
                <SelectTrigger id="toToken" aria-label="Select to token" className="w-full">
                  <div className="flex items-center">
                    <TokenIcon token={toToken} />
                    <SelectValue placeholder="Select token" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(tokenIcons).map((token) => (
                    <SelectItem key={token} value={token} className="flex items-center">
                      <TokenIcon token={token} />
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-foreground">Amount</label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Enter amount to swap"
                className="pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="text-sm font-medium text-muted-foreground px-3">
                  {fromToken || 'Token'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleSwap}
            disabled={isLoading || !fromToken || !toToken || !amount || !jupiterLoaded}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Swapping...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-5 w-5" />
                Swap Tokens
              </>
            )}
          </Button>
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Info className="h-4 w-4 mr-1" />
                    About Jupiter Terminal
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click for more information about Jupiter Terminal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground">
            Learn more about Jupiter Terminal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Jupiter Terminal</DialogTitle>
            <DialogDescription>
              Jupiter Terminal is a powerful token swapping interface that provides:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>• Access to deep liquidity across multiple DEXes</p>
            <p>• Optimal routing for the best swap rates</p>
            <p>• Support for a wide range of tokens on Solana</p>
            <p>• Low fees and minimal slippage</p>
            <p>• Integration with various wallets</p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}