import React, { useEffect, useState } from 'react';

// Sample interface for Pending Action type
interface PendingAction {
  id: string; // Unique identifier for each action
  type: string;
  description: string;
}

export const PendingActions: React.FC = () => {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated fetching of pending actions (replace with actual data fetching)
  useEffect(() => {
    const fetchPendingActions = async () => {
      // Simulate an API call
      const actions: PendingAction[] = [
        { id: '1', type: 'Unclaimed NFT', description: 'Exclusive BARK NFT available to claim.' },
        { id: '2', type: 'Pending Reward', description: '50 BARK tokens unclaimed.' }
      ];
      setPendingActions(actions);
      setLoading(false);
    };

    fetchPendingActions();
  }, []);

  return (
    <div className="p-4 bg-white rounded-md shadow">
      {loading ? (
        <p>Loading pending actions...</p>
      ) : pendingActions.length > 0 ? (
        <ul role="list" className="space-y-3">
          {pendingActions.map((action) => (
            <li key={action.id} className="p-2 border-b">
              <span className="font-medium">{action.type}:</span> {action.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending actions at this time.</p>
      )}
    </div>
  );
};
