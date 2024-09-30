import React from 'react';

interface Token {
  symbol: string;
  // Add more properties as needed, such as name, logo, etc.
}

interface SwapSummaryProps {
  fromToken: Token | null;
  toToken: Token | null;
  amount: number;
  estimatedRate?: number; // Optional estimated rate prop
  transactionFee?: number; // Optional transaction fee prop
}

export const SwapSummary: React.FC<SwapSummaryProps> = ({
  fromToken,
  toToken,
  amount,
  estimatedRate = 0.98, // Default estimated rate
  transactionFee = 0.001, // Default transaction fee
}) => {
  if (!fromToken || !toToken || amount <= 0) {
    return <p className="text-red-500">Please complete the swap form.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-medium">Swap Summary</h3>
      <p>{amount} {fromToken.symbol} to {toToken.symbol}</p>
      <p className="text-sm text-gray-500">Estimated rate: 1 {fromToken.symbol} = {estimatedRate} {toToken.symbol}</p>
      <p className="text-sm text-gray-500">Transaction Fee: {transactionFee} SOL</p>
    </div>
  );
};
