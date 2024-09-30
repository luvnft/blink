import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { mintNFT, getNFTMetadata } from '@/lib/solana/nft';

const createNFTSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  image: z.string().url(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.string(),
  })).optional(),
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
    const mintAddress = searchParams.get('mintAddress');

    if (!mintAddress) {
      const nfts = await prisma.nFT.findMany({
        where: { ownerId: session.user.id },
        include: {
          collection: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ nfts });
    } else {
      const nft = await prisma.nFT.findUnique({
        where: { mintAddress },
        include: {
          collection: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!nft) {
        return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
      }

      const onChainMetadata = await getNFTMetadata(mintAddress);

      return NextResponse.json({ ...nft, onChainMetadata });
    }
  } catch (error) {
    console.error('Error fetching NFT(s):', error);
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
    const validationResult = createNFTSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { name, description, image, attributes } = validationResult.data;

    const mintAddress = await mintNFT(session.user.id, name, description, image, attributes);

    const newNFT = await prisma.nFT.create({
      data: {
        name,
        description,
        image,
        mintAddress,
        attributes: {
          create: attributes,
        },
        owner: {
          connect: { id: session.user.id },
        },
      },
      include: {
        attributes: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newNFT, { status: 201 });
  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};