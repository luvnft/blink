import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find the password reset token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!passwordReset) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 })
    }

    // Check if the token has expired (e.g., after 1 hour)
    const tokenAge = Date.now() - passwordReset.createdAt.getTime()
    if (tokenAge > 3600000) { // 1 hour in milliseconds
      await prisma.passwordReset.delete({ where: { id: passwordReset.id } })
      return NextResponse.json({ message: 'Reset token has expired' }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { passwordHash: hashedPassword },
    })

    // Delete the used password reset token
    await prisma.passwordReset.delete({ where: { id: passwordReset.id } })

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 })
  } catch (error) {
    console.error('Reset password error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}