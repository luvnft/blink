'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const apiEndpoints = [
  { 
    method: 'GET', 
    endpoint: '/api/v1/blinks', 
    description: 'Fetch all Blinks',
    parameters: [],
    responseExample: '[\n  {\n    "id": "1",\n    "name": "My First Blink",\n    "description": "A sample Blink",\n    "ownerAddress": "5ogiZZ..."\n  }\n]'
  },
  { 
    method: 'POST', 
    endpoint: '/api/v1/blinks', 
    description: 'Create a new Blink',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Name of the Blink' },
      { name: 'description', type: 'string', required: true, description: 'Description of the Blink' },
      { name: 'ownerAddress', type: 'string', required: true, description: 'Solana address of the Blink owner' }
    ],
    responseExample: '{\n  "id": "2",\n  "name": "New Blink",\n  "description": "A newly created Blink",\n  "ownerAddress": "5ogiZZ..."\n}'
  },
  { 
    method: 'GET', 
    endpoint: '/api/v1/blinks/:id', 
    description: 'Fetch a specific Blink',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'ID of the Blink to fetch' }
    ],
    responseExample: '{\n  "id": "1",\n  "name": "My First Blink",\n  "description": "A sample Blink",\n  "ownerAddress": "5ogiZZ..."\n}'
  },
  { 
    method: 'PUT', 
    endpoint: '/api/v1/blinks/:id', 
    description: 'Update a Blink',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'ID of the Blink to update' },
      { name: 'name', type: 'string', required: false, description: 'New name of the Blink' },
      { name: 'description', type: 'string', required: false, description: 'New description of the Blink' }
    ],
    responseExample: '{\n  "id": "1",\n  "name": "Updated Blink",\n  "description": "An updated Blink",\n  "ownerAddress": "5ogiZZ..."\n}'
  },
  { 
    method: 'DELETE', 
    endpoint: '/api/v1/blinks/:id', 
    description: 'Delete a Blink',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'ID of the Blink to delete' }
    ],
    responseExample: '{\n  "message": "Blink successfully deleted"\n}'
  },
  { 
    method: 'GET', 
    endpoint: '/api/v1/transactions', 
    description: 'Fetch all transactions',
    parameters: [],
    responseExample: '[\n  {\n    "id": "1",\n    "blinkId": "1",\n    "fromAddress": "5ogiZZ...",\n    "toAddress": "9pgiYY...",\n    "amount": "0.5",\n    "timestamp": "2023-05-01T10:00:00Z"\n  }\n]'
  },
  { 
    method: 'POST', 
    endpoint: '/api/v1/transactions', 
    description: 'Create a new transaction',
    parameters: [
      { name: 'blinkId', type: 'string', required: true, description: 'ID of the Blink being transferred' },
      { name: 'fromAddress', type: 'string', required: true, description: 'Solana address of the sender' },
      { name: 'toAddress', type: 'string', required: true, description: 'Solana address of the recipient' },
      { name: 'amount', type: 'string', required: true, description: 'Amount of SOL to transfer' }
    ],
    responseExample: '{\n  "id": "2",\n  "blinkId": "1",\n  "fromAddress": "5ogiZZ...",\n  "toAddress": "9pgiYY...",\n  "amount": "0.5",\n  "timestamp": "2023-05-01T11:00:00Z"\n}'
  },
]

export default function ApiPage() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEndpoints = apiEndpoints.filter(endpoint => 
    endpoint.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">BARK Blink API Documentation</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Available endpoints for the BARK Blink API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search">Search Endpoints</Label>
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                id="search"
                placeholder="Search by method, endpoint, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.map((endpoint, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {endpoint.method}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">{endpoint.endpoint}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedEndpoint(expandedEndpoint === index ? null : index)}
                        >
                          {expandedEndpoint === index ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <AnimatePresence>
                      {expandedEndpoint === index && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Tabs defaultValue="parameters" className="w-full">
                                <TabsList>
                                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                                  <TabsTrigger value="response">Response Example</TabsTrigger>
                                </TabsList>
                                <TabsContent value="parameters">
                                  {endpoint.parameters.length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Type</TableHead>
                                          <TableHead>Required</TableHead>
                                          <TableHead>Description</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {endpoint.parameters.map((param, paramIndex) => (
                                          <TableRow key={paramIndex}>
                                            <TableCell>{param.name}</TableCell>
                                            <TableCell>{param.type}</TableCell>
                                            <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                                            <TableCell>{param.description}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <p>No parameters required for this endpoint.</p>
                                  )}
                                </TabsContent>
                                <TabsContent value="response">
                                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                                    <code>{endpoint.responseExample}</code>
                                  </pre>
                                </TabsContent>
                              </Tabs>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}