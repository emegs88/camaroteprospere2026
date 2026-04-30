import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
  },
  migrate: {
    adapter: async () => {
      const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3')
      const Database = (await import('better-sqlite3')).default
      const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
      return new PrismaBetterSqlite3(db)
    },
  },
})
