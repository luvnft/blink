import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NFTGrid } from "@/components/nft-grid"
import { CreateNFTForm } from "@/components/create-nft-form"
import { NFTDetails } from "@/components/nft-details"
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NFT } from '@/interfaces/nft'

export default function NFTPage() {
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState('my-nfts')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    }
  }, [connected, publicKey])

  const fetchNFTs = async () => {
    setLoading(true)
    setError(null)
    try {
      // Replace this with actual API call to fetch NFTs
      const response = await fetch(`/api/nfts?owner=${publicKey?.toBase58()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs')
      }
      const data = await response.json()
      setNfts(data)
    } catch (err) {
      setError('Failed to load NFTs. Please try again later.')
      console.error('Error fetching NFTs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredNFTs = nfts.filter(nft => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft)
    setActiveTab('nft-details')
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view and manage your NFTs.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">BARK NFTs</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="create-nft">Create NFT</TabsTrigger>
          <TabsTrigger value="nft-details" disabled={!selectedNFT}>NFT Details</TabsTrigger>
        </TabsList>
        <TabsContent value="my-nfts">
          <Card>
            <CardHeader>
              <CardTitle>My NFTs</CardTitle>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <NFTGrid nfts={filteredNFTs} onNFTClick={handleNFTClick} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create-nft">
          <Card>
            <CardHeader>
              <CardTitle>Create New NFT</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateNFTForm onSuccess={() => {
                setActiveTab('my-nfts')
                fetchNFTs()
              }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nft-details">
          {selectedNFT && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedNFT.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <NFTDetails nft={selectedNFT} />
                <div className="mt-4">
                  <Button onClick={() => setActiveTab('my-nfts')}>Back to My NFTs</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}