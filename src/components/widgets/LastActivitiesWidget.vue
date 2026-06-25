<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivitiesStore } from '@/stores/activitiesStore'
import type { Activity } from '@/types'

const store = useActivitiesStore()
onMounted(() => store.load())

const showAll = ref(false)

const SPORT_ICONS: Record<string, string> = {
  run: '🏃', bike: '🚴', swim: '🏊',
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getMondayOfWeek(d: Date): Date {
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return monday
}

// Aktivitäten nach KW gruppieren
const groupedByWeek = computed(() => {
  const sorted = [...store.activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const groups: Array<{ kw: number; year: number; label: string; activities: Activity[] }> = []
  const seen = new Map<string, number>()

  sorted.forEach(activity => {
    const d   = new Date(activity.date)
    const kw  = getWeekNumber(d)
    const yr  = d.getFullYear()
    const key = `${yr}-${kw}`

    if (!seen.has(key)) {
      const monday = getMondayOfWeek(d)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)

      const fmt = (x: Date) => x.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
      seen.set(key, groups.length)
      groups.push({
        kw,
        year: yr,
        label: `KW ${kw} · ${fmt(monday)} – ${fmt(sunday)}`,
        activities: [],
      })
    }

    groups[seen.get(key)!].activities.push(activity)
  })

  return groups
})

// Default: nur die letzten 2 KW
const visibleGroups = computed(() =>
  showAll.value ? groupedByWeek.value : groupedByWeek.value.slice(0, 2)
)

const hasMore = computed(() => groupedByWeek.value.length > 2)

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function formatDistance(sport: string, km: number): string {
  if (sport === 'swim') return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

// Wochensumme pro Sportart
function weekSums(activities: Activity[]): string {
  const sums: Record<string, number> = { run: 0, bike: 0, swim: 0 }
  activities.forEach(a => {
    sums[a.sport] = (sums[a.sport] ?? 0) + a.distance
  })
  return (['run', 'bike', 'swim'] as const)
    .filter(s => sums[s] > 0)
    .map(s => `${SPORT_ICONS[s]} ${formatDistance(s, sums[s])}`)
    .join('  ')
}
</script>

<template>
  <div class="activities-widget">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">last<strong>Activities</strong></span>
      <div class="header-actions">
        <button class="btn-reload" @click="store.load()" :disabled="store.loading" aria-label="Neu laden">↻</button>
        <button class="widget-menu" aria-label="Menü">⋮</button>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="store.stats.vo2max" class="stats-row">
      <div class="stat-chip">
        <span class="stat-label">VO2max</span>
        <span class="stat-value">{{ store.stats.vo2max }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="state-msg">Lade Aktivitäten…</div>

    <!-- Error -->
    <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>

    <!-- Leer -->
    <div v-else-if="store.activities.length === 0" class="state-msg">
      Keine Aktivitäten gefunden
    </div>

    <!-- Aktivitäten gruppiert nach KW -->
    <template v-else>
      <div
        v-for="group in visibleGroups"
        :key="`${group.year}-${group.kw}`"
        class="week-group"
      >
        <!-- KW-Header -->
        <div class="week-header">
          <span class="week-label">{{ group.label }}</span>
          <span class="week-sums">{{ weekSums(group.activities) }}</span>
        </div>

        <!-- Aktivitäten der Woche -->
        <ul class="activity-list">
          <li
            v-for="activity in group.activities"
            :key="activity.id"
            class="activity-item"
          >
            <span class="activity-icon">{{ SPORT_ICONS[activity.sport] ?? '🏅' }}</span>
            <div class="activity-content">
              <span class="activity-name">{{ activity.name }}</span>
              <span class="activity-meta">
                {{ formatDate(activity.date) }} · {{ formatTime(activity.date) }}
                · {{ formatDistance(activity.sport, activity.distance) }}
                · {{ formatDuration(activity.duration) }}
                <span v-if="activity.heartrate"> · ❤️ {{ activity.heartrate }} bpm</span>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Mehr anzeigen -->
      <button
        v-if="hasMore"
        class="btn-more"
        @click="showAll = !showAll"
      >
        {{ showAll ? '↑ Weniger anzeigen' : `··· Weitere ${groupedByWeek.length - 2} Wochen anzeigen` }}
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.activities-widget {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 0;
  overflow-y: auto;
  flex: 1;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .widget-label {
    font-size: 0.75rem;
    color: var(--color-muted);
    letter-spacing: 0.05em;
    strong { color: var(--color-text); }
  }

  .header-actions { display: flex; gap: 0.25rem; }

  .btn-reload, .widget-menu {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    transition: color 0.15s;
    &:hover { color: var(--color-text); }
    &:disabled { opacity: 0.4; cursor: default; }
  }
}

.stats-row {
  display: flex;
  gap: 0.5rem;
}

.stat-chip {
  background: var(--color-border);
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  display: flex;
  gap: 0.4rem;
  align-items: center;

  .stat-label { font-size: 0.65rem; color: var(--color-muted); }
  .stat-value {
    font-size: 0.85rem;
    font-weight: 600;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.state-msg {
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
  padding: 1rem 0;
  &.error { color: #f87171; }
}

.week-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.5rem;
  background: var(--color-border);
  border-radius: 0.4rem;

  .week-label {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--color-muted);
    letter-spacing: 0.04em;
  }

  .week-sums {
    font-size: 0.65rem;
    color: var(--color-muted);
  }
}

.activity-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.4rem;
  transition: background 0.15s;
  &:hover { background: var(--color-border); }
}

.activity-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.activity-name {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-meta { font-size: 0.65rem; color: var(--color-muted); }

.btn-more {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.72rem;
  padding: 0.4rem;
  text-align: center;
  transition: color 0.15s, border-color 0.15s;
  &:hover { color: var(--color-pink); border-color: var(--color-pink); }
}
</style>
