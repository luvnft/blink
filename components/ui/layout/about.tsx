import React from 'react'

export const About: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">About BARK BLINK</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6 text-gray-700">
            BARK BLINK is a revolutionary Blink As A Service platform built on the Solana blockchain. 
            We empower creators, collectors, and innovators to easily mint, manage, and trade unique digital assets.
          </p>
          <p className="text-lg mb-6 text-gray-700">
            Our mission is to democratize access to blockchain technology and provide a user-friendly interface 
            for creating and interacting with Solana Blinks. Whether you're an artist, entrepreneur, or blockchain enthusiast, 
            BARK BLINK offers the tools you need to bring your ideas to life in the digital realm.
          </p>
          <p className="text-lg text-gray-700">
            Join us in shaping the future of digital ownership and expression with BARK BLINK.
          </p>
        </div>
      </div>
    </section>
  )
}