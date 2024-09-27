import prisma from './prisma'
import { supabase } from './supabase'
import { Session } from '@prisma/client'
import { cacheSet, cacheGet } from './cache'
import { logger } from '@/lib/logger'
import { v4 as uuidv4 } from 'uuid'

export async function createSession(userId: string, expiresAt: Date): Promise<Session | null> {
  const sessionToken = uuidv4()
  try {
    // Prisma
    const prismaSession = await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expiresAt
      }
    })

    // Supabase
    const { data: supabaseSession, error } = await supabase
      .from('sessions')
      .insert({
        id: prismaSession.id,
        session_token: sessionToken,
        user_id: userId,
        expires_at: expiresAt.toISOString()
      })
      .single()

    if (error) throw error

    const newSession = prismaSession || supabaseSession
    if (newSession) {
      await cacheSet(`session:${newSession.sessionToken}`, newSession)
    }

    return newSession
  } catch (error) {
    logger.error('Error creating session:', error)
    return null
  }
}

export async function getSessionByToken(sessionToken: string): Promise<Session | null> {
  const cacheKey = `session:${sessionToken}`
  const cachedSession = await cacheGet<Session>(cacheKey)
  if (cachedSession) return cachedSession

  try {
    // Prisma
    const prismaSession = await prisma.session.findUnique({
      where: { sessionToken }
    })

    if (prismaSession) {
      await cacheSet(cacheKey, prismaSession)
      return prismaSession
    }

    // Supabase
    const { data: supabaseSession, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (error) throw error

    if (supabaseSession) {
      await cacheSet(cacheKey, supabaseSession)
      return supabaseSession as Session
    }

    return null
  } catch (error) {
    logger.error('Error fetching session:', error)
    return null
  }
}

export async function updateSession(sessionToken: string, data: Partial<Session>): Promise<Session | null> {
  try {
    // Prisma
    const prismaSession = await prisma.session.update({
      where: { sessionToken },
      data
    })

    // Supabase
    const { data: supabaseSession, error } = await supabase
      .from('sessions')
      .update(data)
      .eq('session_token', sessionToken)
      .single()

    if (error) throw error

    const updatedSession = prismaSession || supabaseSession
    if (updatedSession) {
      await cacheSet(`session:${updatedSession.sessionToken}`, updatedSession)
    }

    return updatedSession as Session
  } catch (error) {
    logger.error('Error updating session:', error)
    return null
  }
}

export async function deleteSession(sessionToken: string): Promise<boolean> {
  try {
    // Prisma
    await prisma.session.delete({
      where: { sessionToken }
    })

    // Supabase
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) throw error

    await cacheSet(`session:${sessionToken}`, null)
    return true
  } catch (error) {
    logger.error('Error deleting session:', error)
    return false
  }
}

export async function cleanExpiredSessions(): Promise<number> {
  try {
    const now = new Date()

    // Prisma
    const { count: prismaCount } = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    })

    // Supabase
    const { data: supabaseData, error } = await supabase
      .from('sessions')
      .delete()
      .lt('expires_at', now.toISOString())

    if (error) throw error

    const totalDeleted = prismaCount + (supabaseData?.length || 0)

    // Clear cache for deleted sessions
    // Note: This is a simplified approach. In a production environment,
    // you might want to implement a more efficient cache clearing strategy.
    const allCacheKeys = await cacheGet<string[]>('all_session_keys') || []
    for (const key of allCacheKeys) {
      const session = await cacheGet<Session>(key)
      if (session && session.expiresAt < now) {
        await cacheSet(key, null)
      }
    }

    return totalDeleted
  } catch (error) {
    logger.error('Error cleaning expired sessions:', error)
    return 0
  }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  try {
    // Prisma
    const prismaSessions = await prisma.session.findMany({
      where: { userId }
    })

    if (prismaSessions.length > 0) return prismaSessions

    // Supabase
    const { data: supabaseSessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return supabaseSessions as Session[]
  } catch (error) {
    logger.error('Error fetching user sessions:', error)
    return []
  }
}

export async function extendSession(sessionToken: string, newExpiryDate: Date): Promise<Session | null> {
  return updateSession(sessionToken, { expiresAt: newExpiryDate })
}

export async function isSessionValid(sessionToken: string): Promise<boolean> {
  const session = await getSessionByToken(sessionToken)
  if (!session) return false

  const now = new Date()
  return session.expiresAt > now
}