import axios from 'axios'
import type { WeatherCurrent, WeatherDay } from '@/types'

const LAT = 50.9333
const LON = 6.95
const CITY = 'Köln, NRW'

const BASE = 'https://api.open-meteo.com/v1/forecast'

export const WEATHER_ICONS: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

export const WEATHER_LABELS: Record<number, string> = {
  0: 'Klarer Himmel', 1: 'Überwiegend klar', 2: 'Teils bewölkt', 3: 'Bedeckt',
  45: 'Nebel', 48: 'Raureif',
  51: 'Leichter Nieselregen', 53: 'Nieselregen', 55: 'Starker Nieselregen',
  61: 'Leichter Regen', 63: 'Regen', 65: 'Starker Regen',
  71: 'Leichter Schneefall', 73: 'Schneefall', 75: 'Starker Schneefall',
  80: 'Leichte Schauer', 81: 'Schauer', 82: 'Starke Schauer',
  95: 'Gewitter', 96: 'Gewitter mit Hagel', 99: 'Starkes Gewitter',
}

export async function fetchWeather(): Promise<{ current: WeatherCurrent; days: WeatherDay[] }> {
  const { data } = await axios.get(BASE, {
    params: {
      latitude: LAT,
      longitude: LON,
      current: 'temperature_2m,weathercode,windspeed_10m',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'Europe/Berlin',
      forecast_days: 5,
    },
  })

  const current: WeatherCurrent = {
    temperature: Math.round(data.current.temperature_2m),
    weathercode: data.current.weathercode,
    windspeed: Math.round(data.current.windspeed_10m),
    city: CITY,
  }

  const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
    date,
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    weathercode: data.daily.weathercode[i],
    precipitation: data.daily.precipitation_probability_max[i] ?? 0,
  }))

  return { current, days }
}
