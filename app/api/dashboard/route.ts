import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalConvidados,
      porTipo,
      ingressos,
      convitesEnviados,
      ultimasReservas,
    ] = await Promise.all([
      prisma.convidado.count(),
      prisma.convidado.groupBy({ by: ['tipo'], _count: { tipo: true } }),
      prisma.ingresso.groupBy({ by: ['categoria', 'status'], _count: { status: true } }),
      prisma.convidado.count({ where: { conviteEnviado: true } }),
      prisma.convidado.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { ingresso: true, show: true },
      }),
    ])

    const totalIngressos = 70 // 50 backstage + 10 imoveis + 10 futsal
    const reservados = await prisma.ingresso.count({ where: { status: { not: 'LIVRE' } } })

    return NextResponse.json({
      totalConvidados,
      totalIngressos,
      reservados,
      disponiveis: totalIngressos - reservados,
      convitesEnviados,
      porTipo,
      ingressos,
      ultimasReservas,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
