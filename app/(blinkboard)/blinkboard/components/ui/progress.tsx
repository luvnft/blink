import React from 'react';

interface ProgressProps {
  progress: number; // Progress value between 0 and 100
  label?: string; // Optional label for the progress bar
}

const Progress: React.FC<ProgressProps> = ({ progress, label }) => {
  return (
    <div className="relative w-full h-6 bg-gray-200 rounded-lg">
      <div
        className={`absolute top-0 left-0 h-full bg-green-500 rounded-lg transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
      {label && (
        <span className="absolute inset-0 flex items-center justify-center font-semibold text-black">
          {label} {progress}%
        </span>
      )}
    </div>
  );
};

export default Progress;
