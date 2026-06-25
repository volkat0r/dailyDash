<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('dailydash_theme')
  isDark.value = saved !== 'light'
  applyTheme()
})

function toggle() {
  isDark.value = !isDark.value
  localStorage.setItem('dailydash_theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  const root = document.documentElement
  if (isDark.value) {
    root.style.setProperty('--color-bg',     '#0f1117')
    root.style.setProperty('--color-surface','#1a1d2e')
    root.style.setProperty('--color-card',   '#1e2235')
    root.style.setProperty('--color-border', '#2a2f47')
    root.style.setProperty('--color-text',   '#e2e8f0')
    root.style.setProperty('--color-muted',  '#8892b0')
  } else {
    root.style.setProperty('--color-bg',     '#f0f2f8')
    root.style.setProperty('--color-surface','#ffffff')
    root.style.setProperty('--color-card',   '#ffffff')
    root.style.setProperty('--color-border', '#e2e6f0')
    root.style.setProperty('--color-text',   '#1a1d2e')
    root.style.setProperty('--color-muted',  '#6b7280')
  }
}
</script>

<template>
  <button class="theme-toggle" @click="toggle" :title="isDark ? 'Light Mode' : 'Dark Mode'">
    {{ isDark ? '☀' : '🌙' }}
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s, border-color 0.15s;
  &:hover { color: var(--color-text); border-color: var(--color-text); }
}
</style>
