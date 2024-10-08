'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Code, Book, Terminal } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const API_ENDPOINTS = [
  {
    name: 'Get Token Balance',
    endpoint: '/api/v1/token/balance',
    method: 'GET',
    description: 'Retrieve the BARK token balance for a given wallet address.',
    parameters: [
      { name: 'address', type: 'string', description: 'Wallet address' }
    ],
    response: `{
  "success": true,
  "data": {
    "address": "5YourWalletAddressHere...",
    "balance": 1000.50
  }
}`
  },
  {
    name: 'Transfer Tokens',
    endpoint: '/api/v1/token/transfer',
    method: 'POST',
    description: 'Transfer BARK tokens from one wallet to another.',
    parameters: [
      { name: 'fromAddress', type: 'string', description: 'Sender wallet address' },
      { name: 'toAddress', type: 'string', description: 'Recipient wallet address' },
      { name: 'amount', type: 'number', description: 'Amount of BARK tokens to transfer' }
    ],
    response: `{
  "success": true,
  "data": {
    "transactionId": "2ZueXkN7bkb1Qfnq3UXCZx9yYJ1YRdUCuXXh6tFqe5v7",
    "fromAddress": "5SenderWalletAddressHere...",
    "toAddress": "5RecipientWalletAddressHere...",
    "amount": 100.00
  }
}`
  },
  {
    name: 'Get NFT Collection',
    endpoint: '/api/v1/nft/collection',
    method: 'GET',
    description: 'Retrieve the BARK Blink NFT collection for a given wallet address.',
    parameters: [
      { name: 'address', type: 'string', description: 'Wallet address' }
    ],
    response: `{
  "success": true,
  "data": {
    "address": "5YourWalletAddressHere...",
    "nfts": [
      {
        "id": "NFT1",
        "name": "BARK Blink #001",
        "image": "https://example.com/nft1.png"
      },
      {
        "id": "NFT2",
        "name": "BARK Blink #002",
        "image": "https://example.com/nft2.png"
      }
    ]
  }
}`
  },
]

const SDK_EXAMPLE = `
import { BarkBlinkSDK } from 'bark-blink-sdk';

// Initialize the SDK
const sdk = new BarkBlinkSDK('YOUR_API_KEY');

// Get token balance
const balance = await sdk.getTokenBalance('5YourWalletAddressHere...');
console.log('BARK Token Balance:', balance);

// Transfer tokens
const transfer = await sdk.transferTokens({
  fromAddress: '5SenderWalletAddressHere...',
  toAddress: '5RecipientWalletAddressHere...',
  amount: 100.00
});
console.log('Transfer Transaction ID:', transfer.transactionId);

// Get NFT collection
const nfts = await sdk.getNFTCollection('5YourWalletAddressHere...');
console.log('BARK Blink NFTs:', nfts);
`

export default function APIPage() {
  const [activeTab, setActiveTab] = useState('endpoints')

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/" passHref>
        <Button variant="ghost" className="mb-4 hover:bg-primary/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">BARK Blink API & SDK</CardTitle>
            <CardDescription>Explore our API endpoints and SDK for integrating BARK Blink into your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="endpoints">
                  <Code className="mr-2 h-4 w-4" />
                  API Endpoints
                </TabsTrigger>
                <TabsTrigger value="sdk">
                  <Book className="mr-2 h-4 w-4" />
                  SDK Documentation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="endpoints">
                <div className="space-y-6">
                  {API_ENDPOINTS.map((endpoint, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-xl">{endpoint.name}</CardTitle>
                        <CardDescription>{endpoint.method} {endpoint.endpoint}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{endpoint.description}</p>
                        <h4 className="font-semibold mb-2">Parameters:</h4>
                        <ul className="list-disc pl-5 mb-4">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <li key={paramIndex}>
                              <code>{param.name}</code> ({param.type}): {param.description}
                            </li>
                          ))}
                        </ul>
                        <h4 className="font-semibold mb-2">Example Response:</h4>
                        <SyntaxHighlighter language="json" style={tomorrow}>
                          {endpoint.response}
                        </SyntaxHighlighter>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="sdk">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">BARK Blink SDK</CardTitle>
                    <CardDescription>Easily integrate BARK Blink functionality into your JavaScript applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Installation</h3>
                    
                    <SyntaxHighlighter language="bash" style={tomorrow}>
                      npm install bark-blink-sdk
                    </SyntaxHighlighter>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Usage Example</h3>
                    <SyntaxHighlighter language="javascript" style={tomorrow}>
                      {SDK_EXAMPLE}
                    </SyntaxHighlighter>
                    <p className="mt-4">
                      For full SDK documentation and more examples, please visit our{' '}
                      <a href="#" className="text-blue-500 hover:underline">GitHub repository</a>.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}