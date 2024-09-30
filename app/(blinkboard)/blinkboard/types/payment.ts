export interface PaymentForm {
    amount: number
    currency: 'USD' | 'EUR' | 'SOL' | 'BARK' // Currencies supported
    paymentMethod: PaymentMethod
    recipientId: string
  }
  
  export interface PaymentMethod {
    type: 'credit_card' | 'crypto' | 'paypal'
    details: string // Card number, wallet address, etc.
  }
  
  export interface Donation {
    id: string
    donorId: string
    amount: number
    currency: 'USD' | 'SOL'
    date: number
    cause: string // The cause or campaign the donation supports
  }
  