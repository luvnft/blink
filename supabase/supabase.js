import { createClient } from '@supabase/supabase-js'

// Check if the required environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Fetches a user's profile from Supabase
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<Object|null>} The user's profile or null if not found
 */
export async function fetchUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return null
  }
}

/**
 * Updates a user's profile in Supabase
 * @param {string} userId - The ID of the user to update
 * @param {Object} updates - An object containing the profile fields to update
 * @returns {Promise<Object|null>} The updated user profile or null if update failed
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error updating user profile:', error)
    return null
  }
}

/**
 * Fetches all blinks for a given user from Supabase
 * @param {string} userId - The ID of the user whose blinks to fetch
 * @returns {Promise<Array|null>} An array of blinks or null if fetch failed
 */
export async function fetchUserBlinks(userId) {
  try {
    const { data, error } = await supabase
      .from('blinks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user blinks:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching user blinks:', error)
    return null
  }
}

/**
 * Creates a new blink in Supabase
 * @param {Object} blinkData - The data for the new blink
 * @returns {Promise<Object|null>} The created blink or null if creation failed
 */
export async function createBlink(blinkData) {
  try {
    const { data, error } = await supabase
      .from('blinks')
      .insert(blinkData)
      .single()

    if (error) {
      console.error('Error creating blink:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error creating blink:', error)
    return null
  }
}

// Export the Supabase client for use in other parts of the application
export { supabase }