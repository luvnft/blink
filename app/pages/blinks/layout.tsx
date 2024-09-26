import React from 'react'
import { BlinkActionNav } from '@/components/blinks/blink-action-nav'

export default function BlinkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <BlinkActionNav />
      {children}
    </div>
  )
}