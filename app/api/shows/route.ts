import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const shows = await prisma.show.findMany({
      include: {
        _count: { select: { ingressos: true, convidados: true } },
      },
      orderBy: { data: 'asc' },
    })
    return NextResponse.json(shows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar shows' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const show = await prisma.show.create({ data: body })
    return NextResponse.json(show, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar show' }, { status: 500 })
  }
}
