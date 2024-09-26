'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

export default function CreateBlinkPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/blinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          ownerAddress: 'PLACEHOLDER_ADDRESS', // Replace with actual user address
        }),
      })

      if (res.ok) {
        toast({
          title: 'Blink created successfully!',
          description: 'Your new Blink has been minted on the Solana blockchain.',
        })
        router.push('/blinks')
      } else {
        throw new Error('Failed to create Blink')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create Blink. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create a New Blink</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Create Blink
        </Button>
      </form>
    </div>
  )
}