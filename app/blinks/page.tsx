import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Your Blinks | BARK BLINK',
  description: 'View and manage your Blinks on the BARK BLINK platform.',
}

interface Blink {
  id: string
  name: string
  description: string
  type: string
}

const mockBlinks: Blink[] = [
  { id: '1', name: 'Cosmic Blink', description: 'A mesmerizing cosmic-themed Blink', type: 'NFT' },
  { id: '2', name: 'Nature Blink', description: 'A serene nature-inspired Blink', type: 'Standard' },
  { id: '3', name: 'Tech Blink', description: 'A futuristic tech-themed Blink', type: 'Premium' },
]

export default function BlinksPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Your Blinks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBlinks.map((blink) => (
          <Card key={blink.id}>
            <CardHeader>
              <CardTitle>{blink.name}</CardTitle>
              <CardDescription>{blink.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{blink.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/blinks/${blink.id}`} passHref>
                <Button variant="outline">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}