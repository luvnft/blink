import React, { useEffect, useState } from 'react'
import { fetchGovernanceProposals } from '../api/fetch-governance-proposals'

interface Proposal {
  id: string
  title: string
  description: string
}

export const Governance: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProposals = async () => {
      try {
        const data = await fetchGovernanceProposals()
        setProposals(data)
      } catch (err) {
        setError('Failed to fetch proposals.')
      } finally {
        setLoading(false)
      }
    }

    getProposals()
  }, [])

  const castVote = async (proposalId: string, vote: string) => {
    try {
      // Handle voting logic here (e.g., send vote to API)
      console.log(`Voted ${vote} on proposal ${proposalId}`)
      // Example: await submitVote(proposalId, vote);
      alert(`You voted ${vote} on proposal ${proposalId}`) // Feedback
    } catch (error) {
      console.error('Error casting vote:', error)
      alert('Failed to cast your vote. Please try again.')
    }
  }

  if (loading) {
    return <p>Loading proposals...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="p-4 bg-white rounded-md shadow">
      {proposals.length > 0 ? (
        <ul className="space-y-3">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="p-2 border-b">
              <span className="font-medium">Proposal:</span> {proposal.title} <br />
              <span className="font-medium">Description:</span> {proposal.description} <br />
              <button onClick={() => castVote(proposal.id, 'yes')} className="bg-green-500 p-2 rounded text-white">
                Vote Yes
              </button>
              <button onClick={() => castVote(proposal.id, 'no')} className="bg-red-500 p-2 rounded text-white">
                Vote No
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active governance proposals available.</p>
      )}
    </div>
  )
}
