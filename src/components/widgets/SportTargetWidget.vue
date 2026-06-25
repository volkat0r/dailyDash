<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFitnessStore } from '@/stores/fitnessStore'
import GaugeChart from '@/components/ui/GaugeChart.vue'
import type { SportGoals } from '@/stores/fitnessStore'

const props = defineProps<{ sport: 'run' | 'bike' | 'swim' }>()

const store = useFitnessStore()
onMounted(() => store.load())

const target = computed(() => store.targets.find(t => t.sport === props.sport))

const SPORT_ICONS:  Record<string, string> = { run: '🏃', bike: '🚴', swim: '🏊' }
const PERIOD_LABELS: Record<string, string> = { week: 'Woche', month: 'Monat', year: 'Jahr' }

// Einstellungs-Popup
const showSettings = ref(false)
const editGoals = ref<SportGoals>(JSON.parse(JSON.stringify(store.goals)))

function openSettings() {
  editGoals.value = JSON.parse(JSON.stringify(store.goals))
  showSettings.value = true
}

function saveSettings() {
  store.saveGoals(editGoals.value)
  showSettings.value = false
}
</script>

<template>
  <div class="sport-widget">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">
        <span class="sport-icon">{{ SPORT_ICONS[sport] }}</span>
        <strong>{{ target?.label }}</strong>
      </span>
      <div class="header-actions">
        <button class="btn-icon" @click="openSettings" title="Ziele bearbeiten">⚙</button>
        <button class="widget-menu">⋮</button>
      </div>
    </div>

    <!-- Periode-Tabs -->
    <div class="period-tabs">
      <button
        v-for="p in (['week', 'month', 'year'] as const)"
        :key="p"
        :class="['tab', { active: store.period === p }]"
        @click="store.setPeriod(p)"
      >
        {{ PERIOD_LABELS[p] }}
      </button>
    </div>

    <!-- Gauge -->
    <div v-if="store.loading" class="state-msg">…</div>
    <GaugeChart
      v-else-if="target"
      :value="target.current"
      :max="target.goal"
      :unit="target.unit"
    />

    <!-- Einstellungs-Popup -->
    <Teleport to="body">
      <div v-if="showSettings" class="modal-backdrop" @click.self="showSettings = false">
        <div class="modal">
          <div class="modal-header">
            <span>{{ SPORT_ICONS[sport] }} Ziele bearbeiten</span>
            <button @click="showSettings = false">✕</button>
          </div>

          <div class="modal-body">
            <div v-for="p in (['week', 'month', 'year'] as const)" :key="p" class="goal-row">
              <label>{{ PERIOD_LABELS[p] }}</label>
              <div class="goal-input-group">
                <input
                  v-model.number="editGoals[sport][p]"
                  type="number"
                  min="0"
                  step="1"
                  class="goal-input"
                />
                <span class="goal-unit">{{ sport === 'swim' ? 'm' : 'km' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showSettings = false">Abbrechen</button>
            <button class="btn-save" @click="saveSettings">Speichern</button>
          </div>
        </div>
      </div>
    </Teleport>
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

  .header-actions {
    display: flex;
    gap: 0.2rem;
  }

  .btn-icon, .widget-menu {
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    transition: color 0.15s;
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
  &.active { color: var(--color-pink); font-weight: 600; }
}

.state-msg {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.8rem;
  padding: 2rem 0;
}
</style>

<style lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  width: 320px;
  overflow: hidden;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.85rem;
    font-weight: 600;

    button {
      background: none;
      border: none;
      color: var(--color-muted);
      cursor: pointer;
      font-size: 0.9rem;
      &:hover { color: var(--color-text); }
    }
  }

  .modal-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .goal-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    label {
      font-size: 0.78rem;
      color: var(--color-muted);
      min-width: 60px;
    }

    .goal-input-group {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .goal-input {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 0.4rem;
      color: var(--color-text);
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
      width: 100px;
      text-align: right;
      outline: none;
      &:focus { border-color: var(--color-pink); }
    }

    .goal-unit {
      font-size: 0.75rem;
      color: var(--color-muted);
      min-width: 20px;
    }
  }

  .modal-footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--color-border);

    .btn-cancel {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 0.4rem;
      color: var(--color-muted);
      cursor: pointer;
      font-size: 0.78rem;
      padding: 0.4rem 0.875rem;
      &:hover { color: var(--color-text); }
    }

    .btn-save {
      background: linear-gradient(135deg, #e040fb, #7c3aed);
      border: none;
      border-radius: 0.4rem;
      color: #fff;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 500;
      padding: 0.4rem 0.875rem;
      &:hover { opacity: 0.85; }
    }
  }
}
</style>
