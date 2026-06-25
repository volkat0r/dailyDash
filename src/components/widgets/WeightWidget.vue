<script setup lang="ts">
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useWeightStore } from '@/stores/weightStore'
import type { ApexOptions } from 'apexcharts'

const store = useWeightStore()

const newWeight = ref<number | null>(null)
const newDate   = ref(new Date().toISOString().split('T')[0])
const showInput = ref(false)

function submit() {
  if (!newWeight.value || newWeight.value < 30 || newWeight.value > 300) return
  store.addEntry(newWeight.value, newDate.value)
  newWeight.value = null
  showInput.value = false
}

const chartSeries = computed(() => [{
  name: 'Gewicht',
  data: store.sorted.map(e => ({ x: e.date, y: e.weight })),
}])

const chartOptions = computed((): ApexOptions => ({
  chart: {
    type: 'line',
    background: 'transparent',
    toolbar: { show: false },
    sparkline: { enabled: false },
    animations: { enabled: true },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#e040fb'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      colorStops: [
        { offset: 0,   color: '#e040fb', opacity: 0.3 },
        { offset: 100, color: '#7c3aed', opacity: 0 },
      ],
    },
  },
  markers: {
    size: 3,
    colors: ['#e040fb'],
    strokeColors: '#1e2235',
    strokeWidth: 2,
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: { colors: '#8892b0', fontSize: '0.65rem' },
      datetimeFormatter: { month: 'MMM yy', day: 'dd.MM.' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#8892b0', fontSize: '0.65rem' },
      formatter: (v) => `${v} kg`,
    },
    tickAmount: 4,
  },
  grid: {
    borderColor: '#2a2f47',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    theme: 'dark',
    x: { format: 'dd.MM.yyyy' },
    y: { formatter: (v) => `${v} kg` },
  },
  dataLabels: { enabled: false },
}))

const minWeight = computed(() => {
  if (!store.sorted.length) return 0
  return Math.floor(Math.min(...store.sorted.map(e => e.weight)) - 2)
})

const maxWeight = computed(() => {
  if (!store.sorted.length) return 100
  return Math.ceil(Math.max(...store.sorted.map(e => e.weight)) + 2)
})
</script>

<template>
  <div class="weight-widget">
    <!-- Header -->
    <div class="widget-header">
      <div class="header-left">
        <span class="widget-label">daily<strong>Weight</strong></span>
        <span v-if="store.latest" class="latest-value">
          {{ store.latest.weight }} kg
        </span>
      </div>
      <div class="header-actions">
        <button
          class="btn-add"
          @click="showInput = !showInput"
          :title="showInput ? 'Abbrechen' : 'Gewicht eintragen'"
        >
          {{ showInput ? '✕' : '+' }}
        </button>
        <button class="widget-menu" aria-label="Menü">⋮</button>
      </div>
    </div>

    <!-- Eingabe -->
    <form v-if="showInput" class="weight-form" @submit.prevent="submit">
      <input
        v-model="newDate"
        type="date"
        class="input-field"
        required
      />
      <input
        v-model.number="newWeight"
        type="number"
        step="0.1"
        min="30"
        max="300"
        placeholder="kg"
        class="input-field weight-input"
        required
      />
      <button type="submit" class="btn-save">Speichern</button>
    </form>

    <!-- Leer -->
    <div v-if="store.sorted.length === 0" class="state-msg">
      <p>Noch keine Einträge.</p>
      <p>Klicke auf <strong>+</strong> um dein erstes Gewicht einzutragen.</p>
    </div>

    <!-- Chart -->
    <div v-else class="chart-wrapper">
      <VueApexCharts
        type="area"
        height="200"
        :options="{ ...chartOptions, yaxis: { ...chartOptions.yaxis, min: minWeight, max: maxWeight } }"
        :series="chartSeries"
      />
    </div>

    <!-- Letzte Einträge -->
    <div v-if="store.sorted.length > 0" class="recent-entries">
      <div
        v-for="entry in [...store.sorted].reverse().slice(0, 5)"
        :key="entry.date"
        class="entry-row"
      >
        <span class="entry-date">{{ new Date(entry.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) }}</span>
        <span class="entry-weight">{{ entry.weight }} kg</span>
        <button class="btn-delete" @click="store.removeEntry(entry.date)" aria-label="Löschen">✕</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weight-widget {
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

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .widget-label {
    font-size: 0.75rem;
    color: var(--color-muted);
    letter-spacing: 0.05em;
    strong { color: var(--color-text); }
  }

  .latest-value {
    font-size: 1rem;
    font-weight: 600;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-actions {
    display: flex;
    gap: 0.25rem;
  }

  .btn-add, .widget-menu {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
    transition: color 0.15s;
    &:hover { color: var(--color-text); }
  }

  .btn-add { font-size: 1.3rem; line-height: 1; }
}

.weight-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-field {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  color: var(--color-text);
  font-size: 0.78rem;
  padding: 0.4rem 0.6rem;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: var(--color-pink); }
  &.weight-input { width: 80px; }
}

.btn-save {
  background: linear-gradient(135deg, #e040fb, #7c3aed);
  border: none;
  border-radius: 0.4rem;
  color: #fff;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  transition: opacity 0.15s;
  white-space: nowrap;
  &:hover { opacity: 0.85; }
}

.state-msg {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.78rem;
  padding: 1rem 0;
  line-height: 1.6;

  strong { color: var(--color-text); }
}

.chart-wrapper {
  margin: 0 -0.5rem;
}

.recent-entries {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.entry-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  transition: background 0.15s;

  &:hover { background: var(--color-border); }

  .entry-date { color: var(--color-muted); flex: 1; }
  .entry-weight { font-weight: 500; }

  .btn-delete {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 0.6rem;
    padding: 0.1rem 0.2rem;
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
    &:hover { color: #f87171; }
  }

  &:hover .btn-delete { opacity: 1; }
}
</style>
