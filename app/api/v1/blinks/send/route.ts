import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { transferBlink } from '@/lib/solana';
import { rateLimit } from '@/lib/rate-limit';

// Define the input schema for sending a Blink
const sendBlinkSchema = z.object({
  blinkId: z.string().uuid(),
  recipientId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
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

    // Parse and validate the request body
    const body = await req.json();
    const { blinkId, recipientId } = sendBlinkSchema.parse(body);

    // Fetch the Blink from the database
    const blink = await prisma.blink.findUnique({
      where: { id: blinkId },
      include: { owner: true },
    });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    // Check if the user is the owner of the Blink
    if (blink.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'You do not own this Blink' }, { status: 403 });
    }

    // Check if the recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Transfer the Blink on the Solana blockchain
    const { signature } = await transferBlink(blink.mintAddress, session.user.id, recipientId);

    // Update the Blink ownership in the database
    const updatedBlink = await prisma.blink.update({
      where: { id: blinkId },
      data: { ownerId: recipientId },
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
      },
    });

    // Create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        type: 'TRANSFER',
        fromId: session.user.id,
        toId: recipientId,
        blinkId: blinkId,
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
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error sending Blink:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};