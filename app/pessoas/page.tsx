'use client'

import { useEffect, useState, useCallback } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { BadgeTipo } from '@/components/BadgeTipo'
import { Modal } from '@/components/Modal'
import { FormConvidado } from '@/components/FormConvidado'
import {
  UserPlus, Search, MessageCircle, Link2, Star, Trash2,
  Instagram, ExternalLink, Edit2, RefreshCw
} from 'lucide-react'

const TIPOS = ['INFLUENCER', 'CLIENTE', 'PARCEIRO', 'VIP', 'COLABORADOR', 'IMPRENSA']
const TIPO_LABELS: Record<string, string> = {
  INFLUENCER: 'Influencers',
  CLIENTE: 'Clientes',
  PARCEIRO: 'Parceiros',
  VIP: 'VIPs',
  COLABORADOR: 'Colaboradores',
  IMPRENSA: 'Imprensa',
}

type Convidado = {
  id: string
  nome: string
  email?: string
  telefone?: string
  tipo: string
  handle?: string
  seguidores?: number
  nicho?: string
  redeSocial?: string
  empresa?: string
  produtoInteresse?: string
  statusCliente?: string
  consultor?: string
  observacoes?: string
  statusPost?: string
  linkPost?: string
  avaliacaoPost?: number
  tokenConvite: string
  conviteEnviado: boolean
  ingresso?: { numero: string; categoria: string; status: string }
  show?: { nome: string; artista: string; data: string }
  interacoes?: any[]
}

function formatSeguidores(n?: number) {
  if (!n) return ''
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return String(n)
}

function getWhatsappMsg(c: Convidado, baseUrl: string) {
  const link = `${baseUrl}/convite/${c.tokenConvite}`
  if (c.tipo === 'INFLUENCER') {
    return encodeURIComponent(`Olá ${c.nome}! Você foi selecionado(a) como influencer parceiro(a) da Prospere Consórcio para a Festa do Peão de Hortolândia 2026! 🤠🌟\n\nSeu convite exclusivo: ${link}`)
  }
  if (c.tipo === 'VIP') {
    return encodeURIComponent(`Prezado(a) ${c.nome}, é com grande prazer que a Prospere Consórcio convida você para a Festa do Peão de Hortolândia 2026 como nosso convidado VIP! 🥂\n\nSeu convite: ${link}`)
  }
  if (c.tipo === 'CLIENTE') {
    return encodeURIComponent(`Olá ${c.nome}! Como cliente especial da Prospere, você está convidado(a) para a Festa do Peão de Hortolândia 2026! 🎉\n\nSeu convite: ${link}`)
  }
  return encodeURIComponent(`Olá ${c.nome}! A Prospere Consórcio tem o prazer de convidar você para a Festa do Peão de Hortolândia 2026!\n\nSeu convite: ${link}`)
}

const STATUS_POST_LABELS: Record<string, string> = {
  NAO_POSTOU: 'Não postou',
  STORIES: 'Postou stories',
  FEED: 'Postou feed',
  REELS: 'Postou reels',
}

const STATUS_POST_COLORS: Record<string, string> = {
  NAO_POSTOU: 'text-gray-400',
  STORIES: 'text-blue-400',
  FEED: 'text-green-400',
  REELS: 'text-purple-400',
}

function StarRating({ value }: { value?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} className={i <= (value ?? 0) ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-600'} />
      ))}
    </div>
  )
}

function CardConvidado({ c, onEdit, onDelete, onRefresh }: {
  c: Convidado
  onEdit: (c: Convidado) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const conviteUrl = `${baseUrl}/convite/${c.tokenConvite}`

  async function enviarConvite() {
    await fetch(`/api/convidados/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conviteEnviado: true, conviteEnviadoEm: new Date().toISOString() }),
    })
    onRefresh()
  }

  function copiarLink() {
    navigator.clipboard.writeText(conviteUrl)
    alert('Link copiado!')
  }

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#c9a84c]/40 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a8863a] flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
            {c.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight">{c.nome}</h3>
            {c.handle && <p className="text-gray-500 text-xs">{c.handle}</p>}
            {c.empresa && <p className="text-gray-500 text-xs">{c.empresa}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(c)} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded">
            <Edit2 size={13} />
          </button>
          <button onClick={() => { if (confirm('Excluir convidado?')) onDelete(c.id) }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#333] rounded">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Badge + info */}
      <div className="space-y-2 mb-4">
        <BadgeTipo tipo={c.tipo} />

        {c.ingresso && (
          <div className="text-xs text-gray-400">
            <span className="text-[#c9a84c] font-medium">{c.ingresso.numero}</span>
            {' · '}{c.ingresso.categoria}
          </div>
        )}

        {c.show && (
          <div className="text-xs text-gray-500">{c.show.artista}</div>
        )}

        {/* Influencer extras */}
        {c.tipo === 'INFLUENCER' && (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {c.seguidores && <span className="text-purple-300 font-semibold">{formatSeguidores(c.seguidores)} seg.</span>}
            {c.nicho && <span>{c.nicho}</span>}
          </div>
        )}
        {c.tipo === 'INFLUENCER' && c.statusPost && (
          <div className="flex items-center gap-2">
            <span className={`text-xs ${STATUS_POST_COLORS[c.statusPost]}`}>{STATUS_POST_LABELS[c.statusPost]}</span>
            {c.avaliacaoPost && <StarRating value={c.avaliacaoPost} />}
          </div>
        )}

        {/* Cliente extras */}
        {c.tipo === 'CLIENTE' && c.produtoInteresse && (
          <span className="inline-block text-xs bg-yellow-900/40 text-yellow-300 px-2 py-0.5 rounded border border-yellow-800/40">
            {c.produtoInteresse}
          </span>
        )}
        {c.tipo === 'CLIENTE' && c.statusCliente && (
          <div className="text-xs text-gray-500">{c.statusCliente}</div>
        )}
      </div>

      {/* Status convite */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${c.conviteEnviado ? 'bg-green-500' : 'bg-gray-600'}`} />
        <span className="text-xs text-gray-500">{c.conviteEnviado ? 'Convite enviado' : 'Convite não enviado'}</span>
      </div>

      {/* Ações */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            enviarConvite()
            if (c.telefone) {
              window.open(`https://wa.me/55${c.telefone.replace(/\D/g, '')}?text=${getWhatsappMsg(c, baseUrl)}`, '_blank')
            }
          }}
          className="flex items-center gap-1.5 bg-green-900/40 hover:bg-green-800/60 text-green-300 text-xs px-3 py-1.5 rounded-lg transition-colors border border-green-800/40"
        >
          <MessageCircle size={12} />
          WhatsApp
        </button>
        <button
          onClick={copiarLink}
          className="flex items-center gap-1.5 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors border border-[#444]"
        >
          <Link2 size={12} />
          Copiar Link
        </button>
        <a
          href={conviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] text-xs px-3 py-1.5 rounded-lg transition-colors border border-[#c9a84c]/30"
        >
          <ExternalLink size={12} />
          Ver Convite
        </a>
      </div>
    </div>
  )
}

export default function PessoasPage() {
  const [tipoAtivo, setTipoAtivo] = useState('INFLUENCER')
  const [convidados, setConvidados] = useState<Convidado[]>([])
  const [shows, setShows] = useState<any[]>([])
  const [ingressosLivres, setIngressosLivres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Convidado | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [convRes, showsRes, ingRes] = await Promise.all([
        fetch('/api/convidados'),
        fetch('/api/shows'),
        fetch('/api/ingressos'),
      ])
      const [convData, showsData, ingData] = await Promise.all([
        convRes.json(), showsRes.json(), ingRes.json()
      ])
      setConvidados(Array.isArray(convData) ? convData : [])
      setShows(Array.isArray(showsData) ? showsData : [])
      setIngressosLivres(Array.isArray(ingData) ? ingData.filter((i: any) => i.status === 'LIVRE') : [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete(id: string) {
    await fetch(`/api/convidados/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const filtrados = convidados
    .filter(c => c.tipo === tipoAtivo)
    .filter(c => !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (c.handle ?? '').toLowerCase().includes(busca.toLowerCase()) ||
      (c.empresa ?? '').toLowerCase().includes(busca.toLowerCase()))

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pessoas</h1>
            <p className="text-gray-400 mt-1">Gestão completa de convidados por tipo</p>
          </div>
          <button
            onClick={() => { setEditando(null); setModalOpen(true) }}
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8863a] text-black font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <UserPlus size={18} />
            Novo Convidado
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a]">
          {TIPOS.map(tipo => {
            const count = convidados.filter(c => c.tipo === tipo).length
            return (
              <button
                key={tipo}
                onClick={() => setTipoAtivo(tipo)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tipoAtivo === tipo
                    ? 'bg-[#c9a84c] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#242424]'
                }`}
              >
                {TIPO_LABELS[tipo]}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    tipoAtivo === tipo ? 'bg-black/20 text-black' : 'bg-[#333] text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Busca + refresh */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder={`Buscar ${TIPO_LABELS[tipoAtivo].toLowerCase()}...`}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-white pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#c9a84c] text-sm"
            />
          </div>
          <button onClick={fetchData} className="p-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white hover:border-[#444] transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Grid de cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Nenhum {TIPO_LABELS[tipoAtivo].toLowerCase().slice(0, -1)} cadastrado</p>
            <button
              onClick={() => { setEditando(null); setModalOpen(true) }}
              className="mt-4 text-[#c9a84c] hover:underline text-sm"
            >
              Cadastrar primeiro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtrados.map(c => (
              <CardConvidado
                key={c.id}
                c={c}
                onEdit={(conv) => { setEditando(conv); setModalOpen(true) }}
                onDelete={handleDelete}
                onRefresh={fetchData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal cadastro/edição */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditando(null) }}
        title={editando ? 'Editar Convidado' : 'Novo Convidado'}
        size="xl"
      >
        <FormConvidado
          onSuccess={() => { setModalOpen(false); setEditando(null); fetchData() }}
          onCancel={() => { setModalOpen(false); setEditando(null) }}
          shows={shows}
          ingressosLivres={ingressosLivres}
          initialData={editando}
        />
      </Modal>
    </AppLayout>
  )
}
