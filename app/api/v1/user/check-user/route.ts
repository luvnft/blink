import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rate-limit';
import { validatePublicKey } from '@/lib/solana-utils';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define the shape of our user data
interface UserData {
  id: string;
  username: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
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

    // Parse and validate the request body
    const body = await request.json();
    const { publicKey } = body;

    if (!publicKey || !validatePublicKey(publicKey)) {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    // Query Supabase for the user
    const { data, error } = await supabase
      .from('users')
      .select('id, username, created_at')
      .eq('public_key', publicKey)
      .single();

    // Handle Supabase errors
    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return NextResponse.json({ exists: false });
      }
      console.error('Error checking user:', error);
      return NextResponse.json({ error: 'An error occurred while checking the user' }, { status: 500 });
    }

    // User found, return the data
    const userData = data as UserData;
    return NextResponse.json({ 
      exists: true, 
      user: {
        id: userData.id,
        username: userData.username,
        createdAt: userData.created_at
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}