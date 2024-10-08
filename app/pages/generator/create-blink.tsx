'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Loader2, Upload, Gift, DollarSign, Vote, Sparkles, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const CreateBlinkTool: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [blinkType, setBlinkType] = useState('standard')
  const [image, setImage] = useState<File | null>(null)
  const [isNFT, setIsNFT] = useState(false)
  const [isDonation, setIsDonation] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [isPayment, setIsPayment] = useState(false)
  const [isPoll, setIsPoll] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const router = useRouter()
  const { connected, publicKey, signTransaction } = useWallet()
  const { toast } = useToast()

  const onDrop = (acceptedFiles: File[]) => {
    setImage(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  })

  const handleCreateBlink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')

      let transaction = new web3.Transaction()
      let mint: web3.Keypair | null = null

      if (isNFT) {
        mint = web3.Keypair.generate()
        const lamports = await token.getMinimumBalanceForRentExemptMint(connection)

        transaction.add(
          web3.SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mint.publicKey,
            space: token.MINT_SIZE,
            lamports,
            programId: token.TOKEN_PROGRAM_ID,
          }),
          token.createInitializeMintInstruction(
            mint.publicKey,
            0,
            publicKey,
            publicKey,
            token.TOKEN_PROGRAM_ID
          )
        )
      }

      if (isPayment || isDonation) {
        const amountInLamports = web3.LAMPORTS_PER_SOL * parseFloat(amount)
        const recipientPubkey = new web3.PublicKey(recipient)

        transaction.add(
          web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: amountInLamports,
          })
        )

        // Generate Solana Pay QR code
        const urlFields: TransactionRequestURLFields = {
          recipient: recipientPubkey,
          amount: parseFloat(amount),
          label: name,
          message: description,
        }
        const url = encodeURL(urlFields)
        const qr = createQR(url)
        setQrCode(qr.toDataURL())
      }

      if (isGift) {
        // Add gift-specific logic here
        // For example, you might want to add metadata to the transaction
        // or create a special type of token for gifts
      }

      if (isPoll) {
        // Add poll/vote logic here
        // This might involve creating a new program account to store vote data
      }

      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
      transaction.feePayer = publicKey

      const signedTransaction = await signTransaction(transaction)

      if (mint) {
        signedTransaction.partialSign(mint)
      }

      const txid = await connection.sendRawTransaction(signedTransaction.serialize())

      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('blinkType', blinkType)
      formData.append('isNFT', isNFT.toString())
      formData.append('isDonation', isDonation.toString())
      formData.append('isGift', isGift.toString())
      formData.append('isPayment', isPayment.toString())
      formData.append('isPoll', isPoll.toString())
      formData.append('ownerAddress', publicKey.toBase58())
      formData.append('transactionId', txid)
      if (mint) {
        formData.append('mintAddress', mint.publicKey.toBase58())
      }
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch('/api/v1/blinks', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create Blink')
      }

      const data = await response.json()
      toast({
        title: "Blink created successfully!",
        description: `Your new Blink "${data.name}" has been minted.`,
      })
      router.push(`/blinks/${data.id}`)
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center text-foreground">Create Your Blink</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Design your unique Blink and share it with the world</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBlink} className="space-y-6 sm:space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Blink Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter a name for your Blink"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe your Blink"
                    rows={4}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blinkType">Blink Type</Label>
                  <Select value={blinkType} onValueChange={setBlinkType}>
                    <SelectTrigger id="blinkType" className="bg-background">
                      <SelectValue placeholder="Select Blink type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="limited">Limited Edition</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Blink Image</Label>
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
                          <span>Upload a file</span>
                          <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {image && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-muted-foreground"
                      >
                        Selected file: {image.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <Label htmlFor="isNFT" className="cursor-pointer">NFT</Label>
                    </div>
                    <Switch
                      id="isNFT"
                      checked={isNFT}
                      onCheckedChange={setIsNFT}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <Label htmlFor="isDonation" className="cursor-pointer">Donation</Label>
                    </div>
                    <Switch
                      id="isDonation"
                      checked={isDonation}
                      onCheckedChange={setIsDonation}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <Label htmlFor="isGift" className="cursor-pointer">Gift</Label>
                    </div>
                    <Switch
                      id="isGift"
                      checked={isGift}
                      onCheckedChange={setIsGift}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <Label htmlFor="isPayment" className="cursor-pointer">Payment</Label>
                    </div>
                    <Switch
                      id="isPayment"
                      checked={isPayment}
                      onCheckedChange={setIsPayment}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Vote className="h-5 w-5 text-primary" />
                      <Label htmlFor="isPoll" className="cursor-pointer">Poll / Vote (DAO)</Label>
                    </div>
                    <Switch
                      id="isPoll"
                      checked={isPoll}
                      onCheckedChange={setIsPoll}
                    />
                  </div>
                </div>
                {(isPayment || isDonation) && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (SOL)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder="Enter amount in SOL"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        
                        required
                        placeholder="Enter recipient's Solana address"
                        className="bg-background"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center pt-4"
            >
              <Button 
                type="submit"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base sm:text-lg px-6 sm:px-10 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating || !connected}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Blink
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
      {qrCode && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solana Pay QR Code</CardTitle>
            <CardDescription>Scan this QR code to make a payment</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img src={qrCode} alt="Solana Pay QR Code" />
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}