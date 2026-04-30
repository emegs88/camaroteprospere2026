'use client'

import { useState } from 'react'

interface FormConvidadoProps {
  onSuccess: () => void
  onCancel: () => void
  shows: Array<{ id: string; nome: string; artista: string }>
  ingressosLivres: Array<{ id: string; numero: string; categoria: string }>
  initialData?: any
}

const tipos = ['INFLUENCER', 'CLIENTE', 'PARCEIRO', 'VIP', 'COLABORADOR', 'IMPRENSA']
const nichos = ['Lifestyle', 'Sertanejo', 'Agro', 'Negócios', 'Esporte']
const produtos = ['Imóvel', 'Consórcio', 'Automóvel', 'Serviços']
const statusCliente = ['Prospect', 'Em negociação', 'Cliente ativo', 'Inativo']
const redesSociais = ['instagram', 'tiktok', 'youtube', 'x', 'linkedin']

export function FormConvidado({ onSuccess, onCancel, shows, ingressosLivres, initialData }: FormConvidadoProps) {
  const [form, setForm] = useState({
    nome: initialData?.nome ?? '',
    email: initialData?.email ?? '',
    telefone: initialData?.telefone ?? '',
    tipo: initialData?.tipo ?? 'CLIENTE',
    redeSocial: initialData?.redeSocial ?? '',
    handle: initialData?.handle ?? '',
    seguidores: initialData?.seguidores ?? '',
    nicho: initialData?.nicho ?? '',
    empresa: initialData?.empresa ?? '',
    produtoInteresse: initialData?.produtoInteresse ?? '',
    statusCliente: initialData?.statusCliente ?? 'Prospect',
    consultor: initialData?.consultor ?? '',
    observacoes: initialData?.observacoes ?? '',
    showId: initialData?.showId ?? '',
    ingressoId: initialData?.ingressoId ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload: any = { ...form }
      if (payload.seguidores) payload.seguidores = parseInt(payload.seguidores)
      if (!payload.showId) delete payload.showId
      if (!payload.ingressoId) delete payload.ingressoId
      if (!payload.email) delete payload.email
      if (!payload.telefone) delete payload.telefone

      const url = initialData?.id ? `/api/convidados/${initialData.id}` : '/api/convidados'
      const method = initialData?.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isInfluencer = form.tipo === 'INFLUENCER'
  const isClienteOuParceiro = ['CLIENTE', 'PARCEIRO'].includes(form.tipo)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dados básicos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Nome *</label>
          <input required value={form.nome} onChange={e => set('nome', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
            placeholder="Nome completo" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
            placeholder="email@exemplo.com" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Telefone / WhatsApp</label>
          <input value={form.telefone} onChange={e => set('telefone', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
            placeholder="(19) 99999-9999" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Tipo *</label>
          <select required value={form.tipo} onChange={e => set('tipo', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Show Vinculado</label>
          <select value={form.showId} onChange={e => set('showId', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
            <option value="">Selecione um show</option>
            {shows.map(s => <option key={s.id} value={s.id}>{s.artista} — {s.nome}</option>)}
          </select>
        </div>
      </div>

      {/* Ingresso */}
      <div>
        <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Ingresso</label>
        <select value={form.ingressoId} onChange={e => set('ingressoId', e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
          <option value="">Sem ingresso atribuído</option>
          {ingressosLivres.map(i => <option key={i.id} value={i.id}>{i.numero} — {i.categoria}</option>)}
        </select>
      </div>

      {/* Campos de Influencer */}
      {isInfluencer && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-purple-900/20 border border-purple-800/40 rounded-xl">
          <div className="col-span-2 text-purple-300 text-xs font-semibold uppercase tracking-wide">Dados de Influencer</div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Rede Social</label>
            <select value={form.redeSocial} onChange={e => set('redeSocial', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
              <option value="">Selecione</option>
              {redesSociais.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Handle (@usuario)</label>
            <input value={form.handle} onChange={e => set('handle', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
              placeholder="@usuario" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Seguidores</label>
            <input type="number" value={form.seguidores} onChange={e => set('seguidores', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
              placeholder="50000" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Nicho</label>
            <select value={form.nicho} onChange={e => set('nicho', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
              <option value="">Selecione</option>
              {nichos.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Campos de Cliente/Parceiro */}
      {isClienteOuParceiro && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-900/20 border border-yellow-800/40 rounded-xl">
          <div className="col-span-2 text-yellow-300 text-xs font-semibold uppercase tracking-wide">Dados de {form.tipo === 'CLIENTE' ? 'Cliente' : 'Parceiro'}</div>
          <div className="col-span-2">
            <label className="block text-gray-400 text-xs mb-1">Empresa / Marca</label>
            <input value={form.empresa} onChange={e => set('empresa', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
              placeholder="Nome da empresa" />
          </div>
          {form.tipo === 'CLIENTE' && (
            <>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Produto de Interesse</label>
                <select value={form.produtoInteresse} onChange={e => set('produtoInteresse', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
                  <option value="">Selecione</option>
                  {produtos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Status do Cliente</label>
                <select value={form.statusCliente} onChange={e => set('statusCliente', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]">
                  {statusCliente.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-400 text-xs mb-1">Consultor Responsável</label>
                <input value={form.consultor} onChange={e => set('consultor', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
                  placeholder="Nome do consultor" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Observações internas */}
      <div>
        <label className="block text-gray-400 text-xs mb-1 font-medium uppercase tracking-wide">Observações Internas</label>
        <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={3}
          className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c] resize-none"
          placeholder="Notas internas (não aparecem no convite)" />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-[#444] text-gray-400 hover:text-white hover:border-[#666] py-2 rounded-lg transition-colors font-medium">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#c9a84c] hover:bg-[#a8863a] disabled:opacity-50 text-black font-bold py-2 rounded-lg transition-colors">
          {loading ? 'Salvando...' : initialData?.id ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}
