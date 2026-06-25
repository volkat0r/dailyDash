<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import DashboardView from '@/views/DashboardView.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useWeatherStore }     from '@/stores/weatherStore'
import { useTasksStore }       from '@/stores/tasksStore'
import { useActivitiesStore }  from '@/stores/activitiesStore'
import { useFitnessStore }     from '@/stores/fitnessStore'

const weather    = useWeatherStore()
const tasks      = useTasksStore()
const activities = useActivitiesStore()
const fitness    = useFitnessStore()

const INTERVAL_MS = 5 * 60 * 1000

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    weather.load()
    tasks.load()
    activities.load()
    fitness.load()
  }, INTERVAL_MS)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <DashboardView />
  <ToastContainer />
</template>
