import React from 'react'
import { DonationForm } from './payment-form/components/donation-form'

const Donations: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Support Our Cause</h1>
      <p className="text-gray-600 mb-6">
        Your donations help us continue providing valuable services to our community.
      </p>

      <DonationForm />
    </div>
  )
}

export default Donations
