import React from 'react'
import { SwapForm } from './components/swap-form'

const SwapPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Token Swap</h1>
      <p className="text-gray-600">Swap one token for another on the Solana blockchain.</p>

      {/* Swap form */}
      <SwapForm />
    </div>
  )
}

export default SwapPage
