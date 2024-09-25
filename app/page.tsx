'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Zap, Send, BarChart2, ArrowRight, ExternalLink, Mail, Sparkles, Menu, Loader2 } from 'lucide-react'
import { SolanaWalletProvider } from '@/components/providers/solana-wallet-provider'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/components/ui/use-toast"

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
}

const BlinkingText: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span 
      className={`font-medium text-[#D0BFB4] ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      aria-hidden="true"
    >
      BLINK
    </span>
  )
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <Card className="bg-white hover:shadow-lg transition-shadow transform hover:-translate-y-1">
    <CardHeader>
      <div className="flex items-center space-x-2">
        {icon}
        <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm sm:text-base text-gray-700">{description}</p>
    </CardContent>
  </Card>
)

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ number, title, description }) => (
  <div className="flex items-start space-x-4 group">
    <div className="flex-shrink-0 w-8 h-8 bg-[#D0BFB4] text-gray-900 rounded-full flex items-center justify-center font-bold group-hover:bg-[#C0AFA4] transition-colors">
      {number}
    </div>
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-[#D0BFB4] transition-colors">{title}</h3>
      <p className="text-sm sm:text-base text-gray-700">{description}</p>
    </div>
  </div>
)

const MobileMenu: React.FC = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
      <nav className="flex flex-col space-y-4">
        <a href="#features" className="text-lg hover:text-[#D0BFB4] transition-colors">Features</a>
        <a href="#how-it-works" className="text-lg hover:text-[#D0BFB4] transition-colors">How It Works</a>
        <a href="#faq" className="text-lg hover:text-[#D0BFB4] transition-colors">FAQ</a>
        <ConnectWalletButton />
      </nav>
    </SheetContent>
  </Sheet>
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const router = useRouter()
  const { connected } = useWallet()
  const { toast } = useToast()

  const features: FeatureCardProps[] = [
    { 
      title: "Create Blinks", 
      description: "Instantly create Solana Blinks to represent digital assets or moments on the blockchain.", 
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Send Blinks", 
      description: "Effortlessly transfer your Blinks to other users on the Solana network.", 
      icon: <Send className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Track Blinks", 
      description: "Monitor your Blink collection and transaction history in real-time.", 
      icon: <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Customize Blinks", 
      description: "Personalize your Blinks with unique attributes and metadata.", 
      icon: <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    }
  ]

  const howItWorksSteps: HowItWorksStepProps[] = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to BARK BLINK to get started."
    },
    {
      number: 2,
      title: "Create Your Blink",
      description: "Use our intuitive interface to create and customize your Solana Blink."
    },
    {
      number: 3,
      title: "Share or Trade",
      description: "Send your Blink to friends or trade it on supported marketplaces."
    },
    {
      number: 4,
      title: "Manage Your Collection",
      description: "Track and manage your Blinks in your personal BlinkBoard."
    }
  ]

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubscribing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail('')
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "An error occurred while subscribing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleLaunchApp = () => {
    if (connected) {
      router.push('/blinkboard')
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to launch the app.",
        variant: "destructive",
      })
    }
  }

  return (
    <SolanaWalletProvider>
      <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
                alt="BARK BLINK logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold text-xl sm:text-2xl text-gray-900">
                BARK <span className="sr-only">BLINK</span>
                <BlinkingText />
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">How It Works</a>
              <a href="#faq" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">FAQ</a>
              <ConnectWalletButton />
            </nav>
            <MobileMenu />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <section className="text-center mb-20 min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">Welcome to BARK BLINK</h1>
            <p className="text-xl sm:text-2xl mb-10 text-gray-700 max-w-3xl mx-auto">The Blink As A Service application for creating and managing Solana Blinks</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="w-full sm:w-auto bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors text-lg px-8 py-3 rounded-full"
                onClick={handleLaunchApp}
              >
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto border-[#D0BFB4] text-gray-900 hover:bg-[#D0BFB4] hover:text-white transition-colors text-lg px-8 py-3 rounded-full">
                View Docs
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>

          <section id="features" className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>

          <section id="how-it-works" className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => (
                <HowItWorksStep key={index} {...step} />
              ))}
            </div>
          </section>

          <section id="faq" className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a Solana Blink?</AccordionTrigger>
                <AccordionContent>
                  A Solana Blink is a unique digital asset on the Solana blockchain. It can represent moments, achievements, or any digital content you want to preserve.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I create a Blink?</AccordionTrigger>
                <AccordionContent>
                  To create a Blink, you need to connect your Solana wallet to BARK BLINK. Once connected, you can use our intuitive interface to create and customize your Blinks.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are Blinks tradeable?</AccordionTrigger>
                <AccordionContent>
                  Yes, Blinks are tradeable on the Solana network. You can send them to other users or trade them on supported marketplaces.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="newsletter" className="mb-20 py-12 sm:py-16 bg-[#D0BFB4] rounded-lg">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-900">Stay in the Loop</h2>
              <p className="text-lg sm:text-xl mb-8 text-center text-gray-800">Get the latest updates, news, and exclusive offers directly in your inbox.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow bg-white"
                />
                <Button 
                  type="submit" 
                  className="bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-full"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Mail className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>

          <section id="cta" className="mb-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Ready to Start Blinking?</h2>
            <p className="text-lg sm:text-xl mb-8 text-gray-700">Join the BARK community and start creating your Solana Blinks today!</p>
            <Button 
              className="bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors text-lg px-8 py-4 rounded-full"
              onClick={handleLaunchApp}
            >
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </section>
        </main>

        <footer className="bg-white shadow-sm mt-20">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
                alt="BARK BLINK logo"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="font-bold text-xl text-gray-900">BARK</span>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
              <a href="#" className="text-sm sm:text-base text-gray-700 hover:text-[#D0BFB4] transition-colors">Learn</a>
              <a href="#" className="text-sm sm:text-base text-gray-700 hover:text-[#D0BFB4] transition-colors">Examples</a>
              <a href="#" className="text-sm sm:text-base text-gray-700 hover:text-[#D0BFB4] transition-colors">BARK Community</a>
              <a href="#" className="text-sm sm:text-base text-gray-700 hover:text-[#D0BFB4] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm sm:text-base text-gray-700 hover:text-[#D0BFB4] transition-colors">Terms of Service</a>
            </nav>
          </div>
        </footer>
      </div>
    </SolanaWalletProvider>
  )
}