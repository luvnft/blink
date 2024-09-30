'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button'
import { useToast } from '@/components/ui/use-toast'
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, X, Info } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BlinkData {
  name: string
  description: string
  type: string
  supply: string
  royalties: string
  isTransferable: boolean
  image: File | null
}

const initialBlinkData: BlinkData = {
  name: '',
  description: '',
  type: 'standard',
  supply: '1',
  royalties: '5',
  isTransferable: true,
  image: null,
}

export default function CreateBlinkPage() {
  const router = useRouter()
  const { connected, publicKey, signTransaction } = useWallet()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [blinkData, setBlinkData] = useState<BlinkData>(initialBlinkData)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
    }
  }, [connected, toast])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBlinkData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((value: string) => {
    setBlinkData(prev => ({ ...prev, type: value }))
  }, [])

  const handleSwitchChange = useCallback((checked: boolean) => {
    setBlinkData(prev => ({ ...prev, isTransferable: checked }))
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setBlinkData(prev => ({ ...prev, image: file }))
    setPreviewUrl(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 1
  })

  const removeImage = useCallback(() => {
    setBlinkData(prev => ({ ...prev, image: null }))
    setPreviewUrl(null)
  }, [])

  const validateBlinkData = useCallback((data: BlinkData): string | null => {
    if (!data.name.trim()) return "Blink name is required"
    if (!data.description.trim()) return "Description is required"
    if (isNaN(Number(data.supply)) || Number(data.supply) < 1) return "Supply must be a positive number"
    if (isNaN(Number(data.royalties)) || Number(data.royalties) < 0 || Number(data.royalties) > 15) return "Royalties must be between 0 and 15%"
    if (!data.image) return "An image is required for the Blink"
    return null
  }, [])

  const createBlinkOnChain = useCallback(async (data: BlinkData) => {
    if (!publicKey || !signTransaction) throw new Error("Wallet not connected")

    const connection = new Connection("https://api.devnet.solana.com", "confirmed")
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey("11111111111111111111111111111111"),
        lamports: LAMPORTS_PER_SOL * 0.01 // 0.01 SOL as a placeholder fee
      })
    )

    const { blockhash } = await connection.getRecentBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey

    const signedTransaction = await signTransaction(transaction)
    const txid = await connection.sendRawTransaction(signedTransaction.serialize())
    await connection.confirmTransaction(txid)

    return txid
  }, [publicKey, signTransaction])

  const uploadImageToIPFS = useCallback(async (file: File) => {
    // Placeholder for IPFS upload logic
    // In a real implementation, you would upload the file to IPFS here
    // and return the IPFS hash
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating upload delay
    return "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const validationError = validateBlinkData(blinkData)
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const imageHash = await uploadImageToIPFS(blinkData.image!)
      const txid = await createBlinkOnChain(blinkData)
      
      toast({
        title: "Success!",
        description: `Your Blink "${blinkData.name}" has been created. Transaction ID: ${txid}`,
        variant: "success",
      })
      router.push('/blinkboard')
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: "There was an error creating your Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [blinkData, validateBlinkData, createBlinkOnChain, uploadImageToIPFS, toast, router])

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Connect Your Wallet to Create a Blink</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Create a New Blink</CardTitle>
          <CardDescription className="text-center">Fill in the details to create your new Blink</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Blink Name</Label>
              <Input
                id="name"
                name="name"
                value={blinkData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter Blink name"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={blinkData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your Blink"
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Blink Type</Label>
              <Select value={blinkData.type} onValueChange={handleSelectChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select Blink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supply" className="text-sm font-medium">Supply</Label>
                <Input
                  id="supply"
                  name="supply"
                  type="number"
                  value={blinkData.supply}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="royalties" className="text-sm font-medium">Royalties (%)</Label>
                <Input
                  id="royalties"
                  name="royalties"
                  type="number"
                  value={blinkData.royalties}
                  onChange={handleInputChange}
                  min="0"
                  max="15"
                  step="0.5"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isTransferable"
                  checked={blinkData.isTransferable}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isTransferable" className="text-sm font-medium">Transferable</Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>If enabled, this Blink can be transferred to other users.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Blink Image</Label>
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
                {previewUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="relative mt-4 w-full h-48"
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                      aria-label="Remove image"
                    >
                      <X className="h-5 w-5 text-foreground" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Blink'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}