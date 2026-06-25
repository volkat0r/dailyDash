<script setup lang="ts">
import { onMounted } from 'vue'
import { useActivitiesStore } from '@/stores/activitiesStore'

const store = useActivitiesStore()
onMounted(() => store.load())

const SPORT_ICONS: Record<string, string> = {
  run:  '🏃',
  bike: '🚴',
  swim: '🏊',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' · '
    + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
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

    <!-- Garmin Stats -->
    <div v-if="store.stats.vo2max || store.stats.hrv || store.stats.bodyBattery" class="stats-row">
      <div v-if="store.stats.vo2max" class="stat-chip">
        <span class="stat-label">VO2max</span>
        <span class="stat-value">{{ store.stats.vo2max }}</span>
      </div>
      <div v-if="store.stats.hrv" class="stat-chip">
        <span class="stat-label">HRV</span>
        <span class="stat-value">{{ store.stats.hrv }}</span>
      </div>
      <div v-if="store.stats.bodyBattery" class="stat-chip">
        <span class="stat-label">Body Battery</span>
        <span class="stat-value">{{ store.stats.bodyBattery }}</span>
      </div>
      <div v-if="store.stats.restingHR" class="stat-chip">
        <span class="stat-label">Ruhe-HF</span>
        <span class="stat-value">{{ store.stats.restingHR }} bpm</span>
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

    <!-- Aktivitätenliste -->
    <ul v-else class="activity-list">
      <li
        v-for="activity in store.activities"
        :key="activity.id"
        class="activity-item"
      >
        <span class="activity-icon">{{ SPORT_ICONS[activity.sport] ?? '🏅' }}</span>
        <div class="activity-content">
          <span class="activity-name">{{ activity.name }}</span>
          <span class="activity-meta">
            {{ formatDate(activity.date) }}
            · {{ formatDistance(activity.sport, activity.distance) }}
            · {{ formatDuration(activity.duration) }}
            <span v-if="activity.heartrate"> · ❤️ {{ activity.heartrate }} bpm</span>
          </span>
        </div>
      </li>
    </ul>
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

  .header-actions {
    display: flex;
    gap: 0.25rem;
  }

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
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stat-chip {
  background: var(--color-border);
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 70px;

  .stat-label {
    font-size: 0.6rem;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 0.9rem;
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
  line-height: 1.5;

  &.error { color: #f87171; }
}

.activity-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  transition: background 0.15s;

  &:hover { background: var(--color-border); }
}

.activity-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.activity-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-meta {
  font-size: 0.68rem;
  color: var(--color-muted);
}
</style>
