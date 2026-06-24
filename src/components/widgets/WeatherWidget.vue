<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { WEATHER_ICONS, WEATHER_LABELS } from '@/services/openMeteo'

const store = useWeatherStore()
onMounted(() => store.load())

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <div class="weather-widget">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">Daily<strong>Weather</strong></span>
      <button class="widget-menu" aria-label="Menü">⋮</button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center h-40 text-dash-muted text-sm">
      Lade Wetterdaten…
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="flex items-center justify-center h-40 text-red-400 text-sm">
      {{ store.error }}
    </div>

    <template v-else-if="store.current">
      <!-- Aktuelles Wetter -->
      <div class="current-weather">
        <div class="current-meta">
          <span class="location-icon">📍</span>
          <span class="city">{{ store.current.city.toUpperCase() }}</span>
        </div>
        <div class="current-main">
          <span class="current-icon">{{ WEATHER_ICONS[store.current.weathercode] ?? '🌡️' }}</span>
          <span class="current-temp">{{ store.current.temperature }}°</span>
        </div>
        <div class="current-desc">
          {{ WEATHER_LABELS[store.current.weathercode] ?? '' }}
          <span class="wind">💨 {{ store.current.windspeed }} km/h</span>
        </div>
      </div>

      <!-- Trennlinie -->
      <div class="divider" />

      <!-- 4-Tage-Vorschau (Tage 1–4, heute überspringen) -->
      <div class="forecast-row">
        <div
          v-for="day in store.days.slice(1, 5)"
          :key="day.date"
          class="forecast-day"
        >
          <span class="forecast-label">{{ formatDate(day.date) }}</span>
          <span class="forecast-icon">{{ WEATHER_ICONS[day.weathercode] ?? '🌡️' }}</span>
          <span class="forecast-temp">{{ day.tempMax }}°</span>
          <span class="forecast-rain">💧 {{ day.precipitation }}%</span>
        </div>
      </div>

      <!-- Trennlinie -->
      <div class="divider" />

      <!-- Vorschau nächste Tage (Listenansicht) -->
      <div class="forecast-list">
        <div
          v-for="day in store.days.slice(1, 4)"
          :key="'list-' + day.date"
          class="forecast-list-item"
        >
          <span class="fl-date">{{ formatDate(day.date) }}</span>
          <span class="fl-icon">{{ WEATHER_ICONS[day.weathercode] ?? '🌡️' }}</span>
          <span class="fl-rain">💧 {{ day.precipitation }}%</span>
          <span class="fl-temp">{{ day.tempMin }}° / {{ day.tempMax }}°</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
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

  .widget-menu {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    padding: 0 0.25rem;

    &:hover { color: var(--color-text); }
  }
}

.current-weather {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.current-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;

  .city { font-weight: 600; color: var(--color-text); }
}

.current-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .current-icon { font-size: 2.5rem; line-height: 1; }
  .current-temp { font-size: 2.75rem; font-weight: 300; line-height: 1; }
}

.current-desc {
  font-size: 0.75rem;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .wind { color: var(--color-muted); }
}

.divider {
  height: 1px;
  background: var(--color-border);
}

.forecast-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;

  .forecast-label { font-size: 0.65rem; color: var(--color-muted); text-align: center; }
  .forecast-icon  { font-size: 1.4rem; line-height: 1; }
  .forecast-temp  { font-size: 0.85rem; font-weight: 500; }
  .forecast-rain  { font-size: 0.65rem; color: var(--color-muted); }
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.forecast-list-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;

  .fl-date { color: var(--color-muted); }
  .fl-icon { font-size: 1rem; }
  .fl-rain { color: var(--color-muted); font-size: 0.7rem; }
  .fl-temp { color: var(--color-text); font-weight: 500; text-align: right; }
}
</style>
