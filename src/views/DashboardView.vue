<script setup lang="ts">
// Widgets werden hier schrittweise eingebunden
</script>

<template>
  <div class="dashboard-wrapper p-6">
    <!-- Header -->
    <header class="dashboard-header text-center mb-8">
      <h1 class="text-3xl font-light tracking-widest">
        daily<span class="font-bold">Dash</span>
      </h1>
      <p class="text-dash-muted text-sm mt-1">{{ currentDate }}</p>
    </header>

    <!-- Grid wird Schritt für Schritt befüllt -->
    <div class="dashboard-grid">
      <div class="col-span-3 flex items-center justify-center rounded-xl bg-dash-card border border-dash-border p-8 text-dash-muted">
        Setup erfolgreich – Widgets folgen...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    currentDate(): string {
      const now = new Date()
      const kw = getWeekNumber(now)
      return `${now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} | KW${kw}`
    },
  },
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
</script>

<style scoped lang="scss">
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
</style>
