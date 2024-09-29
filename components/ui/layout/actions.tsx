import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Landmark, Vote, Repeat, BarChart2, ArrowRight, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  link: string;
  category: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, action, link, category }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow transform hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="font-inter text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="font-poppins font-light text-sm text-gray-700 dark:text-gray-300">{description}</p>
        <p className="font-poppins text-xs text-gray-500 dark:text-gray-400 mt-2">Category: {category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={link} passHref className="w-full">
          <Button variant="outline" className="w-full text-sm bg-sand-400 text-white hover:bg-sand-500 transition-colors duration-300 rounded-md py-2 px-4 flex items-center justify-center border border-sand-500">
            {action}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

export const Actions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const actions: ActionCardProps[] = [
    { 
      title: "Create CNFT", 
      description: "Mint new compressed NFT on the Solana blockchain.", 
      icon: <PlusCircle className="h-5 w-5 text-[#D0BFB4]" />,
      action: "Start Minting",
      link: "/bark/create",
      category: "Creation"
    },
    { 
      title: "Stake BARK",
      description: "Earn rewards by staking your BARK tokens. Participate in the network's security and governance.", 
      icon: <Landmark className="h-5 w-5 text-[#D0BFB4]" />,
      action: "Stake Now",
      link: "/bark/stake",
      category: "Finance"
    },
    { 
      title: "Governance", 
      description: "Participate in BARK DAO governance. Vote on proposals and shape the future of the BARK Protocol.", 
      icon: <Vote className="h-5 w-5 text-[#D0BFB4]" />,
      action: "View Proposals",
      link: "/bark/governance",
      category: "Community"
    },
    { 
      title: "Swap", 
      description: "Easily swap BARK tokens with other tokens, cryptocurrencies using Jupiter API and DEX.", 
      icon: <Repeat className="h-5 w-5 text-[#D0BFB4]" />,
      action: "Start Swapping",
      link: "/bark/swap",
      category: "Finance"
    },
    { 
      title: "Analytics", 
      description: "Access detailed analytics and insights about BARK and tokens performance and ecosystem health.", 
      icon: <BarChart2 className="h-5 w-5 text-[#D0BFB4]" />,
      action: "View Analytics",
      link: "/bark/analytics",
      category: "Information"
    },
    { 
      title: "Donations", 
      description: "Support the BARK ecosystem by making donations to community-driven initiatives and projects.", 
      icon: <Heart className="h-5 w-5 text-[#D0BFB4]" />,
      action: "Donate Now",
      link: "/bark/donate",
      category: "Community"
    }
  ];

  const filteredActions = actions.filter(action => 
    (selectedCategory === 'All' || action.category === selectedCategory) &&
    (action.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     action.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ['All', ...new Set(actions.map(action => action.category))];

  return (
    <section id="actions" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-inter text-4xl sm:text-5xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">Actions</h2>
        <h3 className="font-poppins text-xl sm:text-2xl font-medium mb-4 text-center text-gray-500 dark:text-gray-400">Empower Your BARK Experience</h3>
        <p className="font-poppins text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          Explore the diverse range of actions you can take with BARKs. From minting, token swapping and staking to governance and analytics, unlock the full potential of the BARK Protocol.
        </p>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActions.map((action, index) => (
              <ActionCard key={index} {...action} />
            ))}
          </div>
        </AnimatePresence>
        {filteredActions.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No actions found. Try adjusting your search or category filter.</p>
        )}
      </div>
    </section>
  );
};
