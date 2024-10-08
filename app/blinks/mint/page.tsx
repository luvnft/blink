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

export default function MintBlinkPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('standard')
  const [supply, setSupply] = useState('1')
  const [royalties, setRoyalties] = useState('0')
  const [isTransferable, setIsTransferable] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint a Blink.",
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
      formData.append('supply', supply)
      formData.append('royalties', royalties)
      formData.append('isTransferable', isTransferable.toString())
      if (image) formData.append('image', image)
      formData.append('ownerAddress', publicKey.toBase58())

      const response = await fetch('/api/blinks/mint', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to mint Blink')
      }

      const data = await response.json()
      toast({
        title: "Blink Minted",
        description: `Your Blink "${name}" has been minted successfully!`,
      })
      router.push(`/blinks/${data.id}`)
    } catch (error) {
      console.error('Error minting Blink:', error)
      toast({
        title: "Error",
        description: "Failed to mint Blink. Please try again.",
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
          <CardTitle className="text-3xl font-bold">Mint a New Blink</CardTitle>
          <CardDescription>Create a unique digital asset on the Solana blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMint} className="space-y-6">
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
            <div className="space-y-2">
              <Label htmlFor="supply">Supply</Label>
              <Input
                id="supply"
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="royalties">Royalties (%)</Label>
              <Input
                id="royalties"
                type="number"
                value={royalties}
                onChange={(e) => setRoyalties(e.target.value)}
                required
                min="0"
                max="100"
                step="0.1"
              />
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
              <Label htmlFor="image">Blink Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleMint}
            disabled={isLoading || !name || !description}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Mint Blink
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}