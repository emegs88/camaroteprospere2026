'use client'

import { AppLayout } from '@/components/AppLayout'
import { Download, Database } from 'lucide-react'

export default function ConfiguracoesPage() {
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
          <p className="text-gray-400 mt-1">Exportação de dados e configurações do sistema</p>
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
