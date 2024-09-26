import { Metadata } from 'next'
import APIActionCard from '@/components/ui/api-action-card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'API Actions | BARK Blinks',
  description: 'Explore and test the BARK Blinks API Solana actions',
}

export default function APIActionsPage() {
  const apiActions = [
    {
      name: 'Create Blink',
      description: 'Create a new Blink with specified attributes',
      endpoint: '/api/v1/blinks',
      method: 'POST',
      params: [
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'attributes', type: 'object', required: false },
      ],
    },
    {
      name: 'Get Blink',
      description: 'Retrieve details of a specific Blink',
      endpoint: '/api/v1/blinks/{id}',
      method: 'GET',
      params: [
        { name: 'id', type: 'string', required: true },
      ],
    },
    {
      name: 'Update Blink',
      description: 'Update attributes of an existing Blink',
      endpoint: '/api/v1/blinks/{id}',
      method: 'PUT',
      params: [
        { name: 'id', type: 'string', required: true },
        { name: 'name', type: 'string', required: false },
        { name: 'description', type: 'string', required: false },
        { name: 'attributes', type: 'object', required: false },
      ],
    },
    {
      name: 'Transfer Blink',
      description: 'Transfer ownership of a Blink to another wallet',
      endpoint: '/api/v1/blinks/{id}/transfer',
      method: 'POST',
      params: [
        { name: 'id', type: 'string', required: true },
        { name: 'toWallet', type: 'string', required: true },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">API Actions</h1>
      <p className="text-xl mb-8">
        Explore and test the BARK Blinks API actions. Use these endpoints to interact with Blinks programmatically.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {apiActions.map((action) => (
          <APIActionCard key={action.name} action={action} />
        ))}
      </div>
      <div className="text-center">
        <Button asChild>
          <a href="/api/docs" target="_blank" rel="noopener noreferrer">View Full API Documentation</a>
        </Button>
      </div>
    </div>
  )
}