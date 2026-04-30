'use client'

import { AppLayout } from '@/components/AppLayout'
import { GridIngressos } from '@/components/GridIngressos'

export default function ImoveisPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Prospere Imóveis</h1>
          <p className="text-gray-400 mt-1">10 camarotes corporativos</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-white">10</p>
            <p className="text-gray-400 text-sm mt-1">Total de Camarotes</p>
          </div>
          <div className="bg-[#1e1e1e] border border-[#c9a84c]/30 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-[#c9a84c]">—</p>
            <p className="text-gray-400 text-sm mt-1">Reservados</p>
          </div>
          <div className="bg-[#1e1e1e] border border-[#2d6a4f]/30 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-green-400">—</p>
            <p className="text-gray-400 text-sm mt-1">Utilizados</p>
          </div>
        </div>
        <GridIngressos categoria="IMOVEIS" titulo="Prospere Imóveis — 10 camarotes corporativos" total={10} />
      </div>
    </AppLayout>
  )
}
