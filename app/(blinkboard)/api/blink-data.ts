import { BlinkAction } from '../types/blink'

export const getBlinkActions = async (): Promise<BlinkAction[]> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate an API response with possible errors
  const isError = Math.random() < 0.2; // 20% chance to simulate an error

  if (isError) {
    throw new Error('Failed to fetch blink actions. Please try again later.');
  }

  // Returning a simulated response
  return [
    {
      id: '1',
      title: 'Blink Action 1',
      description: 'This is a blink action description.',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'completed',
    },
    {
      id: '2',
      title: 'Blink Action 2',
      description: 'Another blink action happening.',
      date: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      status: 'pending',
    },
  ];
};
