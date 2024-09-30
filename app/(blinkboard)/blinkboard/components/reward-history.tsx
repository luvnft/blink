import React, { useEffect, useState } from 'react';
import { fetchRewardHistory } from '../api/fetch-reward-history';

// Define the Reward interface for type safety
interface Reward {
  id: string; // Unique identifier for each reward
  date: string;
  amount: number;
  description: string;
}

export const RewardHistory: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRewards() {
      try {
        const data = await fetchRewardHistory();
        setRewards(data);
      } catch (error) {
        setError('Failed to fetch reward history');
        console.error('Error fetching reward history:', error);
      } finally {
        setLoading(false);
      }
    }

    getRewards();
  }, []);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      {loading ? (
        <p>Loading reward history...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : rewards.length > 0 ? (
        <ul role="list" className="space-y-3">
          {rewards.map((reward) => (
            <li key={reward.id} className="p-2 border-b">
              <span className="font-medium">Date:</span> {reward.date} <br />
              <span className="font-medium">Amount:</span> {reward.amount} BARK <br />
              <span className="font-medium">Description:</span> {reward.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rewards history available.</p>
      )}
    </div>
  );
};
