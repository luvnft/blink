import Link from 'next/link'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md card card-hover">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative w-20 h-20">
            <Image
              src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
              alt="BARK BLINK logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col space-y-4">
            <Button asChild variant="default" className="btn btn-primary w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" className="btn btn-outline w-full">
              <Link href="/blinkboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blinkboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}