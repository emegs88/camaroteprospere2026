import { NextResponse } from 'next/server'

// Coordenadas de Hortolândia - SP
const LAT = -22.8566
const LON = -47.2206

// Datas dos shows
const DATAS_SHOWS = [
  '2026-05-08',
  '2026-05-09',
  '2026-05-10',
  '2026-05-15',
  '2026-05-16',
  '2026-05-17',
]

function descricaoTempo(codigo: number): string {
  if (codigo === 0) return 'Céu limpo'
  if (codigo <= 2) return 'Parcialmente nublado'
  if (codigo === 3) return 'Nublado'
  if (codigo <= 49) return 'Neblina'
  if (codigo <= 57) return 'Garoa'
  if (codigo <= 67) return 'Chuva'
  if (codigo <= 77) return 'Neve'
  if (codigo <= 82) return 'Pancadas de chuva'
  if (codigo <= 86) return 'Chuva com neve'
  if (codigo <= 99) return 'Tempestade'
  return 'Desconhecido'
}

function iconeClima(codigo: number): string {
  if (codigo === 0) return '☀️'
  if (codigo <= 2) return '⛅'
  if (codigo === 3) return '☁️'
  if (codigo <= 49) return '🌫️'
  if (codigo <= 57) return '🌦️'
  if (codigo <= 67) return '🌧️'
  if (codigo <= 77) return '❄️'
  if (codigo <= 82) return '🌧️'
  if (codigo <= 99) return '⛈️'
  return '🌡️'
}

export async function GET() {
  try {
    const dataInicio = DATAS_SHOWS[0]
    const dataFim = DATAS_SHOWS[DATAS_SHOWS.length - 1]

    const url =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${LAT}&longitude=${LON}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max` +
      `&timezone=America%2FSao_Paulo` +
      `&start_date=${dataInicio}&end_date=${dataFim}`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Erro ao buscar previsão')

    const data = await res.json()
    const { daily } = data

    const previsoes: Record<string, any> = {}

    for (let i = 0; i < daily.time.length; i++) {
      const data_str: string = daily.time[i]
      if (!DATAS_SHOWS.includes(data_str)) continue

      const codigo: number = daily.weathercode[i]
      previsoes[data_str] = {
        data: data_str,
        codigo,
        icone: iconeClima(codigo),
        descricao: descricaoTempo(codigo),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        chuva: Math.round(daily.precipitation_sum[i] * 10) / 10,
        vento: Math.round(daily.windspeed_10m_max[i]),
      }
    }

    return NextResponse.json(previsoes, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar previsão do tempo', detail: error?.message }, { status: 500 })
  }
}
