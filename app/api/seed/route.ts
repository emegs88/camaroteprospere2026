import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Verificar se já tem shows
    const count = await prisma.show.count()
    if (count > 0) {
      return NextResponse.json({ ok: true, msg: `Já existem ${count} shows cadastrados. Nada foi alterado.` })
    }

    // Criar admin se não existir
    const adminExiste = await prisma.user.findFirst({ where: { email: 'admin@prospere.com.br' } })
    if (!adminExiste) {
      await prisma.user.create({
        data: {
          email: 'admin@prospere.com.br',
          name: 'Administrador Prospere',
          password: 'prospere2026',
          role: 'ADMIN',
        },
      })
    }

    // Criar shows
    const show1 = await prisma.show.create({
      data: {
        nome: 'Sexta-feira – Noite 1',
        artista: 'Hugo & Guilherme + Samuel',
        data: new Date('2026-05-08T03:00:00Z'),
        horario: '21:00',
        descricao: 'Abertura com Hugo & Guilherme e Samuel',
      },
    })

    const show2 = await prisma.show.create({
      data: {
        nome: 'Sábado – Noite 2',
        artista: 'Thiaguinho',
        data: new Date('2026-05-09T03:00:00Z'),
        horario: '22:00',
        descricao: 'Thiaguinho no Camarote Prospere',
      },
    })

    const show3 = await prisma.show.create({
      data: {
        nome: 'Domingo – Noite 3',
        artista: 'Edson & Hudson + Victor & Kauân',
        data: new Date('2026-05-10T03:00:00Z'),
        horario: '21:00',
        descricao: 'Edson & Hudson e Victor & Kauân',
      },
    })

    const show4 = await prisma.show.create({
      data: {
        nome: 'Sexta-feira – Noite 4',
        artista: 'Diego & Victor Hugo + Kevi Jonny',
        data: new Date('2026-05-15T03:00:00Z'),
        horario: '21:00',
        descricao: 'Diego & Victor Hugo e Kevi Jonny',
      },
    })

    const show5 = await prisma.show.create({
      data: {
        nome: 'Sábado – Noite 5',
        artista: 'Zé Neto & Cristiano',
        data: new Date('2026-05-16T03:00:00Z'),
        horario: '22:00',
        descricao: 'Zé Neto & Cristiano no Camarote Prospere',
      },
    })

    await prisma.show.create({
      data: {
        nome: 'Encerramento – Noite 6',
        artista: '#OsMenotti + Paula Mello',
        data: new Date('2026-05-17T03:00:00Z'),
        horario: '21:00',
        descricao: 'Os Menotti e Paula Mello – show de encerramento',
      },
    })

    // Criar ingressos
    for (let i = 1; i <= 50; i++) {
      await prisma.ingresso.create({
        data: { numero: `BST-${String(i).padStart(3, '0')}`, categoria: 'BACKSTAGE', status: 'LIVRE' },
      })
    }
    for (let i = 1; i <= 10; i++) {
      await prisma.ingresso.create({
        data: { numero: `IMV-${String(i).padStart(3, '0')}`, categoria: 'IMOVEIS', status: 'LIVRE' },
      })
    }
    for (let i = 1; i <= 10; i++) {
      await prisma.ingresso.create({
        data: { numero: `FUT-${String(i).padStart(3, '0')}`, categoria: 'FUTSAL', status: 'LIVRE' },
      })
    }

    return NextResponse.json({
      ok: true,
      msg: '6 shows e 70 ingressos criados com sucesso!',
      shows: [
        '08/05 – Hugo & Guilherme + Samuel',
        '09/05 – Thiaguinho',
        '10/05 – Edson & Hudson + Victor & Kauân',
        '15/05 – Diego & Victor Hugo + Kevi Jonny',
        '16/05 – Zé Neto & Cristiano',
        '17/05 – #OsMenotti + Paula Mello',
      ],
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro no seed', detail: error?.message }, { status: 500 })
  }
}
