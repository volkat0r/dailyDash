// Weather
export interface WeatherCurrent {
  temperature: number
  weathercode: number
  windspeed: number
  city: string
}

export interface WeatherDay {
  date: string
  tempMax: number
  tempMin: number
  weathercode: number
  precipitation: number
}

// Calendar
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  color?: string
}

// Tasks
export interface Task {
  id: string
  content: string
  completed: boolean
  projectId: string
  projectName: string
  due?: string
}

export interface TaskProject {
  id: string
  name: string
}

// Fitness
export interface SportTarget {
  sport: 'run' | 'bike' | 'swim'
  label: string
  current: number
  goal: number
  unit: string
  period: 'week' | 'month' | 'year'
}

export interface Activity {
  id: string
  name: string
  sport: 'run' | 'bike' | 'swim'
  distance: number
  duration: number
  date: string
  heartrate?: number
}

export interface GarminStats {
  vo2max?: number
  hrv?: number
  bodyBattery?: number
  restingHR?: number
  stress?: number
}

// Weight
export interface WeightEntry {
  date: string
  weight: number
}
