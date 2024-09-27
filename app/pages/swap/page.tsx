'use client'

import { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Loader2, RefreshCw, AlertTriangle, ArrowUpDown } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { constants } from 'buffer'

interface TokenSwapProps {
  onError: (error: string) => void
}

const tokenList = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', coingeckoId: 'solana', icon: '/images/sol.png' },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', coingeckoId: 'usd-coin', icon: '/images/usdc.png' },
  { symbol: 'BARK', mint: '2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg', coingeckoId: 'bark', icon: '/images/bark.png' },
]

export function TokenSwap({ onError }: TokenSwapProps) {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [isPriceFetching, setIsPriceFetching] = useState(false)
  const [swapRoute, setSwapRoute] = useState<any>(null)
  const [slippage, setSlippage] = useState(0.5)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})

  const fetchTokenPrices = useCallback(async () => {
    try {
      const ids = tokenList.map(token => token.coingeckoId).join(',')
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      if (!response.ok) throw new Error('Failed to fetch token prices')
      const data = await response.json()
      const prices: Record<string, number> = {}
      tokenList.forEach(token => {
        prices[token.symbol] = data[token.coingeckoId]?.usd || 0
      })
      setTokenPrices(prices)
    } catch (error) {
      console.error('Error fetching token prices:', error)
      onError('Failed to fetch token prices')
    }
  }, [onError])

  useEffect(() => {
    fetchTokenPrices()
    const interval = setInterval(fetchTokenPrices, 60000) // Refresh prices every minute
    return () => clearInterval(interval)
  }, [fetchTokenPrices])

  const fetchSwapRoute = useCallback(async () => {
    if (!fromToken || !toToken || !amount || !publicKey) return

    setIsPriceFetching(true)
    try {
      const fromMint = tokenList.find(t => t.symbol === fromToken)?.mint
      const toMint = tokenList.find(t => t.symbol === toToken)?.mint
      if (!fromMint || !toMint) throw new Error('Invalid token selection')

      const response = await fetch(`/api/v1/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputMint: fromMint,
          outputMint: toMint,
          amount: parseFloat(amount) * 1e9, // Assuming 9 decimals
          slippage,
          userPublicKey: publicKey.toString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch swap route')
      }

      const data = await response.json()
      setSwapRoute(data)
      setPrice(data.outAmount / data.inAmount)
    } catch (error) {
      console.error('Error fetching swap route:', error)
      onError('Failed to fetch swap route')
    } finally {
      setIsPriceFetching(false)
    }
  }, [fromToken, toToken, amount, publicKey, slippage, onError])

  useEffect(() => {
    if (fromToken && toToken && amount) {
      fetchSwapRoute()
    }
  }, [fromToken, toToken, amount, slippage, fetchSwapRoute])

  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !swapRoute) {
      const errorMessage = "Unable to perform swap. Please ensure your wallet is connected and a valid route is available."
      onError(errorMessage)
      toast({
        title: "Swap Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const transaction = Transaction.from(Buffer.from(swapRoute.swapTransaction, 'base64'))

      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Swap successful",
        description: `Swapped ${swapRoute.inAmount / 1e9} ${fromToken} for ${swapRoute.outAmount / 1e9} ${toToken}`,
      })

      // Reset form after successful swap
      setFromToken('')
      setToToken('')
      setAmount('')
      setPrice(null)
      setSwapRoute(null)
    } catch (error) {
      console.error('Error swapping tokens:', error)
      const errorMessage = error.message || 'An error occurred while swapping tokens'
      onError(errorMessage)
      toast({
        title: "Swap failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setAmount('')
    setPrice(null)
    setSwapRoute(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Exchange your tokens quickly and easily using Jupiter aggregator.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label htmlFor="fromToken" className="block text-sm font-medium text-gray-700 mb-1">From Token</label>
              <Select onValueChange={setFromToken} value={fromToken}>
                <SelectTrigger id="fromToken" aria-label="Select from token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokenList.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center">
                        <Image src={token.icon} alt={token.symbol} width={24} height={24} className="mr-2" />
                        {token.symbol}
                        {tokenPrices[token.symbol] && (
                          <span className="ml-2 text-sm text-gray-500">${tokenPrices[token.symbol].toFixed(2)}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTokenSwitch}
              className="mt-6"
              aria-label="Switch tokens"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <label htmlFor="toToken" className="block text-sm font-medium text-gray-700 mb-1">To Token</label>
              <Select onValueChange={setToToken} value={toToken}>
                <SelectTrigger id="toToken" aria-label="Select to token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokenList.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center">
                        <Image src={token.icon} alt={token.symbol} width={24} height={24} className="mr-2" />
                        {token.symbol}
                        {tokenPrices[token.symbol] && (
                          <span className="ml-2 text-sm text-gray-500">${tokenPrices[token.symbol].toFixed(2)}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          {isPriceFetching ? (
            <Skeleton className="h-4 w-full" />
          ) : price !== null && swapRoute ? (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Price: 1 {fromToken} = {price.toFixed(6)} {toToken}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSwapRoute}
                disabled={isPriceFetching}
                aria-label="Refresh price"
              >
                <RefreshCw className={`h-4 w-4 ${isPriceFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          ) : null}
          {swapRoute && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Swap Details</AlertTitle>
              <AlertDescription>
                You will receive approximately {(swapRoute.outAmount / 1e9).toFixed(6)} {toToken}
                <br />
                Slippage: {slippage}%
                <br />
                Route: {swapRoute.marketInfos.map((info: any) => info.label).join(' → ')}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
          </div>
          {isAdvancedMode && (
            <div className="space-y-2">
              <Label htmlFor="slippage">Slippage Tolerance: {slippage}%</Label>
              <Slider
                id="slippage"
                min={0.1}
                max={5}
                step={0.1}
                value={[slippage]}
                onValueChange={(value) => setSlippage(value[0])}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSwap}
          disabled={isLoading || !fromToken || !toToken || !amount || isPriceFetching || !swapRoute}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRightLeft className="mr-2 h-4 w-4" />
          )}
          Swap Tokens
        </Button>
      </CardFooter>
    </Card>
  )
}