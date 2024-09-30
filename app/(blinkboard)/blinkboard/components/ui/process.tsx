import React, { useState, useEffect } from 'react';
import Progress from '../components/ui/progress';

const ProcessPage: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Bar Example</h1>
      <Progress progress={progress} label="Loading" />
    </div>
  );
};

export default ProcessPage;
