import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createBlink } from '@/utils/solana'
import { PublicKey } from '@solana/web3.js'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const blinks = await prisma.blink.findMany({
    skip: offset,
    take: limit,
    include: { owner: true },
  })

  const total = await prisma.blink.count()

  return NextResponse.json({
    items: blinks,
    total,
    limit,
    offset,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.name || !body.description || !body.ownerAddress) {
    return NextResponse.json({ error: 'Name, description, and owner address are required' }, { status: 400 })
  }

  try {
    const ownerPublicKey = new PublicKey(body.ownerAddress)
    const mintAddress = await createBlink(ownerPublicKey, body.name, body.description)

    const blink = await prisma.blink.create({
      data: {
        name: body.name,
        description: body.description,
        owner: { connect: { id: body.ownerAddress } },
        mintAddress,
        metadata: body.metadata || {},
      },
    })

    return NextResponse.json(blink, { status: 201 })
  } catch (error) {
    console.error('Error creating Blink:', error)
    return NextResponse.json({ error: 'Failed to create Blink' }, { status: 500 })
  }
}