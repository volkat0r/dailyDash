import axios from 'axios'
import type { Activity, GarminStats } from '@/types'

const ATHLETE_ID = import.meta.env.VITE_INTERVALS_ATHLETE_ID as string
const API_KEY    = import.meta.env.VITE_INTERVALS_API_KEY as string

const client = axios.create({
  baseURL: '/api/intervals',
  auth: { username: 'API_KEY', password: API_KEY },
})

export async function fetchActivities(limit = 10): Promise<Activity[]> {
  const { data } = await client.get(`/athlete/${ATHLETE_ID}/activities`, {
    params: { limit },
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

export async function fetchWeeklySums(): Promise<Record<string, number>> {
  const now   = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + 1)

  const { data } = await client.get(`/athlete/${ATHLETE_ID}/activities`, {
    params: {
      oldest: start.toISOString().split('T')[0],
      limit: 100,
    },
  })

  const sums: Record<string, number> = { run: 0, bike: 0, swim: 0 }
  data.forEach((a: { type: string; distance: number }) => {
    const sport = mapSport(a.type)
    sums[sport] = (sums[sport] ?? 0) + (a.distance ?? 0) / 1000
  })

  return sums
}

function mapSport(type: string): 'run' | 'bike' | 'swim' {
  const t = (type ?? '').toLowerCase()
  if (t.includes('ride') || t.includes('cycling') || t.includes('bike')) return 'bike'
  if (t.includes('swim')) return 'swim'
  return 'run'
}
