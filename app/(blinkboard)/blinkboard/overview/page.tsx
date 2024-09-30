import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTransactions, getRewards } from '@/utils/account-data'

export default function AccountOverview() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState([])
  const [rewards, setRewards] = useState([])

  useEffect(() => {
    if (publicKey) {
      // Fetch transaction history and rewards
      getTransactions(publicKey).then(setTransactions)
      getRewards(publicKey).then(setRewards)
    }
  }, [publicKey])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Connected Wallet:</strong></p>
          <p className="text-sm text-gray-600">
            {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
          </p>
          <p><strong>Total Blinks:</strong> 15</p>
          <p><strong>BARK Balance:</strong> 15.000 BARK</p>

          {/* Recent Transactions */}
          <h3 className="mt-4 text-lg font-semibold">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {transactions.map((tx) => (
                <li key={tx.signature}>
                  {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)} - {tx.amount} BARK
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent transactions.</p>
          )}

          {/* Reward History */}
          <h3 className="mt-4 text-lg font-semibold">Reward History</h3>
          {rewards.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {rewards.map((reward, idx) => (
                <li key={idx}>{reward.amount} BARK - {reward.date}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No rewards claimed yet.</p>
          )}

          {/* Pending Actions */}
          <h3 className="mt-4 text-lg font-semibold">Pending Actions</h3>
          <p className="text-sm text-gray-500">Unclaimed NFTs: 2</p>
        </div>
      </CardContent>
    </Card>
  )
}
