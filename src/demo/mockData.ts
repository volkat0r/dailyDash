import type { Activity, CalendarEvent, Task, TaskProject, WeatherCurrent, WeatherDay } from '@/types'

export const DEMO_WEATHER_CURRENT: WeatherCurrent = {
  temperature: 22,
  weathercode: 1,
  windspeed: 14,
  city: 'Köln, NRW',
}

export const DEMO_WEATHER_DAYS: WeatherDay[] = [
  { date: '2026-06-26', tempMax: 24, tempMin: 16, weathercode: 2, precipitation: 10 },
  { date: '2026-06-27', tempMax: 19, tempMin: 14, weathercode: 61, precipitation: 65 },
  { date: '2026-06-28', tempMax: 21, tempMin: 13, weathercode: 3, precipitation: 30 },
  { date: '2026-06-29', tempMax: 26, tempMin: 15, weathercode: 0, precipitation: 5 },
]

export const DEMO_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', start: '2026-06-25T09:00:00', end: '2026-06-25T09:30:00' },
  { id: '2', title: 'Design Review', start: '2026-06-25T14:00:00', end: '2026-06-25T15:00:00' },
  { id: '3', title: 'Laufen – Intervalle', start: '2026-06-26T07:00:00', end: '2026-06-26T08:00:00' },
]

export const DEMO_PROJECTS: TaskProject[] = [
  { id: 'p1', name: 'Portfolio' },
  { id: 'p2', name: 'Privat' },
]

export const DEMO_TASKS: Task[] = [
  { id: 't1', content: 'Portfolio Website überarbeiten', completed: false, projectId: 'p1', projectName: 'Portfolio' },
  { id: 't2', content: 'DailyDash deployen', completed: true,  projectId: 'p1', projectName: 'Portfolio' },
  { id: 't3', content: 'Einkaufen', completed: false, projectId: 'p2', projectName: 'Privat' },
  { id: 't4', content: 'Zahnarzt Termin', completed: false, projectId: 'p2', projectName: 'Privat', due: '2026-06-28' },
]

export const DEMO_ACTIVITIES: Activity[] = [
  { id: 'a1', name: 'Köln Laufen', sport: 'run',  distance: 12.3, duration: 67, date: '2026-06-24T08:44:00', heartrate: 142 },
  { id: 'a2', name: 'Köln Laufen', sport: 'run',  distance: 11.7, duration: 71, date: '2026-06-23T11:22:00', heartrate: 144 },
  { id: 'a3', name: 'Köln – Radtour', sport: 'bike', distance: 42.1, duration: 98, date: '2026-06-21T09:15:00', heartrate: 138 },
  { id: 'a4', name: 'Köln – Schwimmen', sport: 'swim', distance: 2.0, duration: 45, date: '2026-06-20T07:00:00', heartrate: 130 },
  { id: 'a5', name: 'Intervalltraining', sport: 'run', distance: 8.5, duration: 44, date: '2026-06-18T11:27:00', heartrate: 158 },
  { id: 'a6', name: 'Langer Lauf', sport: 'run', distance: 14.1, duration: 80, date: '2026-06-19T09:36:00', heartrate: 145 },
]

export const DEMO_SUMS = {
  run:  34.6,
  bike: 42.1,
  swim: 2.0,
}
