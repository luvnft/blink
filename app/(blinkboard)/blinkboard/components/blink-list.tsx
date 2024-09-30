import React from 'react';
import BlinkCard from './blink-card';
import { useBlinkData } from '../hooks/use-blink-data';

const BlinkList: React.FC = () => {
  const { blinkActions, loading, error } = useBlinkData();

  if (loading) {
    return <div className="flex items-center justify-center h-32"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-32 text-red-500"><p>Error fetching data: {error.message}</p></div>;
  }

  if (blinkActions.length === 0) {
    return <div className="flex items-center justify-center h-32 text-gray-500"><p>No blink actions available.</p></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {blinkActions.map((blink) => (
        <BlinkCard key={blink.id} blink={blink} />
      ))}
    </div>
  );
};

export default BlinkList;
