'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from 'lucide-react'

export default function CreateBlinkPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('standard')
  const [isTransferable, setIsTransferable] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    if (!name || !description || !file) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and upload an image.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('type', type)
      formData.append('isTransferable', isTransferable.toString())
      formData.append('image', file)
      formData.append('owner', publicKey?.toBase58() || '')

      const response = await fetch('/api/blinks', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create Blink')
      }

      const data = await response.json()
      toast({
        title: "Blink Created",
        description: `Your Blink "${name}" has been created successfully!`,
      })
      router.push(`/blinks/${data.id}`)
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create a New Blink</CardTitle>
          <CardDescription>Mint a unique digital asset on the Solana blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Blink Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Blink Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="limited">Limited Edition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="transferable"
                checked={isTransferable}
                onCheckedChange={setIsTransferable}
              />
              <Label htmlFor="transferable">Transferable</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleCreate}
            disabled={isLoading || !connected}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Blink
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}