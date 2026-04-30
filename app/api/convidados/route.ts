import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo')
    const showId = searchParams.get('showId')

    const where: any = {}
    if (tipo) where.tipo = tipo
    if (showId) where.showId = showId

    const convidados = await prisma.convidado.findMany({
      where,
      include: {
        ingresso: true,
        show: true,
        interacoes: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(convidados)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar convidados' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Normalize seguidores: convert empty string or invalid value to null (field is Int?)
    if (body.seguidores !== undefined) {
      const parsed = body.seguidores === '' || body.seguidores === null
        ? null
        : parseInt(body.seguidores, 10)
      body.seguidores = isNaN(parsed as number) ? null : parsed
    }
    const convidado = await prisma.convidado.create({
      data: body,
      include: { ingresso: true, show: true },
    })
    return NextResponse.json(convidado, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar convidado' }, { status: 500 })
  }
}
