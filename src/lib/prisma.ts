import { PrismaClient } from '@prisma/client'

declare global {
  // Previne múltiplas instâncias do Prisma em desenvolvimento
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export default prisma