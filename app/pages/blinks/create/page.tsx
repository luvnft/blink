import React from 'react'
import { CreateBlink } from '@/components/create-blink'

export const metadata = {
  title: 'Create a Blink | BARK Blinks',
  description: 'Create your own unique Blink on the Solana network.',
}

export default function CreateBlinkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Create Your Blink</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Design and mint your own unique Blink. Customize its properties, add an image, and create something truly special on the Solana network.
      </p>
      <CreateBlink />
    </div>
  )
}