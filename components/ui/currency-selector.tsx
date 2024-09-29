'use client'

import { useState, useEffect } from 'react'
import Image from "next/legacy/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface Currency {
  symbol: string
  name: string
  icon: string
  rate: number
}

const currencies: Currency[] = [
  { symbol: 'SOL', name: 'Solana', icon: '/images/icons/sol.png', rate: 1 },
  { symbol: 'BARK', name: 'Bark', icon: '/images/icons/bark.png', rate: 0.1 },
  { symbol: 'USDC', name: 'USD Coin', icon: '/images/icons/usdc.png', rate: 20 },
]

export function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])
  const [amount, setAmount] = useState<number>(1)

  useEffect(() => {
    // You could fetch real-time rates here
    console.log(`Selected currency: ${selectedCurrency.symbol}`)
  }, [selectedCurrency])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Select
            value={selectedCurrency.symbol}
            onValueChange={(value) => setSelectedCurrency(currencies.find(c => c.symbol === value) || currencies[0])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.symbol} value={currency.symbol}>
                  <div className="flex items-center">
                    <Image
                      src={currency.icon}
                      alt={currency.name}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    {currency.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-2xl font-bold">{selectedCurrency.symbol}</div>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-1/2 p-2 text-lg border rounded"
          />
          <div className="text-lg">
            = {(amount * selectedCurrency.rate).toFixed(2)} SOL
          </div>
        </div>
      </CardContent>
    </Card>
  )
}