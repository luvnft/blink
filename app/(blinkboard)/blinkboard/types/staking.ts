export interface StakingPool {
    id: string
    name: string
    token: Token
    rewardToken: Token
    apy: number // Annual Percentage Yield for the staking pool
    totalStaked: number // Total amount of tokens staked in this pool
    rewardRate: number // Rate at which rewards are distributed (e.g., per block or time period)
    startDate: number // Timestamp when the pool was opened
    endDate?: number // Optional end date for time-limited pools
  }
  
  export interface StakingEvent {
    eventId: string
    userId: string
    poolId: string
    amount: number
    action: 'stake' | 'unstake'
    eventDate: number // Timestamp when the staking or unstaking occurred
  }
  
  export interface StakingReward {
    userId: string
    poolId: string
    rewardAmount: number
    rewardDate: number // Timestamp when rewards were claimed
  }
  
  export interface StakingOverview {
    userId: string
    activePools: StakingPool[]
    totalStaked: number // Total amount staked across all pools
    unclaimedRewards: number // Total rewards pending to be claimed
  }
  