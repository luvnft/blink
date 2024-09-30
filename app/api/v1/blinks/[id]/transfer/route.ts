import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { transferBlink } from '@/utils/solana';
import { PublicKey } from '@solana/web3.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const prisma = new PrismaClient();

const transferSchema = z.object({
  toAddress: z.string().min(32).max(44),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Apply rate limiting
    const ip = request.ip ?? 'anonymous';
    const { success } = await rateLimit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationResult = transferSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { toAddress } = validationResult.data;

    const blink = await prisma.blink.findUnique({ 
      where: { id }, 
      include: { owner: true } 
    });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    // Check if the user is the owner of the Blink
    if (blink.owner.id !== session.user.id) {
      return NextResponse.json({ error: 'You do not own this Blink' }, { status: 403 });
    }

    const fromPublicKey = new PublicKey(blink.owner.id);
    const toPublicKey = new PublicKey(toAddress);

    const signature = await transferBlink(fromPublicKey, toPublicKey, blink.mintAddress);

    const updatedBlink = await prisma.blink.update({
      where: { id },
      data: { owner: { connect: { id: toAddress } } },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        collection: true,
        attributes: true,
      },
    });

    // Create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        type: 'TRANSFER',
        fromId: session.user.id,
        toId: toAddress,
        blinkId: id,
        amount: 1,
        currency: 'BLINK',
        status: 'COMPLETED',
        txHash: signature,
      },
    });

    // Prepare the response data
    const responseData = {
      blink: {
        id: updatedBlink.id,
        name: updatedBlink.name,
        description: updatedBlink.description,
        imageUrl: updatedBlink.imageUrl,
        mintAddress: updatedBlink.mintAddress,
        createdAt: updatedBlink.createdAt,
        updatedAt: updatedBlink.updatedAt,
        owner: {
          id: updatedBlink.owner.id,
          name: updatedBlink.owner.name,
        },
        collection: updatedBlink.collection ? {
          id: updatedBlink.collection.id,
          name: updatedBlink.collection.name,
        } : null,
        attributes: updatedBlink.attributes.map(attr => ({
          trait_type: attr.traitType,
          value: attr.value,
        })),
      },
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        txHash: transaction.txHash,
        createdAt: transaction.createdAt,
      },
      transactionSignature: signature,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error transferring Blink:', error);
    return NextResponse.json({ error: 'Failed to transfer Blink' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  runtime: 'edge',
};