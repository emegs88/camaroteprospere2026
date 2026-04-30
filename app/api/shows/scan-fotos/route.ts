import { NextResponse } from 'next/server'
import { readdirSync, existsSync } from 'fs'
import path from 'path'

const PASTAS: Record<string, string> = {
  '2026-05-08': 'shows/08-05-hugo-guilherme-samuel',
  '2026-05-09': 'shows/09-05-thiaguinho',
  '2026-05-10': 'shows/10-05-edson-hudson-victor-kauan',
  '2026-05-15': 'shows/15-05-diego-victor-hugo-kevi',
  '2026-05-16': 'shows/16-05-ze-neto-cristiano',
  '2026-05-17': 'shows/17-05-os-menotti-paula-mello',
}

const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

export async function GET() {
  const resultado: Record<string, string> = {}

  for (const [data, pasta] of Object.entries(PASTAS)) {
    const dir = path.join(process.cwd(), 'public', pasta)
    if (!existsSync(dir)) continue
    try {
      const arquivos = readdirSync(dir)
      const imagem = arquivos.find(f => EXTS.includes(path.extname(f).toLowerCase()))
      if (imagem) {
        resultado[data] = `/${pasta}/${imagem}`
      }
    } catch {}
  }

  return NextResponse.json(resultado)
}
