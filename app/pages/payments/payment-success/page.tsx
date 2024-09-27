'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing')
  const searchParams = useSearchParams()
  const stripe = useStripe()

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = searchParams.get('payment_intent_client_secret')

    if (clientSecret) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent?.status) {
            case 'succeeded':
              setStatus('success')
              break
            case 'processing':
              setStatus('processing')
              break
            default:
              setStatus('error')
              break
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          setStatus('error')
        })
    }
  }, [stripe, searchParams])

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      {status === 'success' && (
        <div>
          <p className="text-green-600 mb-4">Your payment was successful!</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      )}
      {status === 'processing' && <p>Your payment is being processed...</p>}
      {status === 'error' && (
        <div>
          <p className="text-red-600 mb-4">There was an error processing your payment. Please try again.</p>
          <Button asChild>
            <Link href="/checkout">Return to Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  )
}