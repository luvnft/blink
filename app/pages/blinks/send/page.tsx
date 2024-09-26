import React from 'react'
import { CreateBlink } from '@/components/blinks/send-blink'

export const metadata = {
  title: 'Send a Blink | BARK Blinks',
  description: 'Send your Blinks to friends, family, or fellow collectors on the Solana network.',
}

export default function SendBlinkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Send Your Blink</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Seamlessly transfer your Blinks to friends, family, or fellow collectors on the Solana network. Choose a Blink to send or create a new one on the fly.
      </p>
      <SendBlink />
    </div>
  )
}