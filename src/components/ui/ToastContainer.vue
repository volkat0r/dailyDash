<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
const store = useToastStore()
</script>

<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`]"
        @click="store.dismiss(toast.id)"
      >
        <span class="toast-icon">
          {{ toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ' }}
        </span>
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  border: 1px solid transparent;
  max-width: 320px;

  &--error   { background: rgba(248, 113, 113, 0.15); border-color: #f87171; color: #fca5a5; }
  &--success { background: rgba(52, 211, 153, 0.15);  border-color: #34d399; color: #6ee7b7; }
  &--info    { background: rgba(224, 64, 251, 0.12);  border-color: var(--color-pink); color: var(--color-text); }
}

.toast-icon { font-size: 0.75rem; opacity: 0.8; }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from  { opacity: 0; transform: translateX(1rem); }
.toast-leave-to    { opacity: 0; transform: translateX(1rem); }
</style>
