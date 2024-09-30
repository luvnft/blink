import React, { useEffect, useState } from 'react';
import { FaWallet, FaCoins, FaAward, FaGem } from 'react-icons/fa';

interface AccountData {
  name: string;
  address: string;
  totalBalance: number;
  stakedNFTs: number;
  unclaimedRewards: number;
}

export const AccountOverview: React.FC = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // Replace with actual API call
        const data: AccountData = {
          name: "BARK",
          address: "gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR",
          totalBalance: 1200,
          stakedNFTs: 5,
          unclaimedRewards: 50
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAccountData(data);
      } catch (err) {
        setError('Failed to load account data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading account information...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!accountData) {
    return <p className="text-gray-600">No account data available.</p>;
  }

  return (
    <div className="p-6 bg-gray-200 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-2">Welcome, {accountData.name}</h2>
      <div className="flex items-center mb-2">
        <FaWallet className="text-blue-500 mr-2" />
        <p className="text-sm text-gray-700">Address: {accountData.address}</p>
      </div>
      <div className="flex items-center mb-2">
        <FaCoins className="text-green-500 mr-2" />
        <p className="text-sm text-gray-700">Total Balance: ${accountData.totalBalance.toFixed(2)}</p>
      </div>
      <div className="flex items-center mb-2">
        <FaGem className="text-yellow-500 mr-2" />
        <p className="text-sm text-gray-700">Staked NFTs: {accountData.stakedNFTs}</p>
      </div>
      <div className="flex items-center">
        <FaAward className="text-purple-500 mr-2" />
        <p className="text-sm text-gray-700">Unclaimed Rewards: {accountData.unclaimedRewards} BARK</p>
      </div>
    </div>
  );
};
