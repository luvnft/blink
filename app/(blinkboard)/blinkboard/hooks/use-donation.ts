import { useState } from 'react'
import { processDonation } from '../api/process-donation'

export const useDonation = () => {
  const [donationAmount, setDonationAmount] = useState<number>(0)
  const [processing, setProcessing] = useState<boolean>(false)

  const handleSubmit = async () => {
    setProcessing(true)
    const success = await processDonation(donationAmount)
    setProcessing(false)
    return success
  }

  return {
    donationAmount,
    setDonationAmount,
    processing,
    handleSubmit
  }
}
