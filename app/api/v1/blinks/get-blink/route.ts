import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const ip = req.ip ?? 'anonymous';
    const { success } = await rateLimit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

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

    // Prepare the response data
    const responseData = {
      id: blink.id,
      name: blink.name,
      description: blink.description,
      imageUrl: blink.imageUrl,
      mintAddress: blink.mintAddress,
      createdAt: blink.createdAt,
      updatedAt: blink.updatedAt,
      owner: {
        id: blink.owner.id,
        name: blink.owner.name,
        email: isOwner ? blink.owner.email : undefined,
      },
      collection: blink.collection ? {
        id: blink.collection.id,
        name: blink.collection.name,
      } : null,
      attributes: blink.attributes.map(attr => ({
        trait_type: attr.traitType,
        value: attr.value,
      })),
      transactions: isOwner ? blink.transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        createdAt: tx.createdAt,
      })) : [],
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching Blink:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};