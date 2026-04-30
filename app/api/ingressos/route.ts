import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoria = searchParams.get('categoria')
    const where: any = {}
    if (categoria) where.categoria = categoria
    const ingressos = await prisma.ingresso.findMany({
      where,
      include: {
        convidado: true,
        show: { select: { id: true, nome: true, artista: true, data: true } },
      },
      orderBy: { numero: 'asc' },
    })
    return NextResponse.json(ingressos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const ingresso = await prisma.ingresso.update({
      where: { id: body.id },
      data: { status: body.status, showId: body.showId },
    })
    return NextResponse.json(ingresso)
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
