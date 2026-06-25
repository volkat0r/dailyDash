import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())

// Health-Check für Railway
app.get('/health', (_req, res) => res.json({ ok: true }))

// Intervals.icu Proxy
app.use('/api/intervals', createProxyMiddleware({
  target: 'https://intervals.icu/api/v1',
  changeOrigin: true,
  pathRewrite: { '^/api/intervals': '' },
  on: {
    proxyReq: (proxyReq) => {
      const token = Buffer.from(`API_KEY:${process.env.INTERVALS_API_KEY}`).toString('base64')
      proxyReq.setHeader('Authorization', `Basic ${token}`)
    },
  },
}))

// Todoist Proxy
app.use('/api/todoist', createProxyMiddleware({
  target: 'https://api.todoist.com/api/v1',
  changeOrigin: true,
  pathRewrite: { '^/api/todoist': '' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.TODOIST_TOKEN}`)
    },
  },
}))

app.listen(PORT, () => console.log(`Proxy läuft auf Port ${PORT}`))
