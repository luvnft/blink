import React from 'react';
import { AccountOverview } from './components/account-overview';
import { TransactionsList } from './components/transactions-list';
import { RewardHistory } from './components/reward-history';
import { PendingActions } from './components/pending-actions';
import { Governance } from './components/governance';

const AccountPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Account Overview</h1>

      {/* Account Overview with details */}
      <AccountOverview />

      {/* Recent Transactions */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium">Recent Transactions</h2>
        <TransactionsList />
      </section>

      {/* Reward History */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium">Reward History</h2>
        <RewardHistory />
      </section>

      {/* Pending Actions */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium">Pending Actions</h2>
        <PendingActions />
      </section>

      {/* Governance */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium">Governance</h2>
        <Governance />
      </section>
    </div>
  );
};

export default AccountPage;
