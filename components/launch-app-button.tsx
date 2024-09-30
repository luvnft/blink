'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const LaunchAppButton: React.FC = () => {
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
            router.push('/blinkboard/')
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
            router.push('https://auth.blinkboard.barkprotocol.net')
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
    <>
      <Button onClick={handleLaunchApp} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Launch App'}
      </Button>

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
    </>
  )
}