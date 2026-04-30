import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const show = await prisma.show.update({ where: { id: params.id }, data: body })
    return NextResponse.json(show)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar show' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.show.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar show' }, { status: 500 })
  }
}
