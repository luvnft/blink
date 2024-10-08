import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from 'lucide-react'

interface Transaction {
  id: string
  recipient: string
  amount: number
  timestamp: Date
}

interface PaymentHistoryProps {
  transactions: Transaction[]
  isLoading: boolean
}

export function PaymentHistory({ transactions, isLoading }: PaymentHistoryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.recipient}</TableCell>
                  <TableCell>{tx.amount} SOL</TableCell>
                  <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}