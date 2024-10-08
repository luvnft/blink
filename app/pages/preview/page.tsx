'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BlinkPreview {
  id: string
  name: string
  description: string
  imageUrl: string
  blinkType: string
  createdAt: string
}

export default function PreviewPage() {
  const [blink, setBlink] = useState<BlinkPreview | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const blinkId = searchParams.get('id')

  useEffect(() => {
    const fetchBlinkPreview = async () => {
      if (!blinkId) {
        toast({
          title: "Error",
          description: "No Blink ID provided",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/v1/blinks/${blinkId}/preview`)
        if (!response.ok) {
          throw new Error('Failed to fetch Blink preview')
        }
        const data = await response.json()
        setBlink(data)
      } catch (error) {
        console.error('Error fetching Blink preview:', error)
        toast({
          title: "Error",
          description: "Failed to load Blink preview. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBlinkPreview()
  }, [blinkId, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!blink) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Blink Not Found</h1>
        <p className="mb-4">The requested Blink preview could not be loaded.</p>
        <Button asChild>
          <Link href="/blink/create">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Create Blink
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{blink.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={blink.imageUrl}
              alt={blink.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="text-muted-foreground">{blink.description}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              {blink.blinkType}
            </span>
            <span className="text-muted-foreground">
              Created: {new Date(blink.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/blink/create">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/blinks/${blink.id}`}>
              View Full Blink <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}