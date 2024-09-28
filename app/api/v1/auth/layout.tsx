import React from 'react'
import { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Authentication | BARK Blinkboard',
  description: 'Secure login and signup for Blinkboard',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700 relative z-10 backdrop-blur-sm bg-opacity-80">
          {children}
        </div>
      </div>
      <Toaster />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <div className="h-full w-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-5 animate-pulse delay-1000">
          <div className="h-full w-full bg-gradient-to-tl from-zinc-600 via-zinc-700 to-zinc-900 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}