import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    console.error('Error fetching current user:', error)
    return null
  }

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name: data.name || user.user_metadata.full_name,
    avatar_url: data.avatar_url || user.user_metadata.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at!
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data as User
}

export async function getUserBlinks(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('blinks')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user blinks:', error)
    return []
  }

  return data
}