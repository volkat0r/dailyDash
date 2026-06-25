import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeightEntry } from '@/types'

const STORAGE_KEY  = 'dailydash_weight'
const GOAL_KEY     = 'dailydash_weight_goal'

export const useWeightStore = defineStore('weight', () => {
  const entries    = ref<WeightEntry[]>(loadFromStorage())
  const goalWeight = ref<number | null>(
    localStorage.getItem(GOAL_KEY) ? Number(localStorage.getItem(GOAL_KEY)) : null
  )

  function setGoal(kg: number | null) {
    goalWeight.value = kg
    if (kg === null) localStorage.removeItem(GOAL_KEY)
    else localStorage.setItem(GOAL_KEY, String(kg))
  }

  const sorted = computed(() =>
    [...entries.value].sort((a, b) => a.date.localeCompare(b.date))
  )

  const latest = computed(() => sorted.value.at(-1) ?? null)

  function addEntry(weight: number, date?: string) {
    const d = date ?? new Date().toISOString().split('T')[0]
    const existing = entries.value.findIndex(e => e.date === d)

    if (existing >= 0) entries.value[existing].weight = weight
    else entries.value.push({ date: d, weight })

    save()
  }

  function removeEntry(date: string) {
    entries.value = entries.value.filter(e => e.date !== date)
    save()
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  return { entries, sorted, latest, goalWeight, addEntry, removeEntry, setGoal }
})

function loadFromStorage(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
