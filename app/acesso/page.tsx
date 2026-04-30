'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Link2, ExternalLink, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

type Show = {
  id: string
  nome: string
  artista: string
  data: string
}

type Ingresso = {
  id: string
  numero: string
  categoria: string
}

type ConvidadoCriado = {
  id: string
  nome: string
  telefone?: string
  tokenConvite: string
}

function getWhatsappMsg(nome: string, token: string) {
  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/convite/${token}`
  return encodeURIComponent(
    `Olá ${nome}! Como cliente especial da Prospere Consórcio, você está convidado(a) para a Festa do Peão de Hortolândia 2026! 🎉\n\nSeu convite exclusivo: ${link}`
  )
}

export default function AcessoPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [ingressos, setIngressos] = useState<Ingresso[]>([])
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState<ConvidadoCriado | null>(null)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    empresa: '',
    produtoInteresse: '',
    consultor: '',
    showId: '',
    ingressoId: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/shows').then(r => r.json()),
      fetch('/api/ingressos').then(r => r.json()),
    ]).then(([showsData, ingData]) => {
      setShows(Array.isArray(showsData) ? showsData : [])
      setIngressos(Array.isArray(ingData) ? ingData.filter((i: any) => i.status === 'LIVRE') : [])
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return }
    if (!form.consultor.trim()) { setErro('Nome do consultor é obrigatório'); return }

    setLoading(true)
    try {
      const body: any = {
        tipo: 'CLIENTE',
        nome: form.nome.trim(),
        consultor: form.consultor.trim(),
      }
      if (form.telefone) body.telefone = form.telefone.trim()
      if (form.email) body.email = form.email.trim()
      if (form.empresa) body.empresa = form.empresa.trim()
      if (form.produtoInteresse) body.produtoInteresse = form.produtoInteresse
      if (form.showId) body.showId = form.showId
      if (form.ingressoId) body.ingressoId = form.ingressoId

      const res = await fetch('/api/convidados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || 'Erro ao cadastrar'); setLoading(false); return }

      setSucesso(data)
    } catch {
      setErro('Erro de conexão')
    }
    setLoading(false)
  }

  function novoConvite() {
    setSucesso(null)
    setErro('')
    setForm({ nome: '', telefone: '', email: '', empresa: '', produtoInteresse: '', consultor: form.consultor, showId: form.showId, ingressoId: '' })
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 mb-4">
            <span className="text-3xl">🤠</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Convidar Cliente</h1>
          <p className="text-gray-500 text-sm mt-1">Festa do Peão de Hortolândia 2026</p>
          <p className="text-[#c9a84c]/70 text-xs mt-1">Prospere Consórcio</p>
        </div>

        {sucesso ? (
          /* Tela de sucesso */
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle size={22} />
              <div>
                <p className="font-semibold">Convite criado!</p>
                <p className="text-sm text-gray-400">{sucesso.nome}</p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
              {sucesso.telefone && (
                <a
                  href={`https://wa.me/55${sucesso.telefone.replace(/\D/g, '')}?text=${getWhatsappMsg(sucesso.nome, sucesso.tokenConvite)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <MessageCircle size={18} />
                  Enviar por WhatsApp
                </a>
              )}

              <button
                onClick={() => {
                  const link = `${window.location.origin}/convite/${sucesso.tokenConvite}`
                  navigator.clipboard.writeText(link)
                  alert('Link copiado!')
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-200 font-medium py-3 px-4 rounded-xl transition-colors border border-[#444]"
              >
                <Link2 size={16} />
                Copiar Link do Convite
              </button>

              <a
                href={`/convite/${sucesso.tokenConvite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] font-medium py-3 px-4 rounded-xl transition-colors border border-[#c9a84c]/30"
              >
                <ExternalLink size={16} />
                Visualizar Convite
              </a>
            </div>

            <button
              onClick={novoConvite}
              className="flex items-center justify-center gap-2 w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
            >
              <UserPlus size={14} />
              Convidar outro cliente
            </button>
          </div>

        ) : (
          /* Formulário */
          <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">

            {erro && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} />
                {erro}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Seu nome (consultor) *</label>
              <input
                value={form.consultor}
                onChange={e => setForm(f => ({ ...f, consultor: e.target.value }))}
                placeholder="Ex: João Silva"
                className="w-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-600 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              />
            </div>

            <div className="border-t border-[#222] pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Dados do Cliente</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Nome completo *</label>
              <input
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Nome do cliente"
                className="w-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-600 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">WhatsApp</label>
              <input
                value={form.telefone}
                onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
                type="tel"
                className="w-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-600 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Email</label>
              <input
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@exemplo.com"
                type="email"
                className="w-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-600 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Empresa</label>
              <input
                value={form.empresa}
                onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))}
                placeholder="Empresa do cliente"
                className="w-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-600 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Produto de interesse</label>
              <select
                value={form.produtoInteresse}
                onChange={e => setForm(f => ({ ...f, produtoInteresse: e.target.value }))}
                className="w-full bg-[#1e1e1e] border border-[#333] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
              >
                <option value="">Selecionar...</option>
                <option value="Consórcio de Imóvel">Consórcio de Imóvel</option>
                <option value="Consórcio de Veículo">Consórcio de Veículo</option>
                <option value="Consórcio de Serviços">Consórcio de Serviços</option>
                <option value="Investimento">Investimento</option>
              </select>
            </div>

            {shows.length > 0 && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Show</label>
                <select
                  value={form.showId}
                  onChange={e => setForm(f => ({ ...f, showId: e.target.value, ingressoId: '' }))}
                  className="w-full bg-[#1e1e1e] border border-[#333] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
                >
                  <option value="">Sem show específico</option>
                  {shows.map(s => (
                    <option key={s.id} value={s.id}>{s.artista} — {s.nome}</option>
                  ))}
                </select>
              </div>
            )}

            {ingressos.filter(i => !form.showId || true).length > 0 && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Ingresso</label>
                <select
                  value={form.ingressoId}
                  onChange={e => setForm(f => ({ ...f, ingressoId: e.target.value }))}
                  className="w-full bg-[#1e1e1e] border border-[#333] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#c9a84c] text-sm transition-colors"
                >
                  <option value="">Sem ingresso</option>
                  {ingressos.map(i => (
                    <option key={i.id} value={i.id}>{i.numero} — {i.categoria}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#a8863a] disabled:opacity-50 text-black font-bold py-3 px-4 rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Criar Convite
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
