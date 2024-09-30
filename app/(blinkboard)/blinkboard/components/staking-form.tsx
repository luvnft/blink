import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StakingPool } from '../types/staking';

interface StakingFormProps {
  pool: StakingPool; // Accepting a staking pool as a prop
  onStake: (amount: number, poolId: string) => Promise<void>; // Function to handle staking action
}

const StakingForm: React.FC<StakingFormProps> = ({ pool, onStake }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [stakingError, setStakingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const onSubmit = async (data: { amount: number }) => {
    setLoading(true); // Set loading state to true
    try {
      await onStake(data.amount, pool.id);
      setSuccessMessage(`Successfully staked ${data.amount} ${pool.token.symbol}!`);
      setStakingError(null);
    } catch (error) {
      setStakingError("Failed to stake tokens. Please try again.");
      setSuccessMessage(null);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Stake Tokens in {pool.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block mb-1">
            Amount to Stake
          </label>
          <input
            type="number"
            id="amount"
            {...register('amount', { 
              required: 'Amount is required.', 
              min: {
                value: 0.01,
                message: 'Minimum stake amount is 0.01.'
              },
              validate: {
                positive: value => value > 0 || 'Amount must be positive.' // Custom validation
              }
            })}
            className={`border rounded p-2 w-full ${errors.amount ? 'border-red-500' : ''}`}
            disabled={loading} // Disable input while loading
          />
          {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" 
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Staking...' : 'Stake'}
        </button>
      </form>

      {stakingError && <p className="text-red-500 mt-2" aria-live="polite">{stakingError}</p>}
      {successMessage && <p className="text-green-500 mt-2" aria-live="polite">{successMessage}</p>}
    </div>
  );
};

export default StakingForm;
