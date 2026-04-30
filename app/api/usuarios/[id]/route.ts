import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const todos = await prisma.user.findMany({ select: { id: true } })
    if (todos.length <= 1) {
      return NextResponse.json({ error: 'Não é possível remover o único usuário do sistema' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover usuário' }, { status: 500 })
  }
}
