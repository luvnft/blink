import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { rateLimit } from '@/lib/rate-limit';
import { createBlink } from '@/lib/solana/blink-creation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await rateLimit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Validate authentication (assuming JWT token in Authorization header)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { name, description, blinkType, isNFT, isDonation, isGift, isPayment, isPoll } = await request.json();

    // Validate input
    if (!name || !description || !blinkType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Blink on Solana blockchain
    const ownerPublicKey = new PublicKey(user.id);
    const blinkMintAddress = await createBlink({
      owner: ownerPublicKey,
      name,
      description,
      blinkType,
      isNFT: isNFT || false,
      isDonation: isDonation || false,
      isGift: isGift || false,
      isPayment: isPayment || false,
      isPoll: isPoll || false
    });

    // Store Blink metadata in Supabase
    const { data: blinkData, error: dbError } = await supabase
      .from('blinks')
      .insert({
        mint_address: blinkMintAddress,
        owner_id: user.id,
        name,
        description,
        blink_type: blinkType,
        is_nft: isNFT,
        is_donation: isDonation,
        is_gift: isGift,
        is_payment: isPayment,
        is_poll: isPoll
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error storing Blink metadata:', dbError);
      return NextResponse.json({ error: 'Failed to store Blink metadata' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      blink: {
        id: blinkData.id,
        mintAddress: blinkMintAddress,
        name: blinkData.name,
        description: blinkData.description,
        blinkType: blinkData.blink_type,
        isNFT: blinkData.is_nft,
        isDonation: blinkData.is_donation,
        isGift: blinkData.is_gift,
        isPayment: blinkData.is_payment,
        isPoll: blinkData.is_poll,
        createdAt: blinkData.created_at
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export const runtime = "edge";