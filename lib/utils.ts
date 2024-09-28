import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') global.prisma = prisma