<script setup lang="ts">
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'
import SportTargetWidget from '@/components/widgets/SportTargetWidget.vue'
import MeetingsWidget from '@/components/widgets/MeetingsWidget.vue'
import TasksWidget from '@/components/widgets/TasksWidget.vue'
import LastActivitiesWidget from '@/components/widgets/LastActivitiesWidget.vue'
import WeightWidget from '@/components/widgets/WeightWidget.vue'

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

    <main class="dashboard-grid">
      <!-- Zeile 1: Sport-Ziele -->
      <SportTargetWidget sport="run" />
      <SportTargetWidget sport="bike" />
      <SportTargetWidget sport="swim" />

      <!-- Zeile 2 links: Meetings + Weather -->
      <div class="left-column">
        <MeetingsWidget />
        <WeatherWidget />
      </div>

      <!-- Zeile 2 mitte: Tasks + Weight -->
      <div class="center-column">
        <TasksWidget />
        <WeightWidget />
      </div>

      <!-- Zeile 2 rechts: lastActivities -->
      <div class="right-column">
        <LastActivitiesWidget />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.dashboard-wrapper {
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;

  h1 {
    font-size: 2.5rem;
    font-weight: 300;
    letter-spacing: 0;
    line-height: 1;

    span { font-weight: 700; }
  }

  p {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--color-muted);
    margin-top: 0.5rem;
    letter-spacing: 0.08em;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.left-column,
.center-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
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
