<script setup lang="ts">
import { computed } from 'vue'
import { useFitnessStore } from '@/stores/fitnessStore'
import GaugeChart from '@/components/ui/GaugeChart.vue'
import type { SportTarget } from '@/types'

const props = defineProps<{ sport: SportTarget['sport'] }>()

const store = useFitnessStore()

const target = computed(() =>
  store.targets.find(t => t.sport === props.sport)
)

const SPORT_ICONS: Record<string, string> = {
  run:  '🏃',
  bike: '🚴',
  swim: '🏊',
}

const PERIOD_LABELS: Record<string, string> = {
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
}
</script>

<template>
  <div class="sport-widget" v-if="target">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">
        <span class="sport-icon">{{ SPORT_ICONS[sport] }}</span>
        <strong>{{ target.label }}</strong>
      </span>
      <button class="widget-menu" aria-label="Menü">⋮</button>
    </div>

    <!-- Periode-Tabs -->
    <div class="period-tabs">
      <button
        v-for="p in ['week', 'month', 'year'] as const"
        :key="p"
        :class="['tab', { active: store.period === p }]"
        @click="store.setPeriod(p)"
      >
        {{ PERIOD_LABELS[p] }}
      </button>
    </div>

    <!-- Gauge -->
    <GaugeChart
      :value="target.current"
      :max="target.goal"
      :unit="target.unit"
    />
  </div>
</template>

<style scoped lang="scss">
.sport-widget {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .widget-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--color-muted);

    strong { color: var(--color-text); }
    .sport-icon { font-size: 1rem; }
  }

  .widget-menu {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0 0.25rem;
    &:hover { color: var(--color-text); }
  }
}

.period-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.tab {
  background: none;
  border: none;
  font-size: 0.7rem;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  transition: color 0.15s;

  &:hover { color: var(--color-text); }

  &.active {
    color: var(--color-pink);
    font-weight: 600;
  }
}
</style>
