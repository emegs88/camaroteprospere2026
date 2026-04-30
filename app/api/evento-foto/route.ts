import { NextResponse } from 'next/server'
import { readdirSync, existsSync } from 'fs'
import path from 'path'

const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG']

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'evento')
  if (!existsSync(dir)) return NextResponse.json({ foto: null })
  try {
    const arquivos = readdirSync(dir)
    const imagem = arquivos.find(f => EXTS.includes(path.extname(f)))
    if (imagem) return NextResponse.json({ foto: `/evento/${imagem}` })
  } catch {}
  return NextResponse.json({ foto: null })
}
