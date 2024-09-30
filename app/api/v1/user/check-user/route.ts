import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rate-limit';
import { validatePublicKey } from '@/lib/solana-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success, remaining, reset } = await rateLimit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': process.env.RATE_LIMIT_MAX || '100',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    const { publicKey } = await request.json();

    if (!publicKey || !validatePublicKey(publicKey)) {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, username, created_at')
      .eq('public_key', publicKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ exists: false });
      }
      console.error('Error checking user:', error);
      return NextResponse.json({ error: 'An error occurred while checking the user' }, { status: 500 });
    }

    return NextResponse.json({ 
      exists: true, 
      user: {
        id: data.id,
        username: data.username,
        createdAt: data.created_at
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}