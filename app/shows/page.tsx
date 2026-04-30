'use client'

import { useEffect, useState, useRef } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Modal } from '@/components/Modal'
import { Music, Plus, Trash2, Edit2, Calendar, Clock, Users, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Mapeamento data → pasta do show
const PASTA_POR_DATA: Record<string, string> = {
  '2026-05-08': 'shows/08-05-hugo-guilherme-samuel',
  '2026-05-09': 'shows/09-05-thiaguinho',
  '2026-05-10': 'shows/10-05-edson-hudson-victor-kauan',
  '2026-05-15': 'shows/15-05-diego-victor-hugo-kevi',
  '2026-05-16': 'shows/16-05-ze-neto-cristiano',
  '2026-05-17': 'shows/17-05-os-menotti-paula-mello',
}

type Show = {
  id: string
  nome: string
  artista: string
  data: string
  horario: string
  imagem?: string
  descricao?: string
  _count?: { ingressos: number; convidados: number }
}

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [fotasPastas, setFotosPastas] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Show | null>(null)
  const [form, setForm] = useState({ nome: '', artista: '', data: '', horario: '21:00', descricao: '', imagem: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function fetchShows() {
    setLoading(true)
    const [resShows, resFotos] = await Promise.all([
      fetch('/api/shows'),
      fetch('/api/shows/scan-fotos'),
    ])
    const dataShows = await resShows.json()
    const dataFotos = await resFotos.json()
    setShows(Array.isArray(dataShows) ? dataShows : [])
    setFotosPastas(dataFotos)
    setLoading(false)
  }

  useEffect(() => { fetchShows() }, [])

  function openNew() {
    setEditando(null)
    setForm({ nome: '', artista: '', data: '', horario: '21:00', descricao: '', imagem: '' })
    setModalOpen(true)
  }

  function openEdit(s: Show) {
    setEditando(s)
    setForm({
      nome: s.nome,
      artista: s.artista,
      data: s.data.split('T')[0],
      horario: s.horario,
      descricao: s.descricao ?? '',
      imagem: s.imagem ?? '',
    })
    setModalOpen(true)
  }

  async function handleUploadImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const pasta = PASTA_POR_DATA[form.data] || 'shows'
      const fd = new FormData()
      fd.append('file', file)
      fd.append('pasta', pasta)
      fd.append('filename', file.name)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) setForm(f => ({ ...f, imagem: data.path }))
    } catch (e) {
      console.error(e)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, data: new Date(form.data + 'T03:00:00Z').toISOString(), imagem: form.imagem || null }
    if (editando) {
      await fetch(`/api/shows/${editando.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/shows', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
    }
    setSaving(false)
    setModalOpen(false)
    fetchShows()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir show?')) return
    await fetch(`/api/shows/${id}`, { method: 'DELETE' })
    fetchShows()
  }

  const pastaAtual = form.data ? (PASTA_POR_DATA[form.data] || 'shows') : 'shows'

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Shows</h1>
            <p className="text-gray-400 mt-1">Cadastro e gerenciamento de shows</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8863a] text-black font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Plus size={18} /> Novo Show
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Music size={48} className="mx-auto mb-4 opacity-30" />
            <p>Nenhum show cadastrado</p>
            <button onClick={openNew} className="mt-4 text-[#c9a84c] hover:underline text-sm">Cadastrar primeiro show</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {shows.map((s, idx) => {
              // Usa foto do banco OU detecta automaticamente da pasta
              const dataKey = s.data.split('T')[0]
              const fotoFinal = s.imagem || fotasPastas[dataKey] || null
              return (
              <div key={s.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#c9a84c]/50 hover:shadow-[0_0_24px_rgba(201,168,76,0.08)] transition-all group cursor-pointer">
                {/* Área da foto */}
                <div className="relative bg-[#111] flex items-center justify-center" style={{ height: '220px' }}>
                  {fotoFinal ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fotoFinal}
                      alt={s.artista}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e2d20] to-[#111] flex items-center justify-center">
                      <Music size={44} className="text-[#c9a84c]/20" />
                    </div>
                  )}
                  {/* Gradiente sobre a foto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                  {/* Badge noite */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#c9a84c] text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      Noite {idx + 1}
                    </span>
                  </div>

                  {/* Botões editar/excluir */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(s)} className="p-1.5 bg-black/70 hover:bg-[#c9a84c] hover:text-black text-white rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Info sobre a foto */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-0.5 font-medium">
                      {format(new Date(s.data), "EEEE · dd/MM", { locale: ptBR })}
                    </p>
                    <h3 className="text-white font-bold text-lg leading-tight">{s.artista}</h3>
                  </div>
                </div>

                {/* Rodapé do card */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-[#222]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Clock size={12} className="text-[#c9a84c]/70" />
                      {s.horario}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Users size={12} className="text-[#c9a84c]/70" />
                      {s._count?.convidados ?? 0} convidados
                    </div>
                  </div>
                  {!fotoFinal && (
                    <button
                      onClick={() => openEdit(s)}
                      className="text-[10px] text-[#c9a84c]/60 hover:text-[#c9a84c] flex items-center gap-1 transition-colors"
                    >
                      <Upload size={10} /> foto
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar Show' : 'Novo Show'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">Artista *</label>
            <input required value={form.artista} onChange={e => setForm(f => ({ ...f, artista: e.target.value }))}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
              placeholder="Nome do artista" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">Nome do Show / Evento</label>
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
              placeholder="Ex: Show Principal – Noite 1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">Data *</label>
              <input required type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">Horário</label>
              <input value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}
                className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
                placeholder="21:00" />
            </div>
          </div>

          {/* Upload de imagem */}
          <div>
            <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wide font-medium">Foto do Show</label>
            {form.imagem ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#444] group">
                <Image src={form.imagem} alt="foto" fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, imagem: '' }))}
                    className="bg-red-600/90 text-white p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-40 border-2 border-dashed border-[#444] hover:border-[#c9a84c]/60 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload size={24} className="text-[#c9a84c] opacity-70" />
                    <span className="text-gray-400 text-sm">Clique para enviar a foto</span>
                    <span className="text-gray-600 text-xs font-mono">→ /public/{pastaAtual}/</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImagem}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wide font-medium">Descrição</label>
            <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={2}
              className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c] resize-none"
              placeholder="Descrição do show..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-[#444] text-gray-400 hover:text-white py-2 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#c9a84c] hover:bg-[#a8863a] disabled:opacity-50 text-black font-bold py-2 rounded-lg transition-colors">
              {saving ? 'Salvando...' : editando ? 'Atualizar' : 'Criar Show'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}
