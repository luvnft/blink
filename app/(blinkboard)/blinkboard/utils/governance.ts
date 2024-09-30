import { Connection, PublicKey } from '@solana/web3.js'

// Fetch active proposals from governance program (using Realms or any custom program)
export async function getActiveProposals() {
  // Replace with actual governance program logic
  return [
    {
      id: 'proposal-1',
      title: 'Increase Staking Rewards',
      description: 'Proposal to increase staking rewards by 20%',
      status: 'Active',
      yesVotes: 150,
      noVotes: 30,
    },
    {
      id: 'proposal-2',
      title: 'Introduce New Tokenomics',
      description: 'Proposal to introduce new tokenomics model for governance.',
      status: 'Active',
      yesVotes: 200,
      noVotes: 50,
    },
  ]
}

// Cast vote for a specific proposal
export async function castVote(proposalId: string, vote: 'yes' | 'no') {
  // Example: send transaction to governance program
  console.log(`Casting ${vote} vote for proposal: ${proposalId}`)
  // Replace with actual transaction logic (e.g., using Solana's @solana/web3.js)
  return true
}
