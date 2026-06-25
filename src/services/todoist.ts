import type { Task, TaskProject } from '@/types'
import { createClient } from '@/services/apiClient'

const TOKEN = import.meta.env.VITE_TODOIST_TOKEN as string

// Im Dev: Token hier gesetzt — in Prod: Railway setzt ihn serverseitig
const client = createClient('todoist')
if (import.meta.env.DEV) {
  client.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
}

export async function fetchProjects(): Promise<TaskProject[]> {
  try {
    const { data } = await client.get('/projects')
    const list = data.results ?? data
    return list.map((p: { id: string; name: string }) => ({
      id: p.id,
      name: p.name,
    }))
  } catch {
    return []
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const [{ data: tasksData }, projects] = await Promise.all([
    client.get('/tasks'),
    fetchProjects(),
  ])

  const projectMap = new Map(projects.map(p => [p.id, p.name]))
  const tasks = tasksData.results ?? tasksData

  return tasks.map((t: {
    id: string
    content: string
    is_completed: boolean
    project_id: string
    due?: { date: string }
  }) => ({
    id: t.id,
    content: t.content,
    completed: t.is_completed ?? false,
    projectId: t.project_id,
    projectName: projectMap.get(t.project_id) ?? 'Eingang',
    due: t.due?.date,
  }))
}

export async function createTask(content: string, projectId?: string): Promise<Task> {
  const body: Record<string, string> = { content }
  if (projectId) body.project_id = projectId

  const { data: t } = await client.post('/tasks', body)
  const projects = await fetchProjects()
  const projectMap = new Map(projects.map(p => [p.id, p.name]))

  return {
    id: t.id,
    content: t.content,
    completed: false,
    projectId: t.project_id,
    projectName: projectMap.get(t.project_id) ?? 'Eingang',
    due: t.due?.date,
  }
}

export async function closeTask(id: string): Promise<void> {
  await client.post(`/tasks/${id}/close`)
}

export async function reopenTask(id: string): Promise<void> {
  await client.post(`/tasks/${id}/reopen`)
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/tasks/${id}`)
}
