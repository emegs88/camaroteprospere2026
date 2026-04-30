type Tipo = 'INFLUENCER' | 'CLIENTE' | 'PARCEIRO' | 'VIP' | 'COLABORADOR' | 'IMPRENSA'

const config: Record<Tipo, { label: string; className: string }> = {
  INFLUENCER: { label: 'Influencer', className: 'bg-purple-900 text-purple-200 border border-purple-700' },
  CLIENTE: { label: 'Cliente', className: 'bg-yellow-900 text-yellow-200 border border-yellow-700' },
  PARCEIRO: { label: 'Parceiro', className: 'bg-green-900 text-green-200 border border-green-700' },
  VIP: { label: 'VIP', className: 'bg-red-900 text-red-200 border border-red-700' },
  COLABORADOR: { label: 'Colaborador', className: 'bg-blue-900 text-blue-200 border border-blue-700' },
  IMPRENSA: { label: 'Imprensa', className: 'bg-gray-700 text-gray-200 border border-gray-600' },
}

export function BadgeTipo({ tipo }: { tipo: string }) {
  const c = config[tipo as Tipo] ?? { label: tipo, className: 'bg-gray-700 text-gray-200' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${c.className}`}>
      {c.label}
    </span>
  )
}
