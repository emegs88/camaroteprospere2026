'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@prospere.com.br')
  const [password, setPassword] = useState('prospere2026')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fotoEvento, setFotoEvento] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/evento-foto')
      .then(r => r.json())
      .then(d => setFotoEvento(d.foto ?? null))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Email ou senha inválidos.')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* ── Lado esquerdo: card do evento ── */}
      {fotoEvento && (
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0a0a0a] items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoEvento}
            alt="Festa do Peão de Hortolândia 2026"
            className="h-full w-auto object-contain"
          />
          {/* Gradiente direito para fundir com o formulário */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
        </div>
      )}

      {/* ── Lado direito: formulário ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-14 bg-[#0a0a0a]">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/logos/logo-prospere.png"
              alt="Prospere Consórcios"
              width={160}
              height={80}
              priority
              className="h-14 w-auto object-contain"
            />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[#2a2a2a]" />
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold">Camarote · Peão 2026</span>
              <div className="h-px flex-1 bg-[#2a2a2a]" />
            </div>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-white text-2xl font-bold">Bem-vindo</h1>
            <p className="text-gray-500 text-sm mt-1">Acesse o painel administrativo</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 font-medium uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] text-white placeholder-gray-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#c9a84c] transition-colors text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-2 font-medium uppercase tracking-wide">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] text-white placeholder-gray-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#c9a84c] transition-colors text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/60 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8973e] active:bg-[#a8863a] disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-colors text-sm tracking-widest uppercase mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Credenciais padrão */}
          <div className="mt-8 p-4 bg-[#141414] border border-[#222] rounded-xl">
            <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest mb-2">Credenciais padrão</p>
            <p className="text-gray-500 text-xs font-mono">admin@prospere.com.br</p>
            <p className="text-gray-500 text-xs font-mono">prospere2026</p>
          </div>

          <p className="text-center text-gray-700 text-[10px] mt-8 uppercase tracking-widest">
            © 2026 Prospere Consórcio
          </p>
        </div>
      </div>

    </div>
  )
}
