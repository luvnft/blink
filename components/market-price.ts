'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

interface TokenPrice {
  symbol: string
  price: number
  change24h: number
}

export function MarketPrices() {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching prices')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((token) => (
            <div key={token.symbol} className="flex justify-between items-center">
              <span className="font-medium">{token.symbol}</span>
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
        </div>
      </CardContent>
    </Card>
  )
}