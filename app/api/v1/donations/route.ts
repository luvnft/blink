import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

const prisma = new PrismaClient()

const donationSchema = z.object({
  amount: z.number().positive(),
  fromAddress: z.string().min(1),
  toAddress: z.string().min(1),
  message: z.string().max(500).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const donations = await prisma.donation.findMany({
      where: {
        OR: [
          { fromAddress: session.user.address },
          { toAddress: session.user.address }
        ]
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.donation.count({
      where: {
        OR: [
          { fromAddress: session.user.address },
          { toAddress: session.user.address }
        ]
      },
    })

    return NextResponse.json({ donations, total, limit, offset })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = donationSchema.parse(body)

    if (validatedData.fromAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to Solana
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed')
    const fromPubkey = new PublicKey(validatedData.fromAddress)
    const toPubkey = new PublicKey(validatedData.toAddress)

    // Create and send transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: validatedData.amount * LAMPORTS_PER_SOL,
      })
    )

    // Note: In a real-world scenario, you would need to sign this transaction
    // with the user's private key. This typically happens on the client-side.
    // Here, we're just simulating the transaction.
    const signature = await connection.sendTransaction(transaction, [])
    await connection.confirmTransaction(signature, 'confirmed')

    // Record the donation in the database
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,
        fromAddress: validatedData.fromAddress,
        toAddress: validatedData.toAddress,
        message: validatedData.message,
        transactionSignature: signature,
      },
    })

    return NextResponse.json({ donation }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}