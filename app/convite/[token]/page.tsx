'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import { Download, Share2, MapPin, Calendar, Clock, Star } from 'lucide-react'
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

const TIPO_COLORS: Record<string, { primary: string; glow: string; badge: string }> = {
  INFLUENCER: { primary: '#a855f7', glow: '#a855f730', badge: 'from-purple-600 to-purple-900' },
  CLIENTE:    { primary: '#c9a84c', glow: '#c9a84c30', badge: 'from-yellow-600 to-yellow-900' },
  PARCEIRO:   { primary: '#22c55e', glow: '#22c55e30', badge: 'from-green-600 to-green-900' },
  VIP:        { primary: '#ef4444', glow: '#ef444430', badge: 'from-red-600 to-red-900' },
  COLABORADOR:{ primary: '#3b82f6', glow: '#3b82f630', badge: 'from-blue-600 to-blue-900' },
  IMPRENSA:   { primary: '#94a3b8', glow: '#94a3b830', badge: 'from-slate-600 to-slate-900' },
}

// Setor do camarote baseado na categoria do ingresso
const SETOR_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  BACKSTAGE: { label: 'Camarote Backstage', icon: '⭐', color: '#c9a84c' },
  IMOVEIS:   { label: 'Camarote Imóveis', icon: '🏠', color: '#2d6a4f' },
  FUTSAL:    { label: 'Camarote Futsal', icon: '⚽', color: '#3b82f6' },
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
          width: 200,
          margin: 1,
          color: { dark: '#0d0d0d', light: '#c9a84c' },
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
        backgroundColor: '#0d0d0d',
        scale: 3,
        useCORS: true,
        logging: false,
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#c9a84c]/60 text-sm tracking-widest uppercase">Carregando convite...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center p-8">
        <div>
          <p className="text-7xl mb-6">🎫</p>
          <h1 className="text-white text-2xl font-bold mb-3">Convite não encontrado</h1>
          <p className="text-gray-400 text-sm">Este link de convite é inválido ou expirou.</p>
        </div>
      </div>
    )
  }

  const tipo = convidado?.tipo ?? 'CLIENTE'
  const colors = TIPO_COLORS[tipo] ?? TIPO_COLORS['CLIENTE']
  const tipoLabel = TIPO_LABELS[tipo] ?? tipo
  const setor = convidado?.ingresso ? SETOR_LABELS[convidado.ingresso.categoria] : null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 py-10"
      style={{ background: 'radial-gradient(ellipse at top, #1a1408 0%, #0a0a0a 60%)' }}
    >
      {/* Fundo com brilho */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }} />
      </div>

      {/* CONVITE */}
      <div ref={conviteRef} className="w-full max-w-[420px] relative z-10">

        {/* === TICKET PRINCIPAL === */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(160deg, #1c1c1c 0%, #141414 50%, #101010 100%)',
            boxShadow: `0 0 0 1px ${colors.primary}30, 0 30px 80px rgba(0,0,0,0.8), 0 0 60px ${colors.glow}`,
          }}
        >
          {/* === TOPO: Logo + Evento === */}
          <div className="relative overflow-hidden">
            {/* Faixa verde escura com texture */}
            <div className="relative h-[180px] overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a3d2d 0%, #0f2b1e 50%, #0c2318 100%)' }}>
              {/* Texture diagonal */}
              <div className="absolute inset-0 opacity-[0.07]" style={{
                backgroundImage: 'repeating-linear-gradient(135deg, #c9a84c 0px, #c9a84c 1px, transparent 0px, transparent 12px)',
              }} />
              {/* Brilho superior */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

              {/* Logo e info */}
              <div className="relative z-10 flex items-start justify-between px-6 pt-5">
                <Image
                  src="/logos/logo-prospere.png"
                  alt="Prospere"
                  width={100}
                  height={100}
                  className="object-contain drop-shadow-lg"
                  style={{ filter: 'brightness(1.1)' }}
                />
                <div className="text-right mt-1">
                  <p className="text-[#c9a84c]/80 text-[10px] font-medium tracking-widest uppercase">Patrocinador Master</p>
                  <p className="text-white/60 text-[10px] mt-0.5">@festadopeao_hortolandia</p>
                  <p className="text-white/40 text-[10px]">Hortolândia · SP</p>
                </div>
              </div>

              {/* Título do evento */}
              <div className="relative z-10 text-center pb-5 mt-2">
                <p className="text-[#c9a84c] font-black text-3xl tracking-[0.15em] leading-none"
                  style={{ textShadow: '0 0 30px rgba(201,168,76,0.5)' }}>
                  FESTA DO PEÃO
                </p>
                <p className="text-white/80 font-semibold text-sm tracking-[0.3em] mt-1">DE HORTOLÂNDIA</p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <div className="h-px w-12 bg-[#c9a84c]/40" />
                  <p className="text-[#c9a84c] font-black text-2xl tracking-widest"
                    style={{ textShadow: '0 0 20px rgba(201,168,76,0.6)' }}>2026</p>
                  <div className="h-px w-12 bg-[#c9a84c]/40" />
                </div>
              </div>

              {/* Linha inferior decorativa */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
            </div>
          </div>

          {/* === PICOTE (separador de ticket) === */}
          <div className="relative flex items-center" style={{ margin: '0 -1px' }}>
            <div className="absolute left-0 w-5 h-10 rounded-r-full"
              style={{ background: 'radial-gradient(ellipse at top, #1a1408 0%, #0a0a0a 60%)' }} />
            <div className="flex-1 border-t-2 border-dashed border-[#c9a84c]/20 mx-5" />
            <div className="absolute right-0 w-5 h-10 rounded-l-full"
              style={{ background: 'radial-gradient(ellipse at top, #1a1408 0%, #0a0a0a 60%)' }} />
          </div>

          {/* === CORPO DO CONVITE === */}
          <div className="px-6 pt-5 pb-6 space-y-5">

            {/* Badge tipo */}
            <div className="flex justify-center">
              <span
                className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] border"
                style={{
                  color: colors.primary,
                  borderColor: colors.primary + '50',
                  background: colors.glow,
                  boxShadow: `0 0 12px ${colors.glow}`,
                }}
              >
                {tipoLabel}
              </span>
            </div>

            {/* Nome do convidado */}
            <div className="text-center">
              <p className="text-[#c9a84c]/60 text-[10px] uppercase tracking-[0.25em] mb-1.5">Portador</p>
              <p className="text-white font-black text-2xl leading-tight tracking-wide"
                style={{ textShadow: '0 2px 20px rgba(255,255,255,0.1)' }}>
                {convidado?.nome?.toUpperCase()}
              </p>
              {convidado?.empresa && (
                <p className="text-gray-400 text-sm mt-1">{convidado.empresa}</p>
              )}
            </div>

            {/* Divider com estrelas */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c40)' }} />
              <Star size={10} className="text-[#c9a84c]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              <Star size={10} className="text-[#c9a84c]/60" />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c40)' }} />
            </div>

            {/* === SETOR DO CAMAROTE === */}
            {setor && (
              <div
                className="rounded-2xl p-4 text-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${setor.color}20, ${setor.color}08)`, border: `1px solid ${setor.color}40` }}
              >
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 0px, transparent 8px)',
                }} />
                <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: setor.color + 'aa' }}>Setor</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{setor.icon}</span>
                  <p className="font-black text-lg text-white tracking-wide">{setor.label.toUpperCase()}</p>
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: setor.color + '25', color: setor.color, border: `1px solid ${setor.color}50` }}
                  >
                    {convidado.ingresso.numero}
                  </span>
                </div>
              </div>
            )}

            {/* Detalhes: show e data */}
            {convidado?.show && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar size={10} className="text-[#c9a84c]/70" />
                    <p className="text-[9px] uppercase tracking-widest text-gray-500">Data</p>
                  </div>
                  <p className="text-white font-bold text-sm">
                    {format(new Date(convidado.show.data), "dd/MM", { locale: ptBR })}
                  </p>
                  <p className="text-gray-500 text-[10px]">
                    {format(new Date(convidado.show.data), "EEE", { locale: ptBR }).toUpperCase()}
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={10} className="text-[#c9a84c]/70" />
                    <p className="text-[9px] uppercase tracking-widest text-gray-500">Horário</p>
                  </div>
                  <p className="text-white font-bold text-sm">{convidado.show.horario}</p>
                  <p className="text-gray-500 text-[10px]">Horas</p>
                </div>
              </div>
            )}

            {convidado?.show && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-center">
                <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Atração</p>
                <p className="text-white font-bold text-base">{convidado.show.artista}</p>
              </div>
            )}

            {/* Local */}
            <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
              <MapPin size={11} className="text-[#c9a84c]/50" />
              <span>Parque de Exposições · Hortolândia, SP</span>
            </div>
          </div>

          {/* === PICOTE INFERIOR === */}
          <div className="relative flex items-center" style={{ margin: '0 -1px' }}>
            <div className="absolute left-0 w-5 h-10 rounded-r-full"
              style={{ background: 'radial-gradient(ellipse at top, #1a1408 0%, #0a0a0a 60%)' }} />
            <div className="flex-1 border-t-2 border-dashed border-[#c9a84c]/20 mx-5" />
            <div className="absolute right-0 w-5 h-10 rounded-l-full"
              style={{ background: 'radial-gradient(ellipse at top, #1a1408 0%, #0a0a0a 60%)' }} />
          </div>

          {/* === QR CODE === */}
          {qrDataUrl && (
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <div
                className="p-3 rounded-2xl relative"
                style={{
                  background: '#c9a84c',
                  boxShadow: '0 0 30px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15)',
                }}
              >
                <img src={qrDataUrl} alt="QR Code" width={160} height={160} className="rounded-lg block" />
              </div>
              <p className="text-gray-500 text-[10px] tracking-widest uppercase">Apresente na entrada</p>
              {convidado?.ingresso && (
                <p className="text-[#c9a84c]/60 text-xs font-mono tracking-widest">{convidado.ingresso.numero}</p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 pb-5">
            <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-gray-600 text-[10px] tracking-widest uppercase">Prospere Consórcio · Patrocinador Master</p>
              <p className="text-gray-700 text-[10px] mt-0.5">Festa do Peão de Hortolândia 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-6 w-full max-w-[420px] relative z-10">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #a8863a)',
            color: '#000',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
          }}
        >
          <Download size={16} />
          Salvar PNG
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl transition-all active:scale-95"
          style={{
            background: 'rgba(201,168,76,0.08)',
            color: '#c9a84c',
            border: '1px solid rgba(201,168,76,0.3)',
          }}
        >
          <Share2 size={16} />
          Compartilhar
        </button>
      </div>

      <p className="text-gray-700 text-xs mt-5 tracking-widest text-center relative z-10">
        PROSPERE CONSÓRCIO · HORTOLÂNDIA, SP
      </p>
    </div>
  )
}
