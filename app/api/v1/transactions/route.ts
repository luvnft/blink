import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

const prisma = new PrismaClient()

const transactionSchema = z.object({
  blinkId: z.string().min(1),
  fromAddress: z.string().min(1),
  toAddress: z.string().min(1),
  amount: z.string().min(1),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAddress: session.user.address },
          { toAddress: session.user.address }
        ]
      },
      include: {
        blink: true
      }
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
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
    const validatedData = transactionSchema.parse(body)

    if (validatedData.fromAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify blink ownership
    const blink = await prisma.blink.findUnique({
      where: { id: validatedData.blinkId }
    })

    if (!blink || blink.ownerAddress !== validatedData.fromAddress) {
      return NextResponse.json({ error: 'Unauthorized: You do not own this Blink' }, { status: 401 })
    }

    // Perform the Solana transaction
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed')
    const fromPubkey = new PublicKey(validatedData.fromAddress)
    const toPubkey = new PublicKey(validatedData.toAddress)
    const lamports = parseFloat(validatedData.amount) * LAMPORTS_PER_SOL

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    )

    // Note: In a real-world scenario, you would need to sign this transaction
    // with the user's private key. This typically happens on the client-side.
    // Here, we're just simulating the transaction.

    const signature = await connection.sendTransaction(transaction, [])
    await connection.confirmTransaction(signature, 'confirmed')

    // Record the transaction in the database
    const newTransaction = await prisma.transaction.create({
      data: {
        blinkId: validatedData.blinkId,
        fromAddress: validatedData.fromAddress,
        toAddress: validatedData.toAddress,
        amount: validatedData.amount,
        signature,
      }
    })

    // Update blink ownership
    await prisma.blink.update({
      where: { id: validatedData.blinkId },
      data: { ownerAddress: validatedData.toAddress }
    })

    return NextResponse.json({ transaction: newTransaction }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}