import React, { useEffect, useState } from 'react'
import { fetchUserTransactions } from '../api/fetch-user-transactions'

export const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    async function getTransactions() {
      const data = await fetchUserTransactions()
      setTransactions(data)
    }
    getTransactions()
  }, [])

  return (
    <div className="p-4 bg-white rounded-md shadow">
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map((tx: any, index: number) => (
            <li key={index} className="p-2 border-b">
              <span className="font-medium">Tx ID:</span> {tx.txId} <br />
              <span className="font-medium">Date:</span> {tx.date} <br />
              <span className="font-medium">Amount:</span> ${tx.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent transactions found.</p>
      )}
    </div>
  )
}
