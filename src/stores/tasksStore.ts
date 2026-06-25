import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { fetchTasks, closeTask, reopenTask, createTask, deleteTask, fetchProjects } from '@/services/todoist'
import type { TaskProject } from '@/types'
import { useToastStore } from '@/stores/toastStore'

export const useTasksStore = defineStore('tasks', () => {
  const tasks    = ref<Task[]>([])
  const allProjects = ref<TaskProject[]>([])
  const loading  = ref(false)
  const adding   = ref(false)
  const error    = ref<string | null>(null)

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
      const [fetched, projects] = await Promise.all([fetchTasks(), fetchProjects()])
      tasks.value = fetched
      allProjects.value = projects
    } catch {
      const toast = useToastStore()
      error.value = 'Aufgaben konnten nicht geladen werden.'
      toast.error('Todoist: Aufgaben konnten nicht geladen werden.')
    } finally {
      loading.value = false
    }
  }

  async function addTask(content: string, projectId?: string) {
    const toast = useToastStore()
    adding.value = true
    try {
      const task = await createTask(content, projectId)
      tasks.value.unshift(task)
      toast.success('Aufgabe erstellt.')
    } catch {
      toast.error('Aufgabe konnte nicht erstellt werden.')
    } finally {
      adding.value = false
    }
  }

  async function removeTask(id: string) {
    const toast = useToastStore()
    const prev = [...tasks.value]
    tasks.value = tasks.value.filter(t => t.id !== id)
    try {
      await deleteTask(id)
    } catch {
      tasks.value = prev
      toast.error('Aufgabe konnte nicht gelöscht werden.')
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

  return { tasks, allProjects, loading, adding, error, projects, tasksByProject, load, toggleTask, addTask, removeTask }
})
