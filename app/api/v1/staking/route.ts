import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { stakeTokens, unstakeTokens, getStakingInfo } from '@/lib/solana/staking';

const prisma = new PrismaClient();

const stakeSchema = z.object({
  amount: z.number().positive(),
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

    const stakingInfo = await getStakingInfo(session.user.id);

    return NextResponse.json(stakingInfo);
  } catch (error) {
    console.error('Error fetching staking info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
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
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const validationResult = stakeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { amount } = validationResult.data;

    let result;
    if (action === 'stake') {
      result = await stakeTokens(session.user.id, amount);
    } else if (action === 'unstake') {
      result = await unstakeTokens(session.user.id, amount);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const stakingRecord = await prisma.stakingTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: action.toUpperCase(),
        transactionSignature: result.signature,
      },
    });

    return NextResponse.json(stakingRecord, { status: 201 });
  } catch (error) {
    console.error('Error in staking operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  runtime: 'edge',
};