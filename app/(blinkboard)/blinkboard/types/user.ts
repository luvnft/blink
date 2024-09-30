export interface UserProfile {
    userId: string
    username: string
    email: string
    avatarUrl: string
    joinDate: number
  }
  
  export interface UserActivity {
    activityId: string
    userId: string
    actionType: 'nft_mint' | 'vote_cast' | 'transaction'
    date: number
    details: string // Specific details about the action
  }
  
  export interface AccountOverview {
    userId: string
    balance: number
    recentTransactions: Transaction[]
    unclaimedRewards: number
    pendingNFTs: number
  }
  
  export interface Transaction {
    id: string
    date: number
    amount: number
    currency: 'SOL' | 'USD'
    status: 'completed' | 'pending' | 'failed'
  }
  