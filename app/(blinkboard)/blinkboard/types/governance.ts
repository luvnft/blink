export interface GovernanceProposal {
    id: string
    title: string
    description: string
    proposer: string
    startDate: number
    endDate: number
    status: 'active' | 'passed' | 'rejected'
  }
  
  export interface Vote {
    proposalId: string
    voter: string
    choice: 'for' | 'against' | 'abstain'
    date: number
  }
  
  export interface ProposalResult {
    proposalId: string
    totalVotesFor: number
    totalVotesAgainst: number
    totalAbstained: number
    finalStatus: 'passed' | 'rejected'
  }
  