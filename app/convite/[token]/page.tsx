'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import { Download, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'

const TIPO_LABELS: Record<string, string> = {
  INFLUENCER: 'Influencer Parceiro',
  CLIENTE: 'Convidado Cliente',
  PARCEIRO: 'Convidado Parceiro',
  VIP: 'Convidado VIP',
  COLABORADOR: 'Colaborador',
  IMPRENSA: 'Imprensa',
}

const TIPO_COLORS: Record<string, string> = {
  INFLUENCER: '#a855f7',
  CLIENTE: '#eab308',
  PARCEIRO: '#22c55e',
  VIP: '#ef4444',
  COLABORADOR: '#3b82f6',
  IMPRENSA: '#6b7280',
}

export default function ConvitePage() {
  const params = useParams()
  const token = params.token as string
  const [convidado, setConvidado] = useState<any>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const conviteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/convidados/token/${token}`)
        if (!res.ok) { setNotFound(true); setLoading(false); return }
        const data = await res.json()
        setConvidado(data)
        const qr = await QRCode.toDataURL(`${window.location.origin}/convite/${token}`, {
          width: 160,
          margin: 1,
          color: { dark: '#1a1a1a', light: '#c9a84c' },
        })
        setQrDataUrl(qr)
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [token])

  async function handleDownload() {
    if (!conviteRef.current) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(conviteRef.current, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `convite-${convidado?.nome?.replace(/\s/g, '-').toLowerCase()}-prospere.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `Convite Prospere – Festa do Peão Hortolândia 2026`,
        text: `${convidado?.nome}, seu convite exclusivo para a Festa do Peão de Hortolândia 2026!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-center p-8">
        <div>
          <p className="text-6xl mb-4">🎫</p>
          <h1 className="text-white text-2xl font-bold mb-2">Convite não encontrado</h1>
          <p className="text-gray-400">Este link de convite é inválido ou expirou.</p>
        </div>
      </div>
    )
  }

  const tipoColor = TIPO_COLORS[convidado?.tipo] ?? '#c9a84c'
  const tipoLabel = TIPO_LABELS[convidado?.tipo] ?? convidado?.tipo

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-6">
      {/* Convite visual */}
      <div
        ref={conviteRef}
        className="w-full max-w-md bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: `2px solid ${tipoColor}40` }}
      >
        {/* Header dourado */}
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2218] to-[#1a1a1a] p-5 border-b border-[#c9a84c]/20">
          <div className="flex items-center justify-between">
            <div>
              <Image
                src="/logos/logo-prospere.png"
                alt="Prospere Consórcios"
                width={110}
                height={110}
                className="w-[110px] h-[110px] object-contain -ml-2 -mt-2"
              />
              <p className="text-gray-500 text-xs uppercase tracking-widest -mt-1">Patrocinador Master</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-xs">@festadopeao_hortolandia</p>
              <p className="text-gray-500 text-xs">Hortolândia · SP</p>
            </div>
          </div>
        </div>

        {/* Banner do evento */}
        <div className="bg-gradient-to-br from-[#2d6a4f] to-[#1a3d2d] h-40 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }} />
          <div className="text-center z-10">
            <p className="text-[#c9a84c] font-bold text-3xl tracking-wider">FESTA DO PEÃO</p>
            <p className="text-white font-semibold text-lg">DE HORTOLÂNDIA</p>
            <p className="text-[#c9a84c] text-2xl font-bold mt-1">2026</p>
          </div>
        </div>

        {/* Corpo do convite */}
        <div className="p-6 space-y-5">
          {/* Badge tipo */}
          <div className="flex justify-center">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
              style={{ color: tipoColor, borderColor: tipoColor + '60', backgroundColor: tipoColor + '15' }}
            >
              {tipoLabel}
            </span>
          </div>

          {/* Nome */}
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Portador</p>
            <p className="text-white font-bold text-2xl">{convidado?.nome}</p>
          </div>

          {/* Divider dourado */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#c9a84c]/30" />
            <span className="text-[#c9a84c] text-lg">✦</span>
            <div className="flex-1 h-px bg-[#c9a84c]/30" />
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-2 gap-4 text-center">
            {convidado?.ingresso && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Ingresso</p>
                <p className="text-[#c9a84c] font-bold">{convidado.ingresso.numero}</p>
                <p className="text-gray-400 text-xs">{convidado.ingresso.categoria}</p>
              </div>
            )}
            {convidado?.show && (
              <div className={convidado?.ingresso ? '' : 'col-span-2'}>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Show</p>
                <p className="text-white font-semibold text-sm">{convidado.show.artista}</p>
                <p className="text-gray-400 text-xs">
                  {format(new Date(convidado.show.data), "dd/MM/yyyy", { locale: ptBR })} · {convidado.show.horario}
                </p>
              </div>
            )}
          </div>

          {/* QR Code */}
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-[#c9a84c] rounded-xl">
                <img src={qrDataUrl} alt="QR Code" width={120} height={120} />
              </div>
              <p className="text-gray-500 text-xs">Apresente este QR Code na entrada</p>
            </div>
          )}

          {/* Número do ingresso */}
          {convidado?.ingresso && (
            <div className="text-center">
              <p className="text-gray-600 text-xs font-mono">{convidado.ingresso.numero}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-[#111] rounded-xl p-3 text-center border border-[#2a2a2a]">
            <p className="text-gray-500 text-xs">Prospere Consórcio · Patrocinador Master</p>
            <p className="text-gray-600 text-xs">Festa do Peão de Hortolândia 2026</p>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-6 w-full max-w-md">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#a8863a] text-black font-bold py-3 rounded-xl transition-colors"
        >
          <Download size={18} />
          Salvar PNG
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 font-semibold py-3 rounded-xl transition-colors"
        >
          <Share2 size={18} />
          Compartilhar
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-6 text-center">
        prospere.com.br · Hortolândia, SP
      </p>
    </div>
  )
}
