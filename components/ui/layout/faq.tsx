'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg transition-all duration-200 ease-in-out text-foreground"
        onClick={onToggle}
      >
        <span className="font-medium text-base sm:text-lg pr-4 text-foreground">{question}</span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <Minus className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-primary" />
          )}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginBottom: '1rem' },
              collapsed: { opacity: 0, height: 0, marginBottom: '0' },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="pb-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "What is a BARK Blink?",
      answer: "Using Solana Actions, you can turn any transaction into a blockchain link that can be shared anywhere on the internet — no third-party application required. Request a payment in a text message. Vote on governance in a chatroom. Buy an NFT on social media. It's all possible with BARK Blinks.",
    },
    {
      question: "How do I create a Blink?",
      answer: "To create a Blink, you need to connect your Solana wallet to BARK BLINK. Once connected, you can use our intuitive interface to create and customize your Blinks. Our platform guides you through the process, making it easy even for blockchain beginners.",
    },
    {
      question: "Are compressed NFTs tradeable?",
      answer: "Yes, Compressed NFTs (CNFT) are tradeable on the Solana network. You can send them to other users or trade them on supported marketplaces. CNFTs offer the benefits of traditional NFTs with improved efficiency and lower costs.",
    },
    {
      question: "What are Merchant Blinks?",
      answer: "BARK's Merch Blinks are special Blinks that represent physical merchandise. They can be created by sellers and purchased by buyers, who can then redeem them for physical goods. This bridges the gap between digital assets and real-world items, opening up exciting possibilities for e-commerce and collectibles.",
    },
    {
      question: "How does token swapping work?",
      answer: "Our integrated token swap feature allows you to exchange different types of tokens directly within the BARK - Blinks As A Service platform. We use decentralized exchanges to ensure the best rates and liquidity. This means you can easily manage your portfolio and take advantage of market opportunities without leaving the BARK ecosystem.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-inter text-4xl sm:text-5xl font-bold mb-2 text-center text-foreground">FAQ</h2>
          <h3 className="font-poppins text-xl sm:text-2xl font-medium mb-8 text-center text-muted-foreground">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={index === openIndex}
                onToggle={() => setOpenIndex(index === openIndex ? null : index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}