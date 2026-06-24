import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SportTarget } from '@/types'

export const useFitnessStore = defineStore('fitness', () => {
  // Ziele werden später per Strava/Garmin befüllt – vorerst konfigurierbar
  const targets = ref<SportTarget[]>([
    { sport: 'run',  label: 'runTarget',  current: 31,   goal: 42,   unit: 'km', period: 'week' },
    { sport: 'bike', label: 'bikeTarget', current: 20,   goal: 100,  unit: 'km', period: 'week' },
    { sport: 'swim', label: 'swimTarget', current: 2600, goal: 4000, unit: 'm',  period: 'week' },
  ])

  const period = ref<'week' | 'month' | 'year'>('week')

  function setPeriod(p: 'week' | 'month' | 'year') {
    period.value = p
  }

  return { targets, period, setPeriod }
})
