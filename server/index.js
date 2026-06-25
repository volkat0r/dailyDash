import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { GarminConnect } from 'garmin-connect'

const app  = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

let garminClient = null
let lastLogin    = null
const SESSION_TTL = 55 * 60 * 1000 // 55 Minuten

async function getClient() {
  if (garminClient && lastLogin && Date.now() - lastLogin < SESSION_TTL) {
    return garminClient
  }

  const client = new GarminConnect({
    username: process.env.VITE_GARMIN_EMAIL,
    password: process.env.VITE_GARMIN_PASSWORD,
  })

  await client.login(process.env.VITE_GARMIN_EMAIL, process.env.VITE_GARMIN_PASSWORD)
  garminClient = client
  lastLogin    = Date.now()

  return client
}

// Letzte Aktivitäten
app.get('/api/garmin/activities', async (req, res) => {
  try {
    const client     = await getClient()
    const limit      = parseInt(req.query.limit) || 10
    const activities = await client.getActivities(0, limit)

    const mapped = activities.map(a => ({
      id:          a.activityId,
      name:        a.activityName,
      sport:       mapSport(a.activityType?.typeKey),
      distance:    a.distance ? Math.round(a.distance / 10) / 100 : 0,
      duration:    a.duration ? Math.round(a.duration / 60) : 0,
      date:        a.startTimeLocal,
      heartrate:   a.averageHR,
    }))

    res.json(mapped)
  } catch (err) {
    console.error('Garmin activities error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Garmin Gesundheitsdaten (VO2max, HRV, Body Battery)
app.get('/api/garmin/stats', async (req, res) => {
  try {
    const client = await getClient()
    const today  = new Date().toISOString().split('T')[0]

    const [userStats, hrv] = await Promise.allSettled([
      client.getUserStats(today),
      client.getHrvData(today),
    ])

    res.json({
      vo2max:      userStats.value?.userInfo?.vo2Max ?? null,
      bodyBattery: userStats.value?.bodyBatteryChargedValue ?? null,
      restingHR:   userStats.value?.restingHeartRate ?? null,
      hrv:         hrv.value?.hrvSummary?.lastNight ?? null,
    })
  } catch (err) {
    console.error('Garmin stats error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Gewichtsdaten
app.get('/api/garmin/weight', async (req, res) => {
  try {
    const client    = await getClient()
    const startDate = req.query.from ?? getDateDaysAgo(90)
    const endDate   = req.query.to   ?? new Date().toISOString().split('T')[0]

    const data = await client.getWeightData(startDate, endDate)

    const entries = (data?.dateWeightList ?? []).map(e => ({
      date:   e.calendarDate,
      weight: e.weight ? e.weight / 1000 : null,
    })).filter(e => e.weight !== null)

    res.json(entries)
  } catch (err) {
    console.error('Garmin weight error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

function mapSport(typeKey) {
  if (!typeKey) return 'run'
  if (typeKey.includes('cycling') || typeKey.includes('bike')) return 'bike'
  if (typeKey.includes('swim')) return 'swim'
  return 'run'
}

function getDateDaysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

app.listen(PORT, () => {
  console.log(`Garmin Server läuft auf http://localhost:${PORT}`)
})
