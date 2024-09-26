import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, Zap, Paintbrush, Code, Building2 } from 'lucide-react'
import { motion } from "framer-motion"

interface HeroProps {
  onLaunchApp: () => void
}

export const Hero: React.FC<HeroProps> = ({ onLaunchApp }) => {
  return (
    <section className="relative text-center py-20 mb-20 min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 blur-sm" 
        style={{
          backgroundImage: "url('https://ucarecdn.com/750e9f1b-edfc-4ac8-a5b4-3286c7de98d6/barkmascottrasparentbg.png')",
          opacity: 0.05
        }}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <Badge className="inline-flex items-center mb-6 text-sm font-medium bg-[#D0BFB4]/20 text-[#D0BFB4] px-3 py-1 rounded-full border border-[#D0BFB4]/50">
          <Zap className="w-4 h-4 mr-1.5" />
          Powering the Future of Digital Interactions
        </Badge>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 text-gray-900 leading-tight text-shadow-sm">
          Transform Your <span className="text-[#D0BFB4]">Digital Experience</span> with BARK BLINK
        </h1>
        <p className="font-poppins text-2xl sm:text-3xl mb-10 text-gray-600 max-w-4xl mx-auto">
          Harness the potential of Solana to revolutionize how you create, share, and monetize digital content.
        </p>
        <p className="text-xl mb-12 text-gray-600 max-w-3xl mx-auto">
          Join the future of digital ownership and experience the seamless integration of blockchain technology in your everyday life.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
          <Button 
            className="w-full sm:w-auto bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors text-xl px-10 py-5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={onLaunchApp}
          >
            Launch Blinkboard
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-2 border-[#D0BFB4] text-gray-900 hover:bg-[#D0BFB4] hover:text-white transition-colors text-xl px-10 py-5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Use Cases
            <ExternalLink className="ml-2 h-6 w-6" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          {[
            { icon: Paintbrush, title: "Content Creators", description: "Mint unique digital assets, build your brand, and engage with your audience in groundbreaking ways." },
            { icon: Code, title: "Developers", description: "Integrate our powerful API to build innovative applications on top of the Solana blockchain." },
            { icon: Building2, title: "Businesses", description: "Create loyalty programs, issue digital certificates, and streamline operations with blockchain technology." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            >
              <item.icon className="w-10 h-10 text-[#D0BFB4] mb-3" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-700 text-center text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}