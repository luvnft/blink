'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Zap, Send, BarChart2, ArrowRight, ExternalLink, Mail, Sparkles, Menu, Loader2, Gift, Coins, ShoppingBag, Landmark } from 'lucide-react'
import { SolanaWalletProvider } from '@/components/providers/solana-wallet-provider'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from "@/components/ui/use-toast"
import { Footer } from "@/components/ui/layout/footer"

// Add font imports
import { Syne, Poppins } from 'next/font/google'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

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
        <CardTitle className={`${syne.variable} font-syne text-xl sm:text-2xl font-semibold text-gray-900`}>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className={`${poppins.variable} font-poppins font-light text-sm sm:text-base text-gray-700`}>{description}</p>
    </CardContent>
  </Card>
)

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ number, title, description }) => (
  <div className="flex items-start space-x-4 group">
    <div className="flex-shrink-0 w-8 h-8 bg-[#D0BFB4] text-gray-900 rounded-full flex items-center justify-center font-bold group-hover:bg-[#C0AFA4] transition-colors">
      {number}
    </div>
    <div>
      <h3 className={`${syne.variable} font-syne text-lg sm:text-xl font-semibold mb-2 group-hover:text-[#D0BFB4] transition-colors`}>{title}</h3>
      <p className={`${poppins.variable} font-poppins font-light text-sm sm:text-base text-gray-700`}>{description}</p>
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
      <nav className={`${poppins.variable} font-poppins flex flex-col space-y-4`}>
        <Link href="#features" className="text-lg hover:text-[#D0BFB4] transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-lg hover:text-[#D0BFB4] transition-colors">How It Works</Link>
        <Link href="#faq" className="text-lg hover:text-[#D0BFB4] transition-colors">FAQ</Link>
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

  const features: FeatureCardProps[] = [
    { 
      title: "Create Blinks", 
      description: "Instantly mint and customize Solana Blinks, representing unique digital assets or memorable moments on the blockchain. Unleash your creativity and bring your ideas to life!", 
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Send Blinks", 
      description: "Seamlessly transfer your Blinks to friends, family, or fellow collectors on the Solana network. Share experiences and value with just a few clicks!", 
      icon: <Send className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Track Blinks", 
      description: "Keep a close eye on your growing Blink collection and transaction history in real-time. Our intuitive dashboard provides insights at your fingertips!", 
      icon: <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Customize Blinks", 
      description: "Make your Blinks truly unique by adding custom attributes, metadata, and visual elements. Stand out in the digital realm with your personalized creations!", 
      icon: <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Gifts", 
      description: "Surprise loved ones with special Blinks as thoughtful, digital gifts. Create lasting memories and share the joy of blockchain technology!", 
      icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Swap", 
      description: "Effortlessly exchange various tokens using our integrated swap feature. Enjoy competitive rates and seamless transactions within the BARK ecosystem!", 
      icon: <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Commerce", 
      description: "Bridge the digital and physical worlds by creating and selling merchandise tied to unique Blinks. Expand your brand and engage with your audience in innovative ways!", 
      icon: <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
    },
    { 
      title: "Staking", 
      description: "Earn rewards by staking your BARK tokens. Participate in the network's security and governance while growing your assets over time.", 
      icon: <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-[#D0BFB4]" /> 
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
      const response = await fetch('/api/v1/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

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
      <div className={`${syne.variable} ${poppins.variable} min-h-screen font-poppins bg-gray-50 text-gray-900`}>
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
              <span className="font-syne font-bold text-xl sm:text-2xl text-gray-900">
                BARK <span className="sr-only">BLINK</span>
                <BlinkingText />
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">How It Works</Link>
              <Link href="#faq" className="text-gray-700 hover:text-[#D0BFB4] transition-colors">FAQ</Link>
              <ConnectWalletButton />
            </nav>
            <MobileMenu />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <section className="text-center mb-20 min-h-[calc(100vh-80px)] flex flex-col justify-center relative">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0" 
              style={{
                backgroundImage: "url('https://ucarecdn.com/1d0d9d6e-8b3e-4f5e-8b0e-5f9b9e3b9b9e/hero-background.jpg')",
                opacity: 0.1
              }}
            />
            <div className="relative z-10">
              <Badge className="inline-block mb-4 text-lg font-light bg-transparent border border-[#D0BFB4] text-[#D0BFB4]">
                Revolutionizing Digital Assets
              </Badge>
              <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                Welcome to BARK BLINK
              </h1>
              <p className="font-light text-xl sm:text-2xl mb-10 text-gray-700 max-w-3xl mx-auto">
                Unleash the power of Solana with our innovative Blink As A Service platform. 
                Create, manage, and trade unique digital assets with ease.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="w-full sm:w-auto bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors text-lg px-8 py-3 rounded-full"
                  onClick={handleLaunchApp}
                >
                  Launch Blinkboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-[#D0BFB4] text-gray-900 hover:bg-[#D0BFB4] hover:text-white transition-colors text-lg px-8 py-3 rounded-full">
                  View Docs
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          <section id="features" className="mb-20">
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>

          <section id="how-it-works" className="mb-20">
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => (
                <HowItWorksStep key={index} {...step} />
              ))}
            </div>
          </section>

          <section id="faq" className="mb-20 max-w-3xl mx-auto">
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a BARK Blink?</AccordionTrigger>
                <AccordionContent>
                 Using Solana Actions, you can turn any transaction into a blockchain link that can be shared anywhere on the internet — no third party application required. Request a payment in a text message. Vote on governance in a chatroom. Buy an NFT on social media. It's all possible with BARK Blinks.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I create a Blink?</AccordionTrigger>
                <AccordionContent>
                  To create a Blink, you need to connect your Solana wallet to BARK BLINK. Once connected, you can use our intuitive interface to create and customize your Blinks. Our platform guides you through the process, making it easy even for blockchain beginners.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are compressed NFTs tradeable?</AccordionTrigger>
                <AccordionContent>
                  Yes, Compressed NFTs (CNFT) are tradeable on the Solana network. You can send them to other users or trade them on supported marketplaces. CNFTs offer the benefits of traditional NFTs with improved efficiency and lower costs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What are Merchant Blinks?</AccordionTrigger>
                <AccordionContent>
                  BARK's Commerce Blinks are special Blinks that represent physical merchandise. They can be created by sellers and purchased by buyers, who can then redeem them for physical goods. This bridges the gap between digital assets and real-world items, opening up exciting possibilities for e-commerce and collectibles.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How does token swapping work?</AccordionTrigger>
                <AccordionContent>
                  Our integrated token swap feature allows you to exchange different types of tokens directly within the BARK - Blinks As A Service platform. We use decentralized exchanges to ensure the best rates and liquidity. This means you can easily manage your portfolio and take advantage of market opportunities without leaving the BARK ecosystem.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="newsletter" className="mb-20 py-12 sm:py-16 bg-[#D0BFB4] rounded-lg">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-900">Stay in the Loop</h2>
              <p className="font-light text-lg sm:text-xl mb-8 text-center text-gray-800">Get the latest updates, news, and exclusive offers directly in your inbox.</p>
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
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Ready to Start Blinking?</h2>
            <p className="font-light text-lg sm:text-xl mb-8 text-gray-700">Join the BARK community and start creating your Blinks today!</p>
            <Button 
              className="bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors text-lg px-8 py-4 rounded-full"
              onClick={handleLaunchApp}
            >
              Launch Blinkboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </section>
        </main>

        <Footer />
      </div>
    </SolanaWalletProvider>
  )
}