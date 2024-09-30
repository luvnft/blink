import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui/card'
import { getActiveProposals, castVote } from '@/utils/governance'

interface Proposal {
  id: string
  title: string
  description: string
  status: string
  yesVotes: number
  noVotes: number
}

export default function GovernanceSection() {
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    // Fetch active proposals
    getActiveProposals().then(setProposals)
  }, [])

  const handleVote = async (proposalId: string, vote: 'yes' | 'no') => {
    try {
      await castVote(proposalId, vote)
      alert(`Successfully voted ${vote} on proposal ${proposalId}`)
    } catch (error) {
      alert('Failed to cast vote. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">Active Proposals</h3>
        {proposals.length > 0 ? (
          <ul className="space-y-4">
            {proposals.map((proposal) => (
              <li key={proposal.id} className="border-b pb-4">
                <h4 className="font-semibold">{proposal.title}</h4>
                <p className="text-sm text-gray-600">{proposal.description}</p>
                <p className="text-xs text-gray-500">Status: {proposal.status}</p>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => handleVote(proposal.id, 'yes')} variant="success">
                    Vote Yes ({proposal.yesVotes})
                  </Button>
                  <Button onClick={() => handleVote(proposal.id, 'no')} variant="danger">
                    Vote No ({proposal.noVotes})
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No active proposals at the moment.</p>
        )}
      </CardContent>
    </Card>
  )
}
