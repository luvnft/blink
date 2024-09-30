export interface BlinkAction {
    id: string
    title: string
    description: string
    date: number // Timestamp for when the action occurred
    status: 'pending' | 'completed' | 'failed'
  }
  
  export interface BlinkTransaction {
    id: string
    actionId: string
    date: number
    amount: number
    type: 'credit' | 'debit'
    status: 'pending' | 'completed' | 'failed'
  }
  