<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const props = defineProps<{
  value: number      // aktueller Wert
  max: number        // Zielwert
  unit: string
  color?: string
}>()

const percentage = computed(() => Math.min(Math.round((props.value / props.max) * 100), 100))

const chartOptions = computed((): ApexOptions => ({
  chart: {
    type: 'radialBar',
    sparkline: { enabled: true },
    background: 'transparent',
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '68%',
      },
      track: {
        background: '#2a2f47',
        strokeWidth: '100%',
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: 8,
          fontSize: '2rem',
          fontWeight: '300',
          color: '#e2e8f0',
          formatter: () => `${percentage.value}%`,
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      colorStops: [
        { offset: 0, color: '#e040fb', opacity: 1 },
        { offset: 100, color: '#7c3aed', opacity: 1 },
      ],
    },
  },
  stroke: { lineCap: 'round' },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } },
  },
}))
</script>

<template>
  <div class="gauge-wrapper">
    <VueApexCharts
      type="radialBar"
      height="130"
      :options="chartOptions"
      :series="[percentage]"
    />
    <p class="gauge-sub">{{ value }}{{ unit }} / {{ max }}{{ unit }}</p>
  </div>
</template>

<style scoped lang="scss">
.gauge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-sub {
  font-size: 0.72rem;
  color: var(--color-muted);
  margin-top: -0.5rem;
  letter-spacing: 0.03em;
}
</style>
