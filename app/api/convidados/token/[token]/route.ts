import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const convidado = await prisma.convidado.findUnique({
      where: { tokenConvite: params.token },
      include: { ingresso: true, show: true },
    })
    if (!convidado) return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    return NextResponse.json(convidado)
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
