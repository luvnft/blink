'use client'

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, walletAdapterIdentity, bundlrStorage } from '@metaplex-foundation/js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { motion } from 'framer-motion'

// Replace with your actual Merkle tree address
const MERKLE_TREE_ADDRESS = 'YOUR_MERKLE_TREE_ADDRESS'

export default function CreateCNFTPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { connected, publicKey, signTransaction } = useWallet()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleCreateCNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a compressed NFT.",
        variant: "destructive",
      })
      return
    }

    if (!name || !description || !image) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload an image.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity({ publicKey, signTransaction }))
        .use(bundlrStorage())

      // Upload the image
      const imageUrl = await metaplex.storage().upload(image)

      // Create metadata
      const { uri } = await metaplex.nfts().uploadMetadata({
        name,
        description,
        image: imageUrl,
      })

      // Create the compressed NFT
      const merkleTree = new PublicKey(MERKLE_TREE_ADDRESS)
      const { response } = await metaplex.nfts().create({
        uri,
        name,
        sellerFeeBasisPoints: 500, // 5% royalty
        compression: {
          compressed: true,
          tree: merkleTree,
          limit: 10000,
        },
      })

      toast({
        title: "Compressed NFT Created",
        description: `Successfully created compressed NFT: ${name}`,
      })
      setName('')
      setDescription('')
      setImage(null)
    } catch (error) {
      console.error('Error creating compressed NFT:', error)
      toast({
        title: "Error",
        description: "Failed to create compressed NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create Compressed NFT</CardTitle>
            <CardDescription>Mint a new compressed NFT on the Solana blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {connected ? (
              <form onSubmit={handleCreateCNFT} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">NFT Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter NFT name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !name || !description || !image}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Compressed NFT
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 text-lg text-muted-foreground">Please connect your wallet to create a compressed NFT.</p>
                <ConnectWalletButton />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}