'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard, Users, Music, Settings, LogOut, Star, Building2, Trophy, UserCheck,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pessoas', label: 'Pessoas', icon: Users },
  { href: '/shows', label: 'Shows', icon: Music },
  { href: '/acesso', label: 'Convidar Cliente', icon: UserCheck },
]

const ingressoItems = [
  { href: '/backstage', label: 'Backstage', sub: '50 ingressos', icon: Star, color: '#c9a84c' },
  { href: '/imoveis', label: 'Imóveis', sub: '10 camarotes', icon: Building2, color: '#2d6a4f' },
  { href: '/futsal', label: 'Futsal', sub: '10 camarotes', icon: Trophy, color: '#3b82f6' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0e0e0e] border-r border-[#1a1a1a] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 pt-5 pb-3 border-b border-[#1a1a1a]">
        <Image
          src="/logos/logo-prospere.png"
          alt="Prospere Consórcios"
          width={160}
          height={80}
          className="w-[140px] h-auto object-contain"
          priority
        />
        <div className="mt-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Camarote · Peão 2026</span>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-5">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold px-2 mb-1.5">Geral</p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#c9a84c] text-black'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Ingressos */}
        <div>
          <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold px-2 mb-1.5">Ingressos</p>
          <div className="space-y-0.5">
            {ingressoItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive ? 'bg-[#1a1a1a] text-white' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}20` }}>
                    <Icon size={13} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={isActive ? 'text-white' : ''}>{item.label}</div>
                    <div className="text-[10px] text-gray-700">{item.sub}</div>
                  </div>
                  {isActive && <div className="w-1 h-1 rounded-full bg-[#c9a84c]" />}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1a1a1a] space-y-0.5">
        <Link href="/configuracoes"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === '/configuracoes'
              ? 'bg-[#c9a84c] text-black'
              : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Settings size={16} />
          Configurações
        </Link>

        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] font-bold text-xs flex-shrink-0">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{session.user.name}</p>
              <p className="text-gray-700 text-[10px] truncate">{session.user.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-700 hover:text-red-400 transition-colors p-1">
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
