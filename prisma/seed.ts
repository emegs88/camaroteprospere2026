import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Limpando banco...')
  await prisma.interacao.deleteMany()
  await prisma.logAcao.deleteMany()
  await prisma.convidado.deleteMany()
  await prisma.ingresso.deleteMany()
  await prisma.show.deleteMany()
  await prisma.user.deleteMany()

  console.log('Criando usuário admin...')
  await prisma.user.create({
    data: {
      email: 'admin@prospere.com.br',
      name: 'Administrador Prospere',
      password: 'prospere2026',
      role: 'ADMIN',
    },
  })

  console.log('Criando shows...')
  // Semana 1 – 8 a 10 de maio
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

  // Semana 2 – 15 a 17 de maio
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

  const show6 = await prisma.show.create({
    data: {
      nome: 'Encerramento – Noite 6',
      artista: '#OsMenotti + Paula Mello',
      data: new Date('2026-05-17T03:00:00Z'),
      horario: '21:00',
      descricao: 'Os Menotti e Paula Mello – show de encerramento',
    },
  })

  console.log('Criando ingressos Backstage (50)...')
  for (let i = 1; i <= 50; i++) {
    await prisma.ingresso.create({
      data: {
        numero: `BST-${String(i).padStart(3, '0')}`,
        categoria: 'BACKSTAGE',
        status: 'LIVRE',
      },
    })
  }

  console.log('Criando ingressos Imóveis (10)...')
  for (let i = 1; i <= 10; i++) {
    await prisma.ingresso.create({
      data: {
        numero: `IMV-${String(i).padStart(3, '0')}`,
        categoria: 'IMOVEIS',
        status: 'LIVRE',
      },
    })
  }

  console.log('Criando ingressos Futsal (10)...')
  for (let i = 1; i <= 10; i++) {
    await prisma.ingresso.create({
      data: {
        numero: `FUT-${String(i).padStart(3, '0')}`,
        categoria: 'FUTSAL',
        status: 'LIVRE',
      },
    })
  }

  const ingressos = await prisma.ingresso.findMany()
  const getIngresso = (prefix: string, num: number) =>
    ingressos.find(i => i.numero === `${prefix}-${String(num).padStart(3, '0')}`)!

  console.log('Criando influencers...')
  await prisma.convidado.create({
    data: {
      nome: 'Ana Carolina Souza',
      email: 'ana@influencer.com.br',
      telefone: '19991110001',
      tipo: 'INFLUENCER',
      redeSocial: 'instagram',
      handle: '@anacarolsouza',
      seguidores: 285000,
      nicho: 'Sertanejo',
      statusPost: 'NAO_POSTOU',
      showId: show1.id,
      ingressoId: getIngresso('BST', 1).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Rafael Agro',
      email: 'rafael@agro.com.br',
      telefone: '19991110002',
      tipo: 'INFLUENCER',
      redeSocial: 'tiktok',
      handle: '@rafaelagro',
      seguidores: 1200000,
      nicho: 'Agro',
      statusPost: 'NAO_POSTOU',
      showId: show2.id,
      ingressoId: getIngresso('BST', 2).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Mariana Lifestyle',
      email: 'mari@content.com.br',
      telefone: '19991110003',
      tipo: 'INFLUENCER',
      redeSocial: 'instagram',
      handle: '@marianalifestyle',
      seguidores: 520000,
      nicho: 'Lifestyle',
      statusPost: 'NAO_POSTOU',
      showId: show3.id,
      ingressoId: getIngresso('BST', 3).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Pedro Business',
      email: 'pedro@negocio.com.br',
      telefone: '19991110004',
      tipo: 'INFLUENCER',
      redeSocial: 'youtube',
      handle: '@pedrobusiness',
      seguidores: 890000,
      nicho: 'Negócios',
      statusPost: 'NAO_POSTOU',
      showId: show4.id,
      ingressoId: getIngresso('BST', 4).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Larissa Esporte',
      email: 'larissa@sport.com.br',
      telefone: '19991110005',
      tipo: 'INFLUENCER',
      redeSocial: 'instagram',
      handle: '@larissaesporte',
      seguidores: 175000,
      nicho: 'Esporte',
      statusPost: 'NAO_POSTOU',
      showId: show5.id,
      ingressoId: getIngresso('BST', 5).id,
    },
  })

  console.log('Criando clientes...')
  const cl1 = await prisma.convidado.create({
    data: {
      nome: 'Carlos Eduardo Mendes',
      email: 'carlos@empresa.com.br',
      telefone: '19992220001',
      tipo: 'CLIENTE',
      empresa: 'Construtora Mendes Ltda',
      produtoInteresse: 'Imóvel',
      statusCliente: 'Em negociação',
      consultor: 'João Silva',
      observacoes: 'Interessado em 3 unidades no empreendimento Jardim das Flores',
      showId: show1.id,
      ingressoId: getIngresso('IMV', 1).id,
    },
  })

  await prisma.interacao.create({
    data: {
      convidadoId: cl1.id,
      tipo: 'NOTA',
      descricao: 'Reunião realizada. Cliente muito interessado no empreendimento.',
      autor: 'João Silva',
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Fernanda Lima Costa',
      email: 'fernanda@lima.com.br',
      telefone: '19992220002',
      tipo: 'CLIENTE',
      empresa: 'Lima Comércio',
      produtoInteresse: 'Consórcio',
      statusCliente: 'Prospect',
      consultor: 'Maria Santos',
      showId: show2.id,
      ingressoId: getIngresso('IMV', 2).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Roberto Alves',
      email: 'roberto@alves.com.br',
      telefone: '19992220003',
      tipo: 'CLIENTE',
      empresa: 'Transportes Alves',
      produtoInteresse: 'Automóvel',
      statusCliente: 'Cliente ativo',
      consultor: 'João Silva',
      showId: show3.id,
      ingressoId: getIngresso('IMV', 3).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Patrícia Rodrigues',
      email: 'patricia@rod.com.br',
      telefone: '19992220004',
      tipo: 'CLIENTE',
      empresa: 'Distribuidora Rodrigues',
      produtoInteresse: 'Serviços',
      statusCliente: 'Prospect',
      consultor: 'Ana Ferreira',
      showId: show4.id,
      ingressoId: getIngresso('BST', 6).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Gustavo Pereira Neto',
      email: 'gustavo@pereira.com.br',
      telefone: '19992220005',
      tipo: 'CLIENTE',
      empresa: 'Agropecuária Pereira',
      produtoInteresse: 'Imóvel',
      statusCliente: 'Em negociação',
      consultor: 'Carlos Oliveira',
      showId: show5.id,
      ingressoId: getIngresso('BST', 7).id,
    },
  })

  console.log('Criando VIPs...')
  await prisma.convidado.create({
    data: {
      nome: 'Dr. Antonio Morales',
      email: 'antonio@prefeitura.sp.gov.br',
      telefone: '19993330001',
      tipo: 'VIP',
      observacoes: 'Secretário Municipal – tratar com prioridade máxima',
      showId: show1.id,
      ingressoId: getIngresso('BST', 8).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Dra. Beatriz Camargo',
      email: 'beatriz@camargo.com.br',
      telefone: '19993330002',
      tipo: 'VIP',
      observacoes: 'Presidente da Câmara de Comércio – parceira estratégica',
      showId: show6.id,
      ingressoId: getIngresso('BST', 9).id,
    },
  })

  console.log('Criando parceiros...')
  await prisma.convidado.create({
    data: {
      nome: 'Marcos Tavares',
      email: 'marcos@autoshow.com.br',
      telefone: '19994440001',
      tipo: 'PARCEIRO',
      empresa: 'AutoShow Hortolândia',
      showId: show1.id,
      ingressoId: getIngresso('FUT', 1).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Juliana Machado',
      email: 'juliana@belezaplus.com.br',
      telefone: '19994440002',
      tipo: 'PARCEIRO',
      empresa: 'Beleza Plus Network',
      showId: show3.id,
      ingressoId: getIngresso('FUT', 2).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'André Construções',
      email: 'andre@constru.com.br',
      telefone: '19994440003',
      tipo: 'PARCEIRO',
      empresa: 'André Construções e Reformas',
      showId: show5.id,
      ingressoId: getIngresso('FUT', 3).id,
    },
  })

  console.log('Criando colaboradores...')
  await prisma.convidado.create({
    data: {
      nome: 'Diego Moreira',
      email: 'diego@prospere.com.br',
      telefone: '19995550001',
      tipo: 'COLABORADOR',
      observacoes: 'Coordenador de eventos',
      showId: show2.id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Thais Ferreira',
      email: 'thais@prospere.com.br',
      telefone: '19995550002',
      tipo: 'COLABORADOR',
      observacoes: 'Analista de marketing',
      showId: show4.id,
    },
  })

  console.log('Criando imprensa...')
  await prisma.convidado.create({
    data: {
      nome: 'Rodrigo Jornalista',
      email: 'rodrigo@jornalhortolandia.com.br',
      telefone: '19996660001',
      tipo: 'IMPRENSA',
      empresa: 'Jornal de Hortolândia',
      observacoes: 'Cobertura principal – foto + texto',
      showId: show1.id,
      ingressoId: getIngresso('BST', 10).id,
    },
  })

  await prisma.convidado.create({
    data: {
      nome: 'Camila Fotógrafa',
      email: 'camila@foto.com.br',
      telefone: '19996660002',
      tipo: 'IMPRENSA',
      empresa: 'Foto & Cia Studio',
      observacoes: 'Fotógrafa credenciada – acesso backstage',
      showId: show6.id,
      ingressoId: getIngresso('BST', 11).id,
    },
  })

  // Atualizar status de alguns ingressos
  const ingressosReservados = [
    getIngresso('BST', 1), getIngresso('BST', 2), getIngresso('BST', 3),
    getIngresso('BST', 4), getIngresso('BST', 5), getIngresso('BST', 6),
    getIngresso('BST', 7), getIngresso('BST', 8), getIngresso('BST', 9),
    getIngresso('BST', 10), getIngresso('BST', 11),
    getIngresso('IMV', 1), getIngresso('IMV', 2), getIngresso('IMV', 3),
    getIngresso('FUT', 1), getIngresso('FUT', 2), getIngresso('FUT', 3),
  ]

  for (const ing of ingressosReservados) {
    await prisma.ingresso.update({
      where: { id: ing.id },
      data: { status: 'RESERVADO' },
    })
  }

  console.log('\n✅ Seed concluído!')
  console.log('Admin: admin@prospere.com.br / prospere2026')
  console.log('6 shows criados (8 a 17 de maio 2026)')
  console.log('  - 08/05: Hugo & Guilherme + Samuel')
  console.log('  - 09/05: Thiaguinho')
  console.log('  - 10/05: Edson & Hudson + Victor & Kauân')
  console.log('  - 15/05: Diego & Victor Hugo + Kevi Jonny')
  console.log('  - 16/05: Zé Neto & Cristiano')
  console.log('  - 17/05: #OsMenotti + Paula Mello')
  console.log('70 ingressos criados')
  console.log('5 influencers, 5 clientes, 2 VIPs, 3 parceiros, 2 colaboradores, 2 imprensa')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
