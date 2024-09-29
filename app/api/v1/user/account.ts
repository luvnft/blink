import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { account: true },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({ user })
    } catch (error) {
      console.error('Error fetching user account:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    const { name, avatar, walletAddress } = req.body

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          account: {
            upsert: {
              create: { avatar, walletAddress },
              update: { avatar, walletAddress },
            },
          },
        },
        include: { account: true },
      })

      return res.status(200).json({ user: updatedUser })
    } catch (error) {
      console.error('Error updating user account:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}