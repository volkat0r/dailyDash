import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeightEntry } from '@/types'

const STORAGE_KEY = 'dailydash_weight'

export const useWeightStore = defineStore('weight', () => {
  const entries = ref<WeightEntry[]>(loadFromStorage())

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

  return { entries, sorted, latest, addEntry, removeEntry }
})

function loadFromStorage(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
