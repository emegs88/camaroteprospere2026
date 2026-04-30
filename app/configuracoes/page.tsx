'use client'

import { AppLayout } from '@/components/AppLayout'
import { Download, Database, Users, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Usuario {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function ConfiguracoesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [novoNome, setNovoNome] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    const res = await fetch('/api/usuarios')
    if (res.ok) setUsuarios(await res.json())
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    setSucesso('')
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: novoNome, email: novoEmail, password: novaSenha }),
    })
    const data = await res.json()
    setSalvando(false)
    if (!res.ok) {
      setErro(data.error ?? 'Erro ao criar usuário')
    } else {
      setSucesso('Usuário criado com sucesso!')
      setNovoNome('')
      setNovoEmail('')
      setNovaSenha('')
      carregarUsuarios()
      setTimeout(() => setSucesso(''), 3000)
    }
  }

  async function removerUsuario(id: string, nome: string) {
    if (!confirm(`Remover usuário "${nome}"?`)) return
    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error ?? 'Erro ao remover')
    } else {
      carregarUsuarios()
    }
  }

  async function exportarCSV(tipo?: string) {
    const url = tipo ? `/api/convidados?tipo=${tipo}` : '/api/convidados'
    const res = await fetch(url)
    const data: any[] = await res.json()

    const headers = ['Nome', 'Email', 'Telefone', 'Tipo', 'Handle', 'Seguidores', 'Empresa', 'Produto', 'Status Cliente', 'Consultor', 'Ingresso', 'Show', 'Convite Enviado']
    const rows = data.map(c => [
      c.nome, c.email ?? '', c.telefone ?? '', c.tipo,
      c.handle ?? '', c.seguidores ?? '', c.empresa ?? '',
      c.produtoInteresse ?? '', c.statusCliente ?? '', c.consultor ?? '',
      c.ingresso?.numero ?? '', c.show?.artista ?? '',
      c.conviteEnviado ? 'Sim' : 'Não'
    ])

    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `convidados${tipo ? `-${tipo.toLowerCase()}` : ''}-prospere.csv`
    link.click()
  }

  const tipoOptions = ['INFLUENCER', 'CLIENTE', 'PARCEIRO', 'VIP', 'COLABORADOR', 'IMPRENSA']

  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-1">Usuários, exportação de dados e configurações do sistema</p>
        </div>

        {/* Usuários do sistema */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Usuários do Sistema</h2>
              <p className="text-gray-400 text-sm">Gerencie quem pode acessar o painel</p>
            </div>
          </div>

          {/* Lista de usuários */}
          <div className="space-y-2 mb-6">
            {usuarios.map(u => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{u.name}</p>
                  <p className="text-gray-500 text-xs font-mono">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-2 py-0.5 rounded-full uppercase">{u.role}</span>
                  <button
                    onClick={() => removerUsuario(u.id, u.name)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                    title="Remover usuário"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Formulário novo usuário */}
          <div className="border-t border-[#2a2a2a] pt-5">
            <p className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
              <Plus size={15} className="text-[#c9a84c]" />
              Novo Usuário
            </p>
            <form onSubmit={criarUsuario} className="space-y-3">
              <input
                type="text"
                placeholder="Nome completo"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#333] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                value={novoEmail}
                onChange={e => setNovoEmail(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#333] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Senha"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#333] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {erro && <p className="text-red-400 text-xs">{erro}</p>}
              {sucesso && <p className="text-green-400 text-xs">{sucesso}</p>}

              <button
                type="submit"
                disabled={salvando}
                className="w-full bg-[#c9a84c] hover:bg-[#b8973e] disabled:opacity-50 text-black font-bold py-2.5 rounded-lg transition-colors text-sm"
              >
                {salvando ? 'Criando...' : 'Criar Usuário'}
              </button>
            </form>
          </div>
        </div>

        {/* Exportar */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-green-900/30 rounded-lg flex items-center justify-center">
              <Download size={18} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Exportar Dados</h2>
              <p className="text-gray-400 text-sm">Exportar listas em formato CSV</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => exportarCSV()}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Database size={16} className="text-[#c9a84c]" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Lista Geral de Convidados</p>
                  <p className="text-gray-500 text-xs">Todos os tipos</p>
                </div>
              </div>
              <Download size={14} className="text-gray-500 group-hover:text-[#c9a84c] transition-colors" />
            </button>

            {tipoOptions.map(tipo => (
              <button
                key={tipo}
                onClick={() => exportarCSV(tipo)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-gray-400" />
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{tipo}</p>
                    <p className="text-gray-500 text-xs">Exportar apenas {tipo.toLowerCase()}s</p>
                  </div>
                </div>
                <Download size={14} className="text-gray-500 group-hover:text-[#c9a84c] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Info do sistema */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Sobre o Sistema</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
              <span className="text-gray-400">Sistema</span>
              <span className="text-white">Camarote Prospere 2026</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
              <span className="text-gray-400">Evento</span>
              <span className="text-white">Festa do Peão de Hortolândia</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
              <span className="text-gray-400">Patrocinador</span>
              <span className="text-[#c9a84c] font-semibold">Prospere Consórcio</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
              <span className="text-gray-400">Total de Ingressos</span>
              <span className="text-white">70 (50 Backstage + 10 Imóveis + 10 Futsal)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Instagram</span>
              <span className="text-white">@festadopeao_hortolandia</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
