'use client'

import { useState } from 'react'
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
import { Loader2, Wand2, Save } from 'lucide-react'
import { motion } from 'framer-motion'

interface GeneratedBlink {
  name: string
  description: string
  type: string
  imagePrompt: string
}

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedBlink, setGeneratedBlink] = useState<GeneratedBlink | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const { connected } = useWallet()
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/generate-blink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, useAI }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate Blink')
      }

      const data = await response.json()
      setGeneratedBlink(data)
      toast({
        title: "Blink Generated",
        description: "Your new Blink has been generated successfully!",
      })
    } catch (error) {
      console.error('Error generating Blink:', error)
      toast({
        title: "Error",
        description: "Failed to generate Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to save this Blink.",
        variant: "destructive",
      })
      return
    }

    if (!generatedBlink) {
      toast({
        title: "Error",
        description: "No Blink has been generated yet.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/v1/save-blink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedBlink),
      })

      if (!response.ok) {
        throw new Error('Failed to save Blink')
      }

      const savedBlink = await response.json()
      toast({
        title: "Blink Saved",
        description: "Your new Blink has been saved successfully!",
      })
      router.push(`/blinks/${savedBlink.id}`)
    } catch (error) {
      console.error('Error saving Blink:', error)
      toast({
        title: "Error",
        description: "Failed to save Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
          <CardTitle className="text-3xl font-bold text-center">Blink Generator</CardTitle>
          <CardDescription className="text-center">Generate unique Blinks using AI-powered suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Enter a prompt to generate a Blink</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the Blink you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="use-ai"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
            <Label htmlFor="use-ai">Use AI for enhanced generation</Label>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Blink
              </>
            )}
          </Button>
          {generatedBlink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 border-t pt-4"
            >
              <h3 className="text-lg font-semibold">Generated Blink</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={generatedBlink.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={generatedBlink.description} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={generatedBlink.type} disabled>
                  <SelectTrigger id="type">
                    <SelectValue>{generatedBlink.type}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={generatedBlink.type}>{generatedBlink.type}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-prompt">Image Generation Prompt</Label>
                <Textarea id="image-prompt" value={generatedBlink.imagePrompt} readOnly />
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving || !connected}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Blink
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}