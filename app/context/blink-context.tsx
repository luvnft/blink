import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserBlinks } from '@/lib/services/user-service'

interface Blink {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface BlinkContextType {
  blinks: Blink[]
  activeBlink: Blink | null
  setActiveBlink: (blink: Blink | null) => void
  addBlink: (blink: Blink) => void
  updateBlink: (id: string, updates: Partial<Blink>) => void
  deleteBlink: (id: string) => void
  refreshBlinks: () => Promise<void>
}

const BlinkContext = createContext<BlinkContextType | undefined>(undefined)

export function BlinkProvider({ children }: { children: React.ReactNode }) {
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [activeBlink, setActiveBlink] = useState<Blink | null>(null)

  const refreshBlinks = async () => {
    const userId = 'current-user-id' // Replace this with actual user ID from auth context
    const fetchedBlinks = await getUserBlinks(userId)
    setBlinks(fetchedBlinks)
  }

  useEffect(() => {
    refreshBlinks()
  }, [])

  const addBlink = (newBlink: Blink) => {
    setBlinks(prevBlinks => [...prevBlinks, newBlink])
  }

  const updateBlink = (id: string, updates: Partial<Blink>) => {
    setBlinks(prevBlinks =>
      prevBlinks.map(blink =>
        blink.id === id ? { ...blink, ...updates } : blink
      )
    )
  }

  const deleteBlink = (id: string) => {
    setBlinks(prevBlinks => prevBlinks.filter(blink => blink.id !== id))
  }

  const value = {
    blinks,
    activeBlink,
    setActiveBlink,
    addBlink,
    updateBlink,
    deleteBlink,
    refreshBlinks,
  }

  return <BlinkContext.Provider value={value}>{children}</BlinkContext.Provider>
}

export function useBlink() {
  const context = useContext(BlinkContext)
  if (context === undefined) {
    throw new Error('use Blink must be used within a Blink Provider')
  }
  return context
}