import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const pasta = formData.get('pasta') as string | null // ex: 'logos' ou 'shows/09-05-thiaguinho'
    const filename = (formData.get('filename') as string) || file.name

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const subdir = pasta || 'logos'
    const dir = path.join(process.cwd(), 'public', subdir)
    await mkdir(dir, { recursive: true })

    const filePath = path.join(dir, filename)
    await writeFile(filePath, buffer)

    return NextResponse.json({ ok: true, path: `/${subdir}/${filename}` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
