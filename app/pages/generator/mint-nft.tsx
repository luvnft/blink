'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, PlusCircle, Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const MintNFT: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [attributes, setAttributes] = useState([{ trait_type: '', value: '' }])
  const [image, setImage] = useState<File | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [isRoyalty, setIsRoyalty] = useState(false)
  const [royaltyPercentage, setRoyaltyPercentage] = useState('')
  const { connected, publicKey, signTransaction } = useWallet()
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  })

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }])
  }

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index)
    setAttributes(newAttributes)
  }

  const handleAttributeChange = (index: number, key: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][key] = value
    setAttributes(newAttributes)
  }

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT.",
        variant: "destructive",
      })
      return
    }

    if (!name || !description || !image) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      // Connect to the Solana devnet
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

      // Create a new mint
      const mint = await createMint(
        connection,
        publicKey,
        publicKey,
        null,
        0 // 0 decimals for NFT
      )

      // Get the token account of the wallet address
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint,
        publicKey
      )

      // Mint 1 token to the token account
      await mintTo(
        connection,
        publicKey,
        mint,
        tokenAccount.address,
        publicKey,
        1
      )

      // Here you would typically upload the image and metadata to IPFS or Arweave
      // and update the token's metadata with the URI

      // For this example, we'll just log the NFT details
      console.log('Minted NFT:', {
        mint: mint.toBase58(),
        tokenAccount: tokenAccount.address.toBase58(),
        name,
        description,
        attributes,
        image: image.name,
        royalty: isRoyalty ? `${royaltyPercentage}%` : 'None'
      })

      toast({
        title: "NFT minted successfully!",
        description: `Your NFT "${name}" has been minted and added to your wallet.`,
      })

      // Reset form after successful minting
      setName('')
      setDescription('')
      setAttributes([{ trait_type: '', value: '' }])
      setImage(null)
      setIsRoyalty(false)
      setRoyaltyPercentage('')
    } catch (error) {
      console.error('Error minting NFT:', error)
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-foreground">Mint Your NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleMintNFT} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">NFT Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter NFT name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your NFT"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Attributes</Label>
              {attributes.map((attr, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <Input
                    value={attr.trait_type}
                    onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                    placeholder="Trait"
                    className="w-1/2"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-1/2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddAttribute}
                variant="outline"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Attribute
              </Button>
            </div>
            <div className="space-y-2">
              <Label>NFT Image</Label>
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ease-in-out ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload an image</span>
                      <input {...getInputProps()} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {image && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected file: {image.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="royalty"
                checked={isRoyalty}
                onCheckedChange={setIsRoyalty}
              />
              <Label htmlFor="royalty">Enable Royalties</Label>
            </div>
            {isRoyalty && (
              <div className="space-y-2">
                <Label htmlFor="royaltyPercentage">Royalty Percentage</Label>
                <Input
                  id="royaltyPercentage"
                  type="number"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  placeholder="Enter royalty percentage"
                />
              </div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMinting || !connected}
              >
                {isMinting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Minting NFT...
                  </>
                ) : (
                  'Mint NFT'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </CardContent>
    </Card>
  )
}