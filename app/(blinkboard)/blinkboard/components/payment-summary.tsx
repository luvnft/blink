import React from 'react'

interface PaymentSummaryProps {
  amount: number;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ amount }) => {
  // Function to format the amount as currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-md">
      <h3 className="text-lg font-semibold">Donation Summary</h3>
      <p className="text-sm text-gray-500">
        You are donating: <span aria-label={`Donation amount of ${amount}`} className="font-bold">{formatCurrency(amount)}</span>
      </p>
      {amount <= 0 && (
        <p className="text-red-500 text-sm">Please enter a valid donation amount.</p>
      )}
    </div>
  )
}
