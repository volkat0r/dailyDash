<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'

const store = useTasksStore()
onMounted(() => store.load())
</script>

<template>
  <div class="tasks-widget">
    <!-- Header -->
    <div class="widget-header">
      <span class="widget-label">daily<strong>Tasks</strong></span>
      <div class="header-actions">
        <button class="btn-reload" @click="store.load()" :disabled="store.loading" aria-label="Neu laden">
          ↻
        </button>
        <button class="widget-menu" aria-label="Menü">⋮</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="state-msg">Lade Aufgaben…</div>

    <!-- Error -->
    <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>

    <!-- Leer -->
    <div v-else-if="store.tasks.length === 0" class="state-msg">
      Keine offenen Aufgaben 🎉
    </div>

    <!-- Tasks gruppiert nach Projekt -->
    <template v-else>
      <div class="projects-grid">
        <div
          v-for="project in store.projects"
          :key="project"
          class="project-column"
        >
          <!-- Projekt-Header -->
          <div class="project-header">
            <span class="project-dot" />
            <span class="project-name">{{ project }}</span>
            <span class="project-count">
              {{ store.tasksByProject.get(project)?.filter(t => !t.completed).length }}
            </span>
          </div>

          <!-- Task-Liste -->
          <ul class="task-list">
            <li
              v-for="task in store.tasksByProject.get(project)"
              :key="task.id"
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <button
                class="task-checkbox"
                :class="{ checked: task.completed }"
                @click="store.toggleTask(task.id)"
                :aria-label="task.completed ? 'Aufgabe öffnen' : 'Aufgabe erledigen'"
              >
                <span v-if="task.completed">✓</span>
              </button>
              <span class="task-content">{{ task.content }}</span>
              <span v-if="task.due" class="task-due">{{ task.due }}</span>
            </li>
          </ul>

          <!-- Mehr Aufgaben -->
          <button
            v-if="(store.tasksByProject.get(project)?.length ?? 0) > 5"
            class="btn-more"
          >
            + Mehr anzeigen
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.tasks-widget {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    align-items: center;
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

.state-msg {
  font-size: 0.8rem;
  color: var(--color-muted);
  text-align: center;
  padding: 1rem 0;

  &.error { color: #f87171; }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.project-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;

  .project-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--gradient);
    flex-shrink: 0;
  }

  .project-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    flex: 1;
  }

  .project-count {
    font-size: 0.65rem;
    color: var(--color-muted);
    background: var(--color-border);
    border-radius: 999px;
    padding: 0.1rem 0.4rem;
  }
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.4rem;
  transition: background 0.15s;

  &:hover { background: var(--color-border); }

  &.completed .task-content {
    text-decoration: line-through;
    color: var(--color-muted);
  }
}

.task-checkbox {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 50%;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  color: var(--color-pink);
  transition: border-color 0.15s, background 0.15s;
  margin-top: 1px;

  &:hover { border-color: var(--color-pink); }

  &.checked {
    background: linear-gradient(135deg, #e040fb, #7c3aed);
    border-color: transparent;
    color: #fff;
  }
}

.task-content {
  font-size: 0.78rem;
  color: var(--color-text);
  line-height: 1.4;
  flex: 1;
}

.task-due {
  font-size: 0.65rem;
  color: var(--color-muted);
  flex-shrink: 0;
}

.btn-more {
  background: none;
  border: none;
  color: var(--color-pink);
  font-size: 0.72rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  text-align: left;

  &:hover { text-decoration: underline; }
}
</style>
