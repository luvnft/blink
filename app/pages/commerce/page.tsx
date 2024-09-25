'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SolanaWalletProvider } from '@/components/SolanaWalletProvider'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockProducts = [
  { id: 1, name: 'BARK T-Shirt', price: 20, image: '/placeholder.svg?height=200&width=200' },
  { id: 2, name: 'BARK Hoodie', price: 40, image: '/placeholder.svg?height=200&width=200' },
  { id: 3, name: 'BARK Cap', price: 15, image: '/placeholder.svg?height=200&width=200' },
]

const mockOrders = [
  { id: 1, product: 'BARK T-Shirt', status: 'Shipped', date: '2024-09-15' },
  { id: 2, product: 'BARK Hoodie', status: 'Processing', date: '2024-09-14' },
]

export default function Commerce() {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <SolanaWalletProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">BARK Commerce</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                    <p className="text-lg font-semibold mb-2">${product.price}</p>
                    <Button className="w-full">Add to Cart</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockOrders.map((order) => (
                    <li key={order.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{order.product}</p>
                        <p className="text-sm text-gray-600">Order Date: {order.date}</p>
                      </div>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SolanaWalletProvider>
  )
}