import { NextRequest, NextResponse } from 'next/server';
import { StakingInfo, StakeRequest, StakeResponse, UnstakeRequest, UnstakeResponse } from '@/types/staking';

// Mock staking data
let stakingInfo: StakingInfo = {
  totalStaked: 1000000,
  apr: 5.5,
  minimumStake: 100,
  lockupPeriod: 7 * 24 * 60 * 60 // 7 days in seconds
};

let userStakes: Record<string, number> = {};

export async function GET() {
  return NextResponse.json(stakingInfo);
}

export async function POST(request: NextRequest) {
  const body: StakeRequest = await request.json();
  const userId = 'user_1'; // In a real app, get this from the authenticated user

  if (body.amount < stakingInfo.minimumStake) {
    return NextResponse.json({ error: 'Amount is below minimum stake' }, { status: 400 });
  }

  // In a real app, you would interact with the blockchain here
  userStakes[userId] = (userStakes[userId] || 0) + body.amount;
  stakingInfo.totalStaked += body.amount;

  const response: StakeResponse = {
    transactionId: `tx_${Date.now()}`,
    amount: body.amount,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + stakingInfo.lockupPeriod * 1000).toISOString()
  };

  return NextResponse.json(response);
}

export async function PUT(request: NextRequest) {
  const body: UnstakeRequest = await request.json();
  const userId = 'user_1'; // In a real app, get this from the authenticated user

  if (!userStakes[userId] || userStakes[userId] < body.amount) {
    return NextResponse.json({ error: 'Insufficient staked amount' }, { status: 400 });
  }

  // In a real app, you would interact with the blockchain here
  userStakes[userId] -= body.amount;
  stakingInfo.totalStaked -= body.amount;

  const response: UnstakeResponse = {
    transactionId: `tx_${Date.now()}`,
    amount: body.amount,
    unstakedAt: new Date().toISOString()
  };

  return NextResponse.json(response);
}