import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-900">
      <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Oops! Something went wrong</h2>
      <pre className="text-sm text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-800 p-4 rounded-md mb-4">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};