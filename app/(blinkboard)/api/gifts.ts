import type { NextApiRequest, NextApiResponse } from 'next'
import { Gift } from '@/types/gift'

const gifts: Gift[] = [
  { id: '1', name: 'Mystery Box', description: 'A surprise gift box!', type: 'Physical' },
  { id: '2', name: 'Gift Card', description: 'A gift card for your favorite store', type: 'Digital' },
  { id: '3', name: 'Charity Donation', description: 'Donate on behalf of someone', type: 'Donation' },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate'); // Optional: add caching
    res.status(200).json(gifts);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
