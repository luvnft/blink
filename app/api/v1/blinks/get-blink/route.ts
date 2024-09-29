// app/api/v1/blinks/get-blink/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the blinkId from the query parameters
    const { searchParams } = new URL(req.url);
    const blinkId = searchParams.get('blinkId');

    if (!blinkId) {
      return NextResponse.json({ error: 'Blink ID is required' }, { status: 400 });
    }

    // Fetch the Blink from the database
    const blink = await prisma.blink.findUnique({
      where: { id: blinkId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        collection: true,
        attributes: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    // Check if the user is the owner of the Blink
    const isOwner = blink.ownerId === session.user.id;

    // If the user is not the owner, remove sensitive information
    if (!isOwner) {
      delete blink.owner.email;
      blink.transactions = [];
    }

    return NextResponse.json(blink);
  } catch (error) {
    console.error('Error fetching Blink:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}