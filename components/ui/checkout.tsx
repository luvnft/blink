'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface CheckoutProps {
  amount: number
  currency: string
}

export function Checkout({ amount, currency }: CheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    })

    if (error) {
      toast({
        title: 'Payment failed',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Payment successful',
        description: 'Your payment has been processed successfully.',
      })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <PaymentElement />
      </div>
      <Button type="submit" disabled={isLoading || !stripe || !elements} className="w-full">
        {isLoading ? 'Processing...' : `Pay ${amount / 100} ${currency.toUpperCase()}`}
      </Button>
    </form>
  )
}