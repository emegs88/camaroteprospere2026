import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const interacao = await prisma.interacao.create({
      data: { convidadoId: params.id, ...body },
    })
    return NextResponse.json(interacao, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar interação' }, { status: 500 })
  }
}
