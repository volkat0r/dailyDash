import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchSumsForPeriod } from '@/services/intervals'

const GOALS_KEY = 'dailydash_sport_goals'

export interface SportGoals {
  run:  { week: number; month: number; year: number }
  bike: { week: number; month: number; year: number }
  swim: { week: number; month: number; year: number }
}

const DEFAULT_GOALS: SportGoals = {
  run:  { week: 30,   month: 120,  year: 1500 },
  bike: { week: 100,  month: 400,  year: 5000 },
  swim: { week: 4000, month: 16000, year: 200000 },
}

function loadGoals(): SportGoals {
  try {
    const raw = localStorage.getItem(GOALS_KEY)
    return raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : DEFAULT_GOALS
  } catch {
    return DEFAULT_GOALS
  }
}

export const useFitnessStore = defineStore('fitness', () => {
  const goals  = ref<SportGoals>(loadGoals())
  const period = ref<'week' | 'month' | 'year'>('week')
  const sums   = ref<Record<'run' | 'bike' | 'swim', number>>({ run: 0, bike: 0, swim: 0 })
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // Einheit pro Sportart (Schwimmen in Meter, rest in km)
  const UNITS: Record<string, string> = { run: 'km', bike: 'km', swim: 'm' }

  const targets = computed(() => (['run', 'bike', 'swim'] as const).map(sport => ({
    sport,
    label:   sport + 'Target',
    current: sport === 'swim' ? Math.round(sums.value[sport] * 1000) : sums.value[sport],
    goal:    goals.value[sport][period.value],
    unit:    UNITS[sport],
    period:  period.value,
  })))

  async function load() {
    loading.value = true
    error.value   = null
    try {
      sums.value = await fetchSumsForPeriod(period.value)
    } catch {
      error.value = 'Konnte Summen nicht laden.'
    } finally {
      loading.value = false
    }
  }

  function setPeriod(p: 'week' | 'month' | 'year') {
    period.value = p
    load()
  }

  function saveGoals(updated: SportGoals) {
    goals.value = updated
    localStorage.setItem(GOALS_KEY, JSON.stringify(updated))
  }

  return { goals, period, sums, targets, loading, error, load, setPeriod, saveGoals }
})
