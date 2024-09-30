import React, { useState } from 'react';
import { TokenSelector } from './token-selector';
import { executeSwap } from '../api/execute-swap';
import { toast } from 'react-toastify';

export const SwapForm: React.FC = () => {
  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSwap = async () => {
    if (!fromToken || !toToken || amount <= 0) {
      toast.error('Please select tokens and enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      await executeSwap(fromToken, toToken, amount);
      toast.success('Swap successful!');
      // Optionally reset form
      setFromToken(null);
      setToToken(null);
      setAmount(0);
    } catch (error) {
      console.error(error);
      toast.error('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow space-y-4">
      <TokenSelector selectedToken={fromToken} onSelectToken={setFromToken} label="From" />
      <TokenSelector selectedToken={toToken} onSelectToken={setToToken} label="To" />

      <div className="flex flex-col">
        <label className="text-sm text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 rounded-md mt-1"
          placeholder="Enter amount"
          min={0} // Prevent negative values
        />
      </div>

      <button
        onClick={handleSwap}
        className={`w-full p-3 mt-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Swap Tokens'}
      </button>
    </div>
  );
};
