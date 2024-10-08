import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const prisma = new PrismaClient()

const mintSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  ownerAddress: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = mintSchema.parse(body)

    if (validatedData.ownerAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to Solana
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed')

    // Create a new keypair for the mint
    const mintKeypair = Keypair.generate()

    // Create a new token mint
    const createMintTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: new PublicKey(validatedData.ownerAddress),
        newAccountPubkey: mintKeypair.publicKey,
        space: Token.MINT_SIZE,
        lamports: await Token.getMinBalanceRentForExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        0,
        new PublicKey(validatedData.ownerAddress),
        new PublicKey(validatedData.ownerAddress)
      )
    )

    // Note: In a real-world scenario, you would need to sign this transaction
    // with the user's private key. This typically happens on the client-side.
    // Here, we're just simulating the transaction.

    const signature = await connection.sendTransaction(createMintTransaction, [mintKeypair])
    await connection.confirmTransaction(signature, 'confirmed')

    // Create the Blink in the database
    const blink = await prisma.blink.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        ownerAddress: validatedData.ownerAddress,
        mintAddress: mintKeypair.publicKey.toString(),
      },
    })

    return NextResponse.json({ blink }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error minting blink:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}