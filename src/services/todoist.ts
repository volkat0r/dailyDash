import axios from 'axios'
import type { Task, TaskProject } from '@/types'

const TOKEN = import.meta.env.VITE_TODOIST_TOKEN as string
const BASE   = '/api/todoist'

const client = axios.create({
  baseURL: BASE,
  headers: { Authorization: `Bearer ${TOKEN}` },
})

export async function fetchProjects(): Promise<TaskProject[]> {
  const { data } = await client.get('/projects')
  return data.map((p: { id: string; name: string }) => ({
    id: p.id,
    name: p.name,
  }))
}

export async function fetchTasks(): Promise<Task[]> {
  const [{ data: tasks }, projects] = await Promise.all([
    client.get('/tasks'),
    fetchProjects(),
  ])

  const projectMap = new Map(projects.map(p => [p.id, p.name]))

  return tasks.map((t: {
    id: string
    content: string
    is_completed: boolean
    project_id: string
    due?: { date: string }
  }) => ({
    id: t.id,
    content: t.content,
    completed: t.is_completed,
    projectId: t.project_id,
    projectName: projectMap.get(t.project_id) ?? 'Eingang',
    due: t.due?.date,
  }))
}

export async function closeTask(id: string): Promise<void> {
  await client.post(`/tasks/${id}/close`)
}

export async function reopenTask(id: string): Promise<void> {
  await client.post(`/tasks/${id}/reopen`)
}
