import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Send, CreditCard, Sparkles, Gift, ShoppingBag, Users, Code, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="h-full bg-gradient-to-br from-primary/10 to-secondary/10 border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-full">
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground mb-4">{description}</CardDescription>
        <Button asChild variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          <Link href={link}>
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
)

const features: FeatureCardProps[] = [
  {
    title: "Create Blinks",
    description: "Mint unique digital assets on the Solana blockchain with ease.",
    icon: <Zap />,
    link: "/create"
  },
  {
    title: "Send Blinks",
    description: "Transfer your Blinks to other users seamlessly and securely.",
    icon: <Send />,
    link: "/send"
  },
  {
    title: "Micro Payments",
    description: "Facilitate quick and efficient transactions using Blinks.",
    icon: <CreditCard />,
    link: "/payments"
  },
  {
    title: "Customize Blinks",
    description: "Add unique attributes and metadata to make your Blinks truly special.",
    icon: <Sparkles />,
    link: "/customize"
  },
  {
    title: "Gift Blinks",
    description: "Surprise friends and family with digital gifts that last forever.",
    icon: <Gift />,
    link: "/gift"
  },
  {
    title: "Blink Commerce",
    description: "Create and sell merchandise tied to your unique Blinks.",
    icon: <ShoppingBag />,
    link: "/commerce"
  },
  {
    title: "Crowdfunding",
    description: "Launch and support innovative projects using Blinks.",
    icon: <Users />,
    link: "/crowdfunding"
  },
  {
    title: "Developer API",
    description: "Integrate Blinks into your own applications with our robust API.",
    icon: <Code />,
    link: "/api"
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Unleash the Power of Blinks</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover the innovative features that make BARK Blink the ultimate platform for digital asset creation and management on the Solana blockchain.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}