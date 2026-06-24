import type { CalendarEvent } from '@/types'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
const API_KEY   = import.meta.env.VITE_GOOGLE_API_KEY as string
const SCOPES    = 'https://www.googleapis.com/auth/calendar.readonly'
const DISCOVERY = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'

let gapiReady = false
let tokenClient: google.accounts.oauth2.TokenClient | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export async function initGoogleCalendar(): Promise<void> {
  if (gapiReady) return

  await Promise.all([
    loadScript('https://apis.google.com/js/api.js'),
    loadScript('https://accounts.google.com/gsi/client'),
  ])

  await new Promise<void>((resolve) => gapi.load('client', resolve))
  await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY] })

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
  })

  gapiReady = true
}

export function requestAccess(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) { reject(new Error('Google nicht initialisiert')); return }
    tokenClient.callback = (resp) => {
      if (resp.error) reject(new Error(resp.error))
      else resolve()
    }
    tokenClient.requestAccessToken({ prompt: 'consent' })
  })
}

export function isSignedIn(): boolean {
  const token = gapi.client.getToken()
  return !!token && !!token.access_token
}

export async function fetchEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
  const start = new Date(year, month, 1)
  const end   = new Date(year, month + 1, 0, 23, 59, 59)

  const resp = await gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  })

  return (resp.result.items ?? []).map((e: gapi.client.calendar.Event) => ({
    id: e.id ?? '',
    title: e.summary ?? '(kein Titel)',
    start: e.start?.dateTime ?? e.start?.date ?? '',
    end:   e.end?.dateTime   ?? e.end?.date   ?? '',
    location: e.location,
    color: e.colorId,
  }))
}

export async function fetchEventsForDay(date: Date): Promise<CalendarEvent[]> {
  const start = new Date(date); start.setHours(0, 0, 0, 0)
  const end   = new Date(date); end.setHours(23, 59, 59, 999)

  const resp = await gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 20,
  })

  return (resp.result.items ?? []).map((e: gapi.client.calendar.Event) => ({
    id: e.id ?? '',
    title: e.summary ?? '(kein Titel)',
    start: e.start?.dateTime ?? e.start?.date ?? '',
    end:   e.end?.dateTime   ?? e.end?.date   ?? '',
    location: e.location,
    color: e.colorId,
  }))
}
