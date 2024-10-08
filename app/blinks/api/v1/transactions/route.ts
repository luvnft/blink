import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

const blinkSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  ownerAddress: z.string().min(1),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blinks = await prisma.blink.findMany({
      where: { ownerAddress: session.user.address },
    })

    return NextResponse.json({ blinks })
  } catch (error) {
    console.error('Error fetching blinks:', error)
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
    const validatedData = blinkSchema.parse(body)

    if (validatedData.ownerAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blink = await prisma.blink.create({
      data: validatedData,
    })

    return NextResponse.json({ blink }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating blink:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Blink ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const validatedData = blinkSchema.partial().parse(body)

    const existingBlink = await prisma.blink.findUnique({
      where: { id },
    })

    if (!existingBlink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
    }

    if (existingBlink.ownerAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedBlink = await prisma.blink.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ blink: updatedBlink })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating blink:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Blink ID is required' }, { status: 400 })
    }

    const existingBlink = await prisma.blink.findUnique({
      where: { id },
    })

    if (!existingBlink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
    }

    if (existingBlink.ownerAddress !== session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.blink.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Blink deleted successfully' })
  } catch (error) {
    console.error('Error deleting blink:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}