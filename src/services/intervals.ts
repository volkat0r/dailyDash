import type { Activity, GarminStats } from '@/types'
import { createClient } from '@/services/apiClient'

const ATHLETE_ID = import.meta.env.VITE_INTERVALS_ATHLETE_ID as string
const API_KEY    = import.meta.env.VITE_INTERVALS_API_KEY as string

// Im Dev: Auth-Header hier gesetzt (Vite-Proxy leitet weiter)
// In Prod: Railway-Server setzt den Auth-Header serverseitig
const client = createClient('intervals')
if (import.meta.env.DEV) {
  client.defaults.auth = { username: 'API_KEY', password: API_KEY }
}

export async function fetchActivities(): Promise<Activity[]> {
  const oldest = getDateDaysAgo(90)
  const newest = today()

  const { data } = await client.get(`/athlete/${ATHLETE_ID}/activities`, {
    params: { oldest, newest },
  })

  return data.map((a: {
    id: number
    name: string
    type: string
    distance: number
    moving_time: number
    start_date_local: string
    average_heartrate?: number
  }) => ({
    id:        String(a.id),
    name:      a.name,
    sport:     mapSport(a.type),
    distance:  a.distance ? Math.round(a.distance / 10) / 100 : 0,
    duration:  a.moving_time ? Math.round(a.moving_time / 60) : 0,
    date:      a.start_date_local,
    heartrate: a.average_heartrate,
  }))
}

export async function fetchStats(): Promise<GarminStats> {
  const { data } = await client.get(`/athlete/${ATHLETE_ID}`)
  return {
    vo2max: data.fitness?.vo2max ?? null,
  }
}

export async function fetchSumsForPeriod(
  period: 'week' | 'month' | 'year'
): Promise<Record<'run' | 'bike' | 'swim', number>> {
  const oldest = periodStart(period)
  const newest = today()

  const { data } = await client.get(`/athlete/${ATHLETE_ID}/activities`, {
    params: { oldest, newest },
  })

  const sums = { run: 0, bike: 0, swim: 0 }
  data.forEach((a: { type: string; distance: number }) => {
    const sport = mapSport(a.type)
    sums[sport] = Math.round((sums[sport] + (a.distance ?? 0) / 1000) * 100) / 100
  })
  return sums
}

function periodStart(period: 'week' | 'month' | 'year'): string {
  const now = new Date()
  if (period === 'week') {
    const d = new Date(now)
    d.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // Montag
    return d.toISOString().split('T')[0]
  }
  if (period === 'month') {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  }
  return `${now.getFullYear()}-01-01`
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function getDateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function mapSport(type: string): 'run' | 'bike' | 'swim' {
  const t = (type ?? '').toLowerCase()
  if (t.includes('ride') || t.includes('cycling') || t.includes('bike')) return 'bike'
  if (t.includes('swim')) return 'swim'
  return 'run'
}
