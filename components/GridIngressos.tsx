'use client'

import { useEffect, useState } from 'react'

type Ingresso = {
  id: string
  numero: string
  categoria: string
  status: string
  convidado?: { nome: string; tipo: string }
  show?: { nome: string; artista: string }
}

const STATUS_COLORS = {
  LIVRE: 'bg-[#2a2a2a] border-[#444] text-gray-500 hover:border-[#c9a84c] hover:text-white cursor-pointer',
  RESERVADO: 'bg-[#c9a84c]/20 border-[#c9a84c]/60 text-[#c9a84c] cursor-pointer',
  USADO: 'bg-[#2d6a4f]/20 border-[#2d6a4f] text-green-400 cursor-default',
}

interface Props {
  categoria: string
  titulo: string
  total: number
}

export function GridIngressos({ categoria, titulo, total }: Props) {
  const [ingressos, setIngressos] = useState<Ingresso[]>([])
  const [tooltip, setTooltip] = useState<{ ingresso: Ingresso; x: number; y: number } | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchIngressos() {
    const res = await fetch(`/api/ingressos?categoria=${categoria}`)
    const data = await res.json()
    setIngressos(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchIngressos() }, [categoria])

  const livres = ingressos.filter(i => i.status === 'LIVRE').length
  const reservados = ingressos.filter(i => i.status === 'RESERVADO').length
  const usados = ingressos.filter(i => i.status === 'USADO').length

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">{titulo}</h2>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2a2a2a] border border-[#555] inline-block" />Livre ({livres})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#c9a84c]/20 border border-[#c9a84c] inline-block" />Reservado ({reservados})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2d6a4f]/20 border border-[#2d6a4f] inline-block" />Usado ({usados})</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(total, 10)}, 1fr)` }}>
            {ingressos.map(ingresso => (
              <div
                key={ingresso.id}
                className={`aspect-square rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${STATUS_COLORS[ingresso.status as keyof typeof STATUS_COLORS]}`}
                onMouseEnter={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect()
                  setTooltip({ ingresso, x: rect.left, y: rect.top })
                }}
                onMouseLeave={() => setTooltip(null)}
                title={ingresso.convidado?.nome ?? ingresso.numero}
              >
                {ingresso.numero.replace(/\D/g, '').slice(-3)}
              </div>
            ))}
          </div>

          {tooltip && (
            <div className="fixed z-50 bg-[#111] border border-[#333] rounded-lg p-3 pointer-events-none shadow-xl"
              style={{ top: tooltip.y - 80, left: tooltip.x }}>
              <p className="text-white font-semibold text-sm">{tooltip.ingresso.numero}</p>
              {tooltip.ingresso.convidado && (
                <p className="text-[#c9a84c] text-xs">{tooltip.ingresso.convidado.nome}</p>
              )}
              {tooltip.ingresso.show && (
                <p className="text-gray-400 text-xs">{tooltip.ingresso.show.artista}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">{tooltip.ingresso.status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
