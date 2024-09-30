'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/components/ui/use-toast"
import { Header } from '@/components/ui/layout/header'
import { Hero } from '@/components/ui/layout/hero'
import { Features } from '@/components/ui/layout/features'
import { Actions } from "@/components/ui/layout/actions"
import { HowItWorks } from '@/components/ui/layout/how-it-works'
import { CTA } from '@/components/ui/layout/cta'
import { FAQ } from '@/components/ui/layout/faq'
import { Newsletter } from '@/components/ui/layout/newsletter'
import Footer from "@/components/ui/layout/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Home: React.FC = () => {
  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const storedUsername = localStorage.getItem('barkBlinkUsername')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleLaunchApp = useCallback(async () => {
    if (connected && publicKey) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/v1/user/check-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicKey: publicKey.toString() }),
        })

        if (response.ok) {
          const { exists } = await response.json()
          if (exists) {
            router.push('https://blinkboard.app')
          } else {
            setIsDialogOpen(true)
          }
        } else {
          throw new Error('Failed to check user')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        toast({
          title: "Error",
          description: "An error occurred while launching the app. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to launch the app.",
        variant: "destructive",
      })
    }
  }, [connected, publicKey, router, toast])

  const handleUsernameSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoading(true)
      fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, publicKey: publicKey?.toString() }),
      })
        .then((response) => {
          if (response.ok) {
            localStorage.setItem('barkBlinkUsername', username)
            router.push('https://auth.blinkboard.app')
          } else {
            throw new Error('Failed to create user')
          }
        })
        .catch((error) => {
          console.error('Error creating user:', error)
          toast({
            title: "Error",
            description: "Failed to create user. Please try again.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
          setIsDialogOpen(false)
        })
    } else {
      toast({
        title: "Invalid username",
        description: "Please enter a valid username.",
        variant: "destructive",
      })
    }
  }, [username, publicKey, router, toast])

  return (
    <div className="min-h-screen font-poppins bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero onLaunchApp={handleLaunchApp} />
        <Features />
        <HowItWorks />
        <Actions />
        <CTA onLaunchApp={handleLaunchApp} />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
            <DialogDescription>
              Enter a username to get started with BARK BLINK.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUsernameSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Start Blinking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home