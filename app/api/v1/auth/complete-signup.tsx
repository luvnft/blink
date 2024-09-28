import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const completeSignupSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  }),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const validationResult = completeSignupSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid input', errors: validationResult.error.flatten().fieldErrors })
    }

    const { username } = validationResult.data

    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        onboardingCompleted: true,
      },
    })

    return res.status(200).json({
      message: 'Signup completed successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error('Complete signup error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    await prisma.$disconnect()
  }
}