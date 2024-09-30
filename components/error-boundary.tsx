'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive mb-2">
              <AlertTriangle className="inline-block mr-2 h-8 w-8" />
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {error.message && (
              <p className="text-sm bg-destructive/10 text-destructive p-2 rounded-md mb-4">
                Error: {error.message}
              </p>
            )}
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => reset()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}