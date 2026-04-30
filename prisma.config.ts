import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
const authToken = process.env.DATABASE_AUTH_TOKEN

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url,
  },
  migrate: {
    adapter: async () => {
      const libsql = createClient({ url, authToken })
      return new PrismaLibSql(libsql)
    },
  },
})
