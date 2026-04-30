import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const convidado = await prisma.convidado.findUnique({
      where: { id: params.id },
      include: { ingresso: true, show: true, interacoes: { orderBy: { createdAt: 'desc' } } },
    })
    if (!convidado) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(convidado)
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    if (body.seguidores !== undefined) {
      const parsed = body.seguidores === '' || body.seguidores === null
        ? null
        : parseInt(body.seguidores, 10)
      body.seguidores = isNaN(parsed as number) ? null : parsed
    }
    const convidado = await prisma.convidado.update({
      where: { id: params.id },
      data: body,
      include: { ingresso: true, show: true },
    })
    return NextResponse.json(convidado)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.convidado.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}
