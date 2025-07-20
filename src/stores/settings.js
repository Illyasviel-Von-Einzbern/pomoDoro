import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const useSettingsStore = defineStore('settings', () => {
  const alarms = [
    { id: 1, name: '鬧鐘', default: true, file: new URL('@/assets/alarm.mp3', import.meta.url).href },
    { id: 2, name: 'yay', default: true, file: new URL('@/assets/yay.mp3', import.meta.url).href },
  ]

  const selected = ref(1)

  const selectedAlarm = computed(() => {
    const i = alarms.findIndex(alarm => alarm.id === selected.value)
    return alarms[i]
  })

  return {
    alarms,
    selected,
    selectedAlarm,
  }
},
{
  persist: {
    key: 'pomodoro-settings',
    pick: ['selected'],
  },
})
