import React from 'react';
import { BlinkAction } from '../types/blink';

interface BlinkCardProps {
  blink: BlinkAction;
}

const BlinkCard: React.FC<BlinkCardProps> = ({ blink }) => {
  // Check for title and description fallback
  const title = blink.title || 'Untitled Blink Action';
  const description = blink.description || 'No description available.';

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-sm text-gray-600">
        Date: {new Date(blink.date).toLocaleDateString()}
      </p>
      <a 
        href={`/blinkboard/${blink.id}`} 
        className="text-sand-500 mt-2 hover:underline" 
        aria-label={`View details for ${title}`}
      >
        View Details
      </a>
    </div>
  );
};

export default BlinkCard;
