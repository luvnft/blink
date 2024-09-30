import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rate-limit';
import { validatePublicKey } from '@/lib/solana-utils';
import { validateUsername } from '@/lib/user-utils';

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

    const { username, publicKey } = await request.json();

    if (!username || !validateUsername(username)) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    if (!publicKey || !validatePublicKey(publicKey)) {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    // Check if the username or public key already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, public_key')
      .or(`username.eq.${username},public_key.eq.${publicKey}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      return NextResponse.json({ error: 'An error occurred while checking for existing user' }, { status: 500 });
    }

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
      }
      if (existingUser.public_key === publicKey) {
        return NextResponse.json({ error: 'Public key already exists' }, { status: 409 });
      }
    }

    // Create the new user
    const { data, error } = await supabase
      .from('users')
      .insert({ username, public_key: publicKey })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
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