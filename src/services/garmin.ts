import axios from 'axios'
import type { Activity, GarminStats, WeightEntry } from '@/types'

const client = axios.create({ baseURL: '/api/garmin' })

export async function fetchActivities(limit = 10): Promise<Activity[]> {
  const { data } = await client.get('/activities', { params: { limit } })
  return data
}

export async function fetchStats(): Promise<GarminStats> {
  const { data } = await client.get('/stats')
  return data
}

export async function fetchWeight(from?: string, to?: string): Promise<WeightEntry[]> {
  const { data } = await client.get('/weight', { params: { from, to } })
  return data
}
