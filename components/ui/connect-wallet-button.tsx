'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'

export const ConnectWalletButton: React.FC = () => {
  const { wallet, connect, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else if (wallet) {
      connect().catch(() => {})
    } else {
      setVisible(true)
    }
  }

  return (
    <Button 
      onClick={handleClick}
      className="bg-[#D0BFB4] text-gray-900 hover:bg-[#C0AFA4] transition-colors flex items-center space-x-2 px-4 py-2 rounded-full"
      disabled={connecting}
    >
      <Wallet className="h-5 w-5" />
      <span>
        {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet'}
      </span>
    </Button>
  )
}