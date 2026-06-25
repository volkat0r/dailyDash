import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity, GarminStats } from '@/types'
import { fetchActivities, fetchStats } from '@/services/intervals'

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])
  const stats      = ref<GarminStats>({})
  const loading    = ref(false)
  const error      = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const [acts, st] = await Promise.all([fetchActivities(8), fetchStats()])
      activities.value = acts
      stats.value      = st
    } catch {
      error.value = 'Intervals.icu Daten konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  return { activities, stats, loading, error, load }
})
