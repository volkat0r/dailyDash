import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'error' | 'success' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

let _id = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function show(message: string, type: ToastType = 'info', durationMs = 4000) {
    const id = ++_id
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), durationMs)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const error   = (msg: string) => show(msg, 'error', 5000)
  const success = (msg: string) => show(msg, 'success')
  const info    = (msg: string) => show(msg, 'info')

  return { toasts, dismiss, error, success, info }
})
