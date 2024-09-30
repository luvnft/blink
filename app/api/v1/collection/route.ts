import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { createCollection, getCollectionMetadata } from '@/lib/solana/collection';

const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  image: z.string().url(),
  symbol: z.string().min(1).max(10),
});

export async function GET(request: NextRequest) {
  try {
    const { success } = await rateLimit(request.ip ?? 'anonymous');
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collectionAddress = searchParams.get('collectionAddress');

    if (!collectionAddress) {
      const collections = await prisma.collection.findMany({
        where: { creatorId: session.user.id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          nfts: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json({ collections });
    } else {
      const collection = await prisma.collection.findUnique({
        where: { address: collectionAddress },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          nfts: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!collection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }

      const onChainMetadata = await getCollectionMetadata(collectionAddress);

      return NextResponse.json({ ...collection, onChainMetadata });
    }
  } catch (error) {
    console.error('Error fetching collection(s):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { success } = await rateLimit(request.ip ?? 'anonymous');
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createCollectionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { name, description, image, symbol } = validationResult.data;

    const collectionAddress = await createCollection(session.user.id, name, description, image, symbol);

    const newCollection = await prisma.collection.create({
      data: {
        name,
        description,
        image,
        symbol,
        address: collectionAddress,
        creator: {
          connect: { id: session.user.id },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};