<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'

const store = useCalendarStore()

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS   = ['Januar','Februar','März','April','Mai','Juni',
                  'Juli','August','September','Oktober','November','Dezember']

const today = new Date()

// Alle Tage-Zellen des aktuellen Monats inkl. Auffüll-Tage
const calendarDays = computed(() => {
  const year  = store.viewYear
  const month = store.viewMonth

  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)

  // Montag = 0, Sonntag = 6
  const startOffset = (firstDay.getDay() + 6) % 7

  const days: Array<{ date: Date | null; day: number | null }> = []

  // Leere Zellen vor dem 1.
  for (let i = 0; i < startOffset; i++) days.push({ date: null, day: null })

  // Tage des Monats
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), day: d })
  }

  return days
})

function isToday(date: Date | null) {
  if (!date) return false
  return date.toDateString() === today.toDateString()
}

function isSelected(date: Date | null) {
  if (!date) return false
  return date.toDateString() === store.selectedDate.toDateString()
}

function hasEvent(date: Date | null) {
  if (!date) return false
  return store.daysWithEvents.has(date.getDate())
}

function selectDay(date: Date | null) {
  if (!date || !store.signedIn) return
  store.loadDay(date)
}
</script>

<template>
  <div class="mini-calendar">
    <!-- Navigation -->
    <div class="cal-nav">
      <button @click="store.prevMonth()" aria-label="Vorheriger Monat">‹</button>
      <span class="cal-title">{{ MONTHS[store.viewMonth] }} {{ store.viewYear }}</span>
      <button @click="store.nextMonth()" aria-label="Nächster Monat">›</button>
    </div>

    <!-- Wochentage -->
    <div class="cal-grid">
      <div v-for="d in WEEKDAYS" :key="d" class="cal-weekday">{{ d }}</div>

      <!-- Tage -->
      <button
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="cal-day"
        :class="{
          empty:    !cell.date,
          today:    isToday(cell.date),
          selected: isSelected(cell.date),
          'has-event': hasEvent(cell.date),
        }"
        :disabled="!cell.date"
        @click="selectDay(cell.date)"
      >
        <span v-if="cell.day">{{ cell.day }}</span>
        <span v-if="hasEvent(cell.date)" class="event-dot" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mini-calendar {
  user-select: none;
}

.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  button {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem;
    line-height: 1;
    transition: color 0.15s;
    &:hover { color: var(--color-text); }
  }

  .cal-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text);
  }
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-weekday {
  font-size: 0.65rem;
  color: var(--color-muted);
  text-align: center;
  padding: 0.25rem 0;
  font-weight: 500;
}

.cal-day {
  position: relative;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.75rem;
  text-align: center;
  padding: 0.3rem 0;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: background 0.15s;
  line-height: 1.4;

  &:hover:not(:disabled) {
    background: var(--color-border);
  }

  &.empty { visibility: hidden; pointer-events: none; }

  &.today > span:first-child {
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  &.selected {
    background: linear-gradient(135deg, #e040fb33, #7c3aed33);
    border: 1px solid #e040fb66;
  }

  .event-dot {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-pink);
  }
}
</style>
