import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Send, BarChart2, Sparkles, Gift, Coins, ShoppingBag, Landmark, Code, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, action, link }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Card className="bg-white hover:shadow-md transition-shadow transform hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="font-inter text-lg font-semibold text-gray-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="font-poppins font-light text-sm text-gray-700">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={link} passHref>
          <Button variant="outline" className="w-full text-sm">
            {action}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
)

const features: FeatureCardProps[] = [
  { 
    title: "Create Blinks", 
    description: "Instantly mint and customize Solana Blinks, representing unique digital assets or memorable moments on the blockchain.", 
    icon: <Zap className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Start Creating",
    link: "/blinks/create"
  },
  { 
    title: "Send Blinks", 
    description: "Seamlessly transfer your Blinks to friends, family, or fellow collectors on the Solana network.", 
    icon: <Send className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Send Now",
    link: "/blinks/send"
  },
  { 
    title: "Track Blinks", 
    description: "Keep a close eye on your growing Blink collection and transaction history in real-time.", 
    icon: <BarChart2 className="h-5 w-5 text-[#D0BFB4]" />,
    action: "View Dashboard",
    link: "/blinks/dashboard"
  },
  { 
    title: "Customize Blinks", 
    description: "Make your Blinks truly unique by adding custom attributes, metadata, and visual elements.", 
    icon: <Sparkles className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Customize",
    link: "/blinks/customize"
  },
  { 
    title: "Gifts", 
    description: "Surprise loved ones with special Blinks as thoughtful, digital gifts. Create lasting memories.", 
    icon: <Gift className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Send a Gift",
    link: "/blinks/gifts"
  },
  { 
    title: "Swap", 
    description: "Effortlessly exchange various tokens using our integrated swap feature. Enjoy competitive rates.", 
    icon: <Coins className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Start Swapping",
    link: "/blinks/swap"
  },
  { 
    title: "Commerce", 
    description: "Bridge the digital and physical worlds by creating and selling merchandise tied to unique Blinks.", 
    icon: <ShoppingBag className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Open Shop",
    link: "/blinks/commerce"
  },
  { 
    title: "Staking", 
    description: "Earn rewards by staking your BARK tokens. Participate in the network's security and governance.", 
    icon: <Landmark className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Stake Now",
    link: "/blinks/staking"
  },
  {
    title: "API & SDK",
    description: "Integrate BARK Blinks into your own applications with our comprehensive API and SDK.",
    icon: <Code className="h-5 w-5 text-[#D0BFB4]" />,
    action: "Explore Docs",
    link: "/docs"
  }
]

export default function BlinksPage() {
  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-inter text-4xl sm:text-5xl font-bold mb-2 text-center text-gray-900">BARK Blinks</h1>
        <h2 className="font-poppins text-xl sm:text-2xl font-medium mb-4 text-center text-gray-500">Solana Actions & Blinks</h2>
        <p className="font-poppins text-base sm:text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          BARK Protocol offers a streamlined approach to interact with the Solana blockchain, designed for ease of use and high performance
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  )
}