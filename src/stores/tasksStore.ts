import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { fetchTasks, closeTask, reopenTask } from '@/services/todoist'

export const useTasksStore = defineStore('tasks', () => {
  const tasks   = ref<Task[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // Alle Projekt-Namen die aktuell in den Tasks vorkommen
  const projects = computed(() => {
    const names = new Set(tasks.value.map(t => t.projectName))
    return Array.from(names)
  })

  // Tasks gruppiert nach Projekt
  const tasksByProject = computed(() => {
    const map = new Map<string, Task[]>()
    tasks.value.forEach(t => {
      if (!map.has(t.projectName)) map.set(t.projectName, [])
      map.get(t.projectName)!.push(t)
    })
    return map
  })

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await fetchTasks()
    } catch {
      error.value = 'Aufgaben konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  async function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    // Optimistisch im UI aktualisieren
    task.completed = !task.completed

    try {
      if (task.completed) await closeTask(id)
      else await reopenTask(id)
    } catch {
      // Bei Fehler zurücksetzen
      task.completed = !task.completed
    }
  }

  return { tasks, loading, error, projects, tasksByProject, load, toggleTask }
})
