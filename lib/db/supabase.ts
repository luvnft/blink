import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { logger } from '@/lib/logger'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export async function initializeSupabase() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    logger.info('Supabase initialized successfully')
    return data.session
  } catch (error) {
    logger.error('Error initializing Supabase:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    logger.error('Error signing in:', error)
    throw error
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    logger.error('Error signing up:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  } catch (error) {
    logger.error('Error signing out:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return user
  } catch (error) {
    logger.error('Error getting current user:', error)
    throw error
  }
}

export async function updateUserProfile(userId: string, updates: { [key: string]: any }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    logger.error('Error updating user profile:', error)
    throw error
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    logger.error('Error resetting password:', error)
    throw error
  }
}

export default supabase