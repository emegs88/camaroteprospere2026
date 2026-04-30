import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (!url) {
    throw new Error('DATABASE_URL não definida')
  }

  // PrismaLibSql é uma Factory que recebe config (url + authToken),
  // não um cliente libsql já criado.
  const adapter = new PrismaLibSql({
    url,
    ...(authToken ? { authToken } : {}),
  })
  return new PrismaClient({ adapter } as any)
}

export const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
