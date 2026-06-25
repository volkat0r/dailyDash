import axios from 'axios'

// Im Dev-Modus: Vite-Proxy (/api/...) — in Production: Railway-URL
const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export function createClient(prefix: 'intervals' | 'todoist') {
  return axios.create({ baseURL: `${BASE}/api/${prefix}` })
}
