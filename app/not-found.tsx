import Link from 'next/link'
import Image from "next/legacy/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image
              src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
              alt="BARK BLINK logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col space-y-4">
            <Button asChild variant="default" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/blinkboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to BlinkBoard
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <form className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search BARK BLINK..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D0BFB4] focus:border-transparent"
              />
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}