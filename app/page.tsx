'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/components/ui/use-toast"
import { SolanaWalletProvider } from '@/components/providers/solana-wallet-provider'
import { Header } from '@/components/ui/layout/header'
import { Hero } from '@/components/ui/layout/hero'
import { Features } from '@/components/ui/layout/features'
import { Actions } from "@/components/ui/layout/actions"
import { HowItWorks } from '@/components/ui/layout/how-it-works'
import { CTA } from '@/components/ui/layout/cta'
import { FAQ } from '@/components/ui/layout/faq'
import { Newsletter } from '@/components/ui/layout/newsletter'
import Footer from "@/components/ui/layout/footer"

const Home: React.FC = () => {
  const router = useRouter()
  const { connected } = useWallet()
  const { toast } = useToast()

  const handleLaunchApp = React.useCallback(() => {
    if (connected) {
      router.push('/components/signup/')
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to launch the app.",
        variant: "destructive",
      })
    }
  }, [connected, router, toast])

  return (
    <SolanaWalletProvider>
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
      </div>
    </SolanaWalletProvider>
  )
}

export default Home