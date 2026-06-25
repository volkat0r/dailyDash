import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchWeather } from '@/services/openMeteo'
import type { WeatherCurrent, WeatherDay } from '@/types'
import { DEMO_WEATHER_CURRENT, DEMO_WEATHER_DAYS } from '@/demo/mockData'

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export const useWeatherStore = defineStore('weather', () => {
  const current = ref<WeatherCurrent | null>(null)
  const days = ref<WeatherDay[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)

  async function load() {
    if (IS_DEMO) {
      current.value = DEMO_WEATHER_CURRENT
      days.value    = DEMO_WEATHER_DAYS
      return
    }
    // Nicht öfter als alle 30 Minuten neu laden
    if (lastFetched.value && Date.now() - lastFetched.value.getTime() < 30 * 60 * 1000) return

    loading.value = true
    error.value = null
    try {
      const data = await fetchWeather()
      current.value = data.current
      days.value = data.days
      lastFetched.value = new Date()
    } catch (e) {
      error.value = 'Wetterdaten konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  return { current, days, loading, error, load }
})
