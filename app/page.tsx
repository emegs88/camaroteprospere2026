'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { BadgeTipo } from '@/components/BadgeTipo'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Users, Ticket, Send, TrendingUp, Calendar, Clock, ChevronRight } from 'lucide-react'
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface DashboardData {
  totalConvidados: number
  totalIngressos: number
  reservados: number
  disponiveis: number
  convitesEnviados: number
  porTipo: Array<{ tipo: string; _count: { tipo: number } }>
  ingressos: Array<{ categoria: string; status: string; _count: { status: number } }>
  ultimasReservas: any[]
}

const TIPO_COLORS: Record<string, string> = {
  INFLUENCER: '#a855f7',
  CLIENTE: '#eab308',
  PARCEIRO: '#22c55e',
  VIP: '#ef4444',
  COLABORADOR: '#3b82f6',
  IMPRENSA: '#6b7280',
}

const TIPO_LABELS: Record<string, string> = {
  INFLUENCER: 'Influencer',
  CLIENTE: 'Cliente',
  PARCEIRO: 'Parceiro',
  VIP: 'VIP',
  COLABORADOR: 'Colaborador',
  IMPRENSA: 'Imprensa',
}

// Countdown até o evento
const EVENTO_DATA = new Date('2026-05-08T21:00:00-03:00')

function useCountdown() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const diff = EVENTO_DATA.getTime() - now.getTime()
  if (diff <= 0) return null
  const dias = differenceInDays(EVENTO_DATA, now)
  const horas = differenceInHours(EVENTO_DATA, now) % 24
  const minutos = differenceInMinutes(EVENTO_DATA, now) % 60
  return { dias, horas, minutos }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const countdown = useCountdown()

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  const tipoData = (data?.porTipo ?? []).map(t => ({
    name: t.tipo,
    label: TIPO_LABELS[t.tipo] ?? t.tipo,
    value: t._count.tipo,
  }))

  const categoriaMap: Record<string, { livre: number; reservado: number; usado: number }> = {}
  for (const item of (data?.ingressos ?? [])) {
    if (!categoriaMap[item.categoria]) {
      categoriaMap[item.categoria] = { livre: 0, reservado: 0, usado: 0 }
    }
    if (item.status === 'LIVRE') categoriaMap[item.categoria].livre += item._count.status
    if (item.status === 'RESERVADO') categoriaMap[item.categoria].reservado += item._count.status
    if (item.status === 'USADO') categoriaMap[item.categoria].usado += item._count.status
  }

  const barData = Object.entries(categoriaMap).map(([cat, counts]) => ({
    categoria: cat === 'BACKSTAGE' ? 'Backstage' : cat === 'IMOVEIS' ? 'Imóveis' : 'Futsal',
    Livre: counts.livre,
    Reservado: counts.reservado,
    Usado: counts.usado,
  }))

  const taxaOcupacao = data ? Math.round((data.reservados / data.totalIngressos) * 100) : 0

  // Ocupação por categoria com barra
  const categorias = [
    { label: 'Backstage', total: 50, key: 'BACKSTAGE', color: '#c9a84c', href: '/backstage' },
    { label: 'Imóveis', total: 10, key: 'IMOVEIS', color: '#2d6a4f', href: '/imoveis' },
    { label: 'Futsal', total: 10, key: 'FUTSAL', color: '#3b82f6', href: '/futsal' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header + Countdown */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">Festa do Peão de Hortolândia 2026 · Prospere Consórcio</p>
          </div>

          {/* Countdown */}
          {countdown && (
            <div className="bg-gradient-to-r from-[#1a1a0a] to-[#1a1200] border border-[#c9a84c]/30 rounded-2xl px-5 py-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#c9a84c]/70 text-xs">
                <Calendar size={13} />
                <span>08 de maio</span>
              </div>
              <div className="w-px h-6 bg-[#c9a84c]/20" />
              <div className="flex gap-4">
                {[
                  { v: countdown.dias, l: 'dias' },
                  { v: countdown.horas, l: 'horas' },
                  { v: countdown.minutos, l: 'min' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <div className="text-[#c9a84c] font-bold text-xl leading-none">{String(v).padStart(2, '0')}</div>
                    <div className="text-gray-600 text-[10px] uppercase tracking-widest mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cards métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Convidados', value: data?.totalConvidados ?? 0, color: '#a855f7', sub: 'pessoas cadastradas' },
            { icon: Ticket, label: 'Reservados', value: data?.reservados ?? 0, color: '#c9a84c', sub: `de ${data?.totalIngressos ?? 70} ingressos` },
            { icon: TrendingUp, label: 'Disponíveis', value: data?.disponiveis ?? 70, color: '#22c55e', sub: 'ingressos livres' },
            { icon: Send, label: 'Convites Enviados', value: data?.convitesEnviados ?? 0, color: '#3b82f6', sub: 'convites digitais' },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="bg-[#141414] border border-[#222] rounded-2xl p-5 relative overflow-hidden group hover:border-[#333] transition-all">
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10" style={{ background: color }} />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{value}</p>
              <p className="text-gray-300 text-xs mt-1 font-medium">{label}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Ocupação por categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorias.map(cat => {
            const m = categoriaMap[cat.key] ?? { livre: 0, reservado: 0, usado: 0 }
            const ocupados = m.reservado + m.usado
            const pct = Math.round((ocupados / cat.total) * 100)
            return (
              <Link href={cat.href} key={cat.key}
                className="bg-[#141414] border border-[#222] rounded-2xl p-5 hover:border-[#333] transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold text-sm">{cat.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cat.color, background: `${cat.color}15` }}>
                    {pct}%
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-white">{ocupados}</span>
                  <span className="text-gray-600 text-sm mb-0.5">/ {cat.total}</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cat.color }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
                  <span>{m.livre} livres</span>
                  <span>{m.reservado} reservados</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Barras */}
          <div className="lg:col-span-3 bg-[#141414] border border-[#222] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-sm mb-5">Ocupação por Categoria</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="35%">
                <XAxis dataKey="categoria" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ color: '#999', fontSize: 11 }} />
                <Bar dataKey="Livre" fill="#2a2a2a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Reservado" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Usado" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pizza */}
          <div className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-2xl p-6">
            <h2 className="text-white font-semibold text-sm mb-5">Por Tipo</h2>
            {tipoData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={tipoData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                      {tipoData.map((entry, i) => (
                        <Cell key={i} fill={TIPO_COLORS[entry.name] ?? '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {tipoData.map(t => (
                    <div key={t.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: TIPO_COLORS[t.name] }} />
                        <span className="text-gray-300">{t.label}</span>
                      </div>
                      <span className="text-white font-semibold">{t.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[160px] flex items-center justify-center text-gray-600 text-sm">
                Nenhum convidado ainda
              </div>
            )}
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Últimas Reservas</h2>
            <Link href="/pessoas" className="text-[#c9a84c] text-xs flex items-center gap-1 hover:underline">
              Ver todas <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {['Convidado', 'Tipo', 'Ingresso', 'Show', 'Data'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.ultimasReservas ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-600 text-sm">
                      Nenhuma reserva cadastrada ainda
                    </td>
                  </tr>
                ) : (
                  (data?.ultimasReservas ?? []).map((c: any) => (
                    <tr key={c.id} className="border-b border-[#181818] hover:bg-[#181818] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xs font-bold flex-shrink-0">
                            {c.nome.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{c.nome}</div>
                            <div className="text-gray-600 text-xs">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5"><BadgeTipo tipo={c.tipo} /></td>
                      <td className="px-6 py-3.5">
                        {c.ingresso ? (
                          <span className="text-gray-200 text-xs font-mono">{c.ingresso.numero}</span>
                        ) : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-gray-300 text-xs">{c.show?.artista ?? '—'}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock size={10} />
                          {format(new Date(c.createdAt), "dd/MM · HH:mm", { locale: ptBR })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
