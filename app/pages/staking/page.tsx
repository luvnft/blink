'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SolanaWalletProvider } from '@/components/SolanaWalletProvider'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement staking logic here
    console.log('Staking:', stakeAmount)
    alert('Tokens staked successfully!')
  }

  const handleUnstake = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement unstaking logic here
    console.log('Unstaking:', unstakeAmount)
    alert('Tokens unstaked successfully!')
  }

  return (
    <SolanaWalletProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Staking</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stake BARK</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStake} className="space-y-4">
                <div>
                  <Label htmlFor="stakeAmount">Amount to Stake</Label>
                  <Input id="stakeAmount" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} required />
                </div>
                <Button type="submit">Stake</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unstake BARK</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnstake} className="space-y-4">
                <div>
                  <Label htmlFor="unstakeAmount">Amount to Unstake</Label>
                  <Input id="unstakeAmount" type="number" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} required />
                </div>
                <Button type="submit">Unstake</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SolanaWalletProvider>
  )
}