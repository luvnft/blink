'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from 'lucide-react'

export default function CreateBlinks() {
  const router = useRouter()
  const { connected } = useWallet()
  const { addToast } = useToast()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }])
  }

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index)
    setAttributes(newAttributes)
  }

  const handleAttributeChange = (index: number, key: 'trait_type' | 'value', value: string) => {
    const newAttributes = attributes.map((attr, i) => {
      if (i === index) {
        return { ...attr, [key]: value }
      }
      return attr
    })
    setAttributes(newAttributes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      addToast("Please connect your wallet to create a Blink", "error")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement the actual minting logic here
      // This is a placeholder for the API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addToast("Blink created successfully!", "success")
      router.push('/bark/my-blinks')
    } catch (error) {
      addToast("Failed to create Blink. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a New Blink</CardTitle>
          <CardDescription>Mint your unique digital asset on the Solana blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Blink name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your Blink"
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Attributes</Label>
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={attr.trait_type}
                      onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                      placeholder="Trait"
                    />
                    <Input
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAttribute}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !connected}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Blink...
              </>
            ) : (
              'Create Blink'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}