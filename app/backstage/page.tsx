'use client'

import { AppLayout } from '@/components/AppLayout'
import { GridIngressos } from '@/components/GridIngressos'

export default function BackstagePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Prospere Backstage</h1>
          <p className="text-gray-400 mt-1">50 ingressos individuais · Camarote exclusivo</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-white">50</p>
            <p className="text-gray-400 text-sm mt-1">Total de Ingressos</p>
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
        <GridIngressos categoria="BACKSTAGE" titulo="Prospere Consórcio Backstage — 50 ingressos" total={50} />
      </div>
    </AppLayout>
  )
}
