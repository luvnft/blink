export interface Token {
    id: string
    name: string
    symbol: string
    decimals: number
    contractAddress: string // Address of the token contract
  }
  
  export interface Swap {
    id: string
    userId: string
    fromToken: Token
    toToken: Token
    amount: number // Amount being swapped
    rate: number // Exchange rate between the two tokens
    swapDate: number // Timestamp when the swap occurred
    status: 'pending' | 'completed' | 'failed'
  }
  
  export interface SwapHistory {
    userId: string
    swaps: Swap[]
  }
  
  export interface SwapRate {
    fromToken: Token
    toToken: Token
    rate: number // Current exchange rate
  }
  