import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalendarEvent } from '@/types'
import {
  initGoogleCalendar,
  requestAccess,
  isSignedIn,
  fetchEventsForMonth,
  fetchEventsForDay,
} from '@/services/googleCalendar'

export const useCalendarStore = defineStore('calendar', () => {
  const signedIn    = ref(false)
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  const selectedDate   = ref(new Date())
  const viewYear       = ref(new Date().getFullYear())
  const viewMonth      = ref(new Date().getMonth())

  const monthEvents    = ref<CalendarEvent[]>([])
  const dayEvents      = ref<CalendarEvent[]>([])

  // Tage im aktuellen Monat die Termine haben
  const daysWithEvents = computed(() => {
    const days = new Set<number>()
    monthEvents.value.forEach(e => {
      const d = new Date(e.start)
      if (d.getFullYear() === viewYear.value && d.getMonth() === viewMonth.value)
        days.add(d.getDate())
    })
    return days
  })

  async function init() {
    try {
      await initGoogleCalendar()
      signedIn.value = isSignedIn()
      if (signedIn.value) await loadMonth()
    } catch (e) {
      error.value = 'Google Calendar konnte nicht initialisiert werden.'
    }
  }

  async function signIn() {
    loading.value = true
    error.value = null
    try {
      await requestAccess()
      signedIn.value = true
      await loadMonth()
      await loadDay(selectedDate.value)
    } catch (e) {
      error.value = 'Anmeldung fehlgeschlagen.'
    } finally {
      loading.value = false
    }
  }

  async function loadMonth() {
    try {
      monthEvents.value = await fetchEventsForMonth(viewYear.value, viewMonth.value)
      await loadDay(selectedDate.value)
    } catch (e) {
      error.value = 'Termine konnten nicht geladen werden.'
    }
  }

  async function loadDay(date: Date) {
    selectedDate.value = date
    loading.value = true
    try {
      dayEvents.value = await fetchEventsForDay(date)
    } catch (e) {
      dayEvents.value = []
    } finally {
      loading.value = false
    }
  }

  function prevMonth() {
    if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
    else viewMonth.value--
    if (signedIn.value) loadMonth()
  }

  function nextMonth() {
    if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
    else viewMonth.value++
    if (signedIn.value) loadMonth()
  }

  return {
    signedIn, loading, error,
    selectedDate, viewYear, viewMonth,
    monthEvents, dayEvents, daysWithEvents,
    init, signIn, loadDay, prevMonth, nextMonth,
  }
})
