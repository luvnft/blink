'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenPrice {
  symbol: string
  price: number
  change24h: number
}

const tokenIcons: { [key: string]: string } = {
  SOL: '/images/icons/sol.png',
  BARK: '/images/icons/bark.png',
  USDC: '/images/icons/usdc.png',
}

export function MarketPrices() {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPrices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://price.jup.ag/v4/price?ids=SOL,BARK,USDC')
      if (!response.ok) {
        throw new Error('Failed to fetch prices')
      }
      const data = await response.json()
      const formattedPrices: TokenPrice[] = Object.entries(data.data).map(([symbol, details]: [string, any]) => ({
        symbol,
        price: details.price,
        change24h: details.change24h
      }))
      setPrices(formattedPrices)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching prices')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Market Prices</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={fetchPrices}
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="sr-only">Refresh prices</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh prices</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[200px]"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[200px]"
            >
              <p className="text-destructive">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="prices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {prices.map((token) => (
                <div key={token.symbol} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-2">
                    <img
                      src={tokenIcons[token.symbol]}
                      alt={`${token.symbol} icon`}
                      className="w-6 h-6"
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">${token.price.toFixed(2)}</span>
                    <span className={`ml-2 ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(token.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}