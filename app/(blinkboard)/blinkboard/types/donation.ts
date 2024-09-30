export interface Donation {
    id: string
    donorId: string
    amount: number
    currency: 'USDC' | 'SOL'
    date: number // Timestamp when the donation was made
    causeId: string // The cause or campaign this donation supports
  }
  
  export interface Donor {
    id: string
    name: string
    email: string
    profileUrl?: string // Optional profile image for the donor
  }
  
  export interface Cause {
    id: string
    title: string
    description: string
    targetAmount: number // The goal amount for the cause
    currentAmount: number // Current donation sum for the cause
    startDate: number // Start of the campaign
    endDate: number // End of the campaign
  }
  
  export interface DonationCampaign {
    id: string
    name: string
    causes: Cause[]
    totalDonations: number // Total amount donated to this campaign
  }
  