import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const useSettingsStore = defineStore('settings', () => {
  const alarms = [
    { id: 1, name: '鬧鐘', default: true, file: new URL('@/assets/alarm.mp3', import.meta.url).href },
    { id: 2, name: 'yay', default: true, file: new URL('@/assets/yay.mp3', import.meta.url).href },
    { id: 3, name: '《doroの小曲》', default: true, file: new URL('@/assets/《doroの小曲》.mp3', import.meta.url).href },
    { id: 4, name: '零幀起手', default: true, file: new URL('@/assets/零幀起手.mp3', import.meta.url).href },
    { id: 5, name: '你只有五秒鐘', default: true, file: new URL('@/assets/你只有五秒鐘.mp3', import.meta.url).href },
    { id: 6, name: 'Harry Potter DJ Remix', default: true, file: new URL('@/assets/Harry Potter DJ Remix.mp3', import.meta.url).href },
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
