import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.DATABASE_URL
  const token = process.env.DATABASE_AUTH_TOKEN

  return NextResponse.json({
    ok: true,
    hasUrl: !!url,
    urlPrefix: url ? url.substring(0, 30) : null,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    nodeEnv: process.env.NODE_ENV,
  })
}
