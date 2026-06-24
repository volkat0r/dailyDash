<script setup lang="ts">
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const now = new Date()
const currentDate = `${now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} | KW${getWeekNumber(now)}`
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <header class="dashboard-header">
      <h1>daily<span>Dash</span></h1>
      <p>{{ currentDate }}</p>
    </header>

    <!-- Dashboard Grid -->
    <main class="dashboard-grid">
      <!-- Zeile 1: Sport-Ziele (Platzhalter) -->
      <div class="placeholder">runTarget</div>
      <div class="placeholder">bikeTarget</div>
      <div class="placeholder">swimTarget</div>

      <!-- Zeile 2 links: Meetings + Weather -->
      <div class="left-column">
        <div class="placeholder tall">DailyMeetings</div>
        <WeatherWidget />
      </div>

      <!-- Zeile 2 mitte: Tasks + Weight -->
      <div class="center-column">
        <div class="placeholder">dailyTasks</div>
        <div class="placeholder">dailyWeight</div>
      </div>

      <!-- Zeile 2 rechts: lastActivities -->
      <div class="right-column">
        <div class="placeholder tall">lastActivities</div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.dashboard-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.15em;

    span { font-weight: 700; }
  }

  p {
    font-size: 0.8rem;
    color: var(--color-muted);
    margin-top: 0.25rem;
    letter-spacing: 0.05em;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.left-column,
.center-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.placeholder {
  background: var(--color-card);
  border: 1px dashed var(--color-border);
  border-radius: 0.875rem;
  padding: 1.5rem;
  color: var(--color-muted);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;

  &.tall { min-height: 280px; }
}
</style>
