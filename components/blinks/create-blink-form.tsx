'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function CreateBlinkForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [blinkData, setBlinkData] = useState({
    name: '',
    description: '',
    type: 'standard',
    supply: '1',
    royalties: '5',
    isTransferable: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBlinkData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setBlinkData(prev => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!blinkData.name || !blinkData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success!",
        description: `Your Blink "${blinkData.name}" has been created.`,
      })
      router.push('/blinkboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Blink</CardTitle>
          <CardDescription>Fill in the details to create your new Blink</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Blink Name</Label>
              <Input
                id="name"
                name="name"
                value={blinkData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter Blink name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={blinkData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your Blink"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Blink Type</Label>
              <Select value={blinkData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supply">Supply</Label>
              <Input
                id="supply"
                name="supply"
                type="number"
                value={blinkData.supply}
                onChange={handleInputChange}
                min="1"
                max="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="royalties">Royalties (%)</Label>
              <Input
                id="royalties"
                name="royalties"
                type="number"
                value={blinkData.royalties}
                onChange={handleInputChange}
                min="0"
                max="15"
                step="0.5"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTransferable"
                name="isTransferable"
                checked={blinkData.isTransferable}
                onChange={(e) => setBlinkData(prev => ({ ...prev, isTransferable: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isTransferable">Transferable</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Blink'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}