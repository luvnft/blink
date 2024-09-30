import { Connection, PublicKey } from '@solana/web3.js'

// Fetch recent transactions for a given account
export async function getTransactions(walletAddress: PublicKey) {
  const connection = new Connection('https://api.devnet.solana.com')
  const transactions = await connection.getConfirmedSignaturesForAddress2(walletAddress)

  // Mock recent transactions for demo purposes
  return transactions.slice(0, 5).map((tx) => ({
    signature: tx.signature,
    amount: '10', // Replace with actual amount fetched from parsed transaction
  }))
}

// Fetch reward history for a given account
export async function getRewards(walletAddress: PublicKey) {
  // Mock reward data for demo purposes
  return [
    { amount: '5.0 BARK', date: '2024-09-25' },
    { amount: '10.0 BARK', date: '2024-08-12' },
  ]
}
