'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PaymentForm() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('SOL')

  const handlePayment = async () => {
    // TODO: Implement actual payment logic
    const response = await fetch('/api/v1/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), currency }),
    })
    const result = await response.json()
    console.log(result)
    // TODO: Handle the payment result (e.g., show success message, update balances)
  }

  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SOL">SOL</SelectItem>
          <SelectItem value="USDC">USDC</SelectItem>
          <SelectItem value="BARK">BARK</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handlePayment}>Make Payment</Button>
    </div>
  )
}