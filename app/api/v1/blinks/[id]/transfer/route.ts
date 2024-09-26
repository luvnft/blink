import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { transferBlink } from '@/utils/solana';
import { PublicKey } from '@solana/web3.js';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();

  if (!body.toAddress) {
    return NextResponse.json({ error: 'Recipient address is required' }, { status: 400 });
  }

  try {
    const blink = await prisma.blink.findUnique({ where: { id }, include: { owner: true } });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    const fromPublicKey = new PublicKey(blink.owner.id);
    const toPublicKey = new PublicKey(body.toAddress);

    const signature = await transferBlink(fromPublicKey, toPublicKey, blink.mintAddress);

    const updatedBlink = await prisma.blink.update({
      where: { id },
      data: { owner: { connect: { id: body.toAddress } } },
    });

    return NextResponse.json({
      blink: updatedBlink,
      transactionSignature: signature,
    });
  } catch (error) {
    console.error('Error transferring Blink:', error);
    return NextResponse.json({ error: 'Failed to transfer Blink' }, { status: 500 });
  }
}