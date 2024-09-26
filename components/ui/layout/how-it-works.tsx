import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Sparkles, Coins, Gift } from 'lucide-react'

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ number, title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Card className="bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full relative overflow-hidden group border border-gray-200">
      <div className="absolute top-0 left-0 w-32 h-32 opacity-5 transform -translate-x-1/4 -translate-y-1/4 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 duration-300">
        {React.cloneElement(icon as React.ReactElement, { className: "w-full h-full" })}
      </div>
      <CardHeader className="text-center pb-2 relative z-10">
        <div className="mx-auto w-14 h-14 bg-[#F2E8D5] text-gray-800 rounded-full flex items-center justify-center font-bold mb-4 transform transition-transform group-hover:scale-110 duration-300">
          <span className="text-2xl">{number}</span>
        </div>
        <CardTitle className="font-inter text-xl font-semibold text-gray-900 mb-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center flex-grow relative z-10">
        <div className="mb-6">
          {React.cloneElement(icon as React.ReactElement, { className: "w-12 h-12 text-[#D0BFB4] mx-auto transform transition-transform group-hover:scale-110 duration-300" })}
        </div>
        <p className="font-poppins font-light text-base text-gray-700">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

export const HowItWorks: React.FC = () => {
  const howItWorksSteps: HowItWorksStepProps[] = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to BARK BLINK to get started and access all features securely.",
      icon: <Wallet />,
    },
    {
      number: 2,
      title: "Create Your Blink",
      description: "Use our intuitive interface to create and customize your Solana Blink with unique attributes.",
      icon: <Sparkles />,
    },
    {
      number: 3,
      title: "Share or Trade",
      description: "Send your Blink to friends or trade it on supported marketplaces to grow your collection.",
      icon: <Coins />,
    },
    {
      number: 4,
      title: "Manage Your Collection",
      description: "Track and manage your Blinks in your personal BlinkBoard, monitoring value and activity.",
      icon: <Gift />,
    }
  ]

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-inter text-4xl sm:text-5xl font-bold mb-6 text-center text-gray-900">How It Works</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
          Get started with BARK BLINK in just a few simple steps. Our intuitive platform makes it easy to create, manage, and trade your digital assets on the Solana blockchain.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => (
            <HowItWorksStep key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}