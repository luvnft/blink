'use client'

import React from 'react'
import { Blinkboard } from '@/components/blinkboard'

export default function DashboardPage() {
  const blinkStats = {
    totalBlinks: 42,
    sentBlinks: 15,
    receivedBlinks: 27
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Blink Dashboard</h1>
      <Blinkboard stats={blinkStats} />
    </div>
  )
}