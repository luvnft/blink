'use client'

import React from 'react'
import { Hero } from '@/components/ui/Hero'
import { Sidebar } from '@/app/(blinkboard)/components/sidebar'
import { Header } from '@/app/(blinkboard)/components/header'

const BlinkboardPage = () => {
  const handleLaunchApp = () => {
    // Logic for launching the app can be added here
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow">
          <Hero onLaunchApp={handleLaunchApp} />
        </main>
      </div>
    </div>
  )
}

export default BlinkboardPage
