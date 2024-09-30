import React, { useState } from 'react'
import { PaymentSummary } from './payment-summary'
import { useDonation } from '../hooks/use-donation'

const SuccessMessage: React.FC = () => (
  <div className="p-4 bg-green-100 border border-green-400 rounded-md">
    <h2 className="text-lg font-semibold">Thank You!</h2>
    <p>Your donation has been successfully processed.</p>
  </div>
)

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 bg-red-100 border border-red-400 rounded-md">
    <h2 className="text-lg font-semibold">Error!</h2>
    <p>{message}</p>
  </div>
)

export const DonationForm: React.FC = () => {
  const { handleSubmit, donationAmount, setDonationAmount, processing } = useDonation()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state

    try {
      const success = await handleSubmit()
      setFormSubmitted(success)
      if (!success) {
        setError('Failed to process your donation. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  if (formSubmitted) {
    return <SuccessMessage />
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 bg-gray-100 rounded-md shadow">
      <h2 className="text-xl font-semibold">Donate to Support Us</h2>

      <div className="flex flex-col space-y-2">
        <label htmlFor="amount" className="font-medium">Donation Amount</label>
        <input
          id="amount"
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
          className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          required
          min="1"
          placeholder="Enter amount"
        />
      </div>

      <PaymentSummary amount={donationAmount} />

      {error && <ErrorMessage message={error} />}

      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200"
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Donate Now'}
      </button>
    </form>
  )
}
