<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import MiniCalendar from '@/components/ui/MiniCalendar.vue'

const store = useCalendarStore()
onMounted(() => store.init())

function formatTime(iso: string): string {
  if (!iso.includes('T')) return 'Ganztägig'
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function formatSelectedDate(): string {
  return store.selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long',
  })
}

// Farben für Kalender-Einträge (Google Calendar colorId 1–11)
const EVENT_COLORS: Record<string, string> = {
  '1': '#7986CB', '2': '#33B679', '3': '#8E24AA', '4': '#E67C73',
  '5': '#F6BF26', '6': '#F4511E', '7': '#039BE5', '8': '#616161',
  '9': '#3F51B5', '10': '#0B8043', '11': '#D50000',
}
function eventColor(colorId?: string): string {
  return colorId ? (EVENT_COLORS[colorId] ?? '#e040fb') : '#e040fb'
}
</script>

<template>
  <div class="meetings-widget">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">Daily<strong>Meetings</strong></span>
      <button class="widget-menu" aria-label="Menü">⋮</button>
    </div>

    <!-- Mini-Kalender -->
    <MiniCalendar />

    <!-- Trennlinie + Tages-Label -->
    <div class="day-header">
      <span class="day-label">{{ formatSelectedDate() }}</span>
      <span v-if="store.loading" class="loading-dot">…</span>
    </div>

    <!-- Nicht angemeldet -->
    <div v-if="!store.signedIn" class="auth-prompt">
      <p>Google Calendar verbinden</p>
      <button class="btn-connect" @click="store.signIn()">
        🔗 Anmelden
      </button>
      <p v-if="store.error" class="error-text">{{ store.error }}</p>
    </div>

    <!-- Termine des gewählten Tages -->
    <template v-else>
      <div v-if="store.dayEvents.length === 0 && !store.loading" class="no-events">
        Keine Termine
      </div>

      <ul class="event-list">
        <li v-for="event in store.dayEvents" :key="event.id" class="event-item">
          <span
            class="event-bar"
            :style="{ background: eventColor(event.color) }"
          />
          <div class="event-content">
            <span class="event-time">
              {{ formatTime(event.start) }}
              <template v-if="!event.start.includes('T') === false">
                – {{ formatTime(event.end) }}
              </template>
            </span>
            <span class="event-title">{{ event.title }}</span>
            <span v-if="event.location" class="event-location">📍 {{ event.location }}</span>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped lang="scss">
.meetings-widget {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow-y: auto;
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
    padding: 0 0.25rem;
    &:hover { color: var(--color-text); }
  }
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;

  .day-label {
    font-size: 0.75rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .loading-dot {
    font-size: 0.75rem;
    color: var(--color-pink);
  }
}

.auth-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;

  p { font-size: 0.8rem; color: var(--color-muted); }

  .btn-connect {
    background: linear-gradient(135deg, #e040fb, #7c3aed);
    border: none;
    border-radius: 0.5rem;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    transition: opacity 0.15s;
    &:hover { opacity: 0.85; }
  }

  .error-text { color: #f87171; font-size: 0.72rem; }
}

.no-events {
  font-size: 0.78rem;
  color: var(--color-muted);
  text-align: center;
  padding: 0.5rem 0;
}

.event-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-item {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;

  .event-bar {
    width: 3px;
    min-height: 100%;
    border-radius: 2px;
    flex-shrink: 0;
    margin-top: 2px;
    align-self: stretch;
  }

  .event-content {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .event-time {
    font-size: 0.68rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .event-title {
    font-size: 0.8rem;
    color: var(--color-text);
    font-weight: 500;
  }

  .event-location {
    font-size: 0.68rem;
    color: var(--color-muted);
  }
}
</style>
