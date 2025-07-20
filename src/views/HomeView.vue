<!-- <template>
  <h1>Home</h1>
  <DigitNumber color="white" data="0" />
  <DigitNumber color="white" data="1" />
  <DigitNumber color="white" data="2" />
  <DigitNumber color="white" data="3" />
  <DigitNumber color="white" data="4" />
  <DigitNumber color="white" data="5" />
  <DigitNumber color="white" data="6" />
  <DigitNumber color="white" data="7" />
  <DigitNumber color="white" data="8" />
  <DigitNumber color="white" data="9" />
  <DigitNumber color="white" data=":" />
</template> -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>目前事項</h1>
        <h2>{{ list.currentItem }}</h2>
        <h2>{{ list.timeleft }}</h2>
        <h2>{{ timeLeftText }}</h2>
        <DigitNumber v-for="(data,i) in timeLeftText" :key="i" color="white" :data="data" />
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="status === STATUS.COUNTING ||
            (list.currentItem.length === 0 && list.items.length === 0)"
          icon="mdi-play"
          @click="startTimer"
        />
        <!-- 開始按鈕停用條件：倒數中 或 目前沒有事項、沒有未完成事項 -->
        <v-btn
          :disabled="status !== STATUS.COUNTING"
          icon="mdi-pause"
          @click="puase"
        />
        <!-- 只有倒數中才可以按暫停 -->
        <v-btn
          :disabled="list.currentItem.length === 0"
          icon="mdi-skip-next"
          @click="finish"
        />
        <!-- 目前有事項才可以按跳過 -->
        <img src="../assets/35659fac70d11a86332bb58202bf2c4a.gif">
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useWebNotification } from '@vueuse/core'
  import { computed, ref } from 'vue'
  import DigitNumber from '@/components/DigitNumber.vue'
  import { useListStore } from '@/stores/list'
  import { useSettingsStore } from '@/stores/settings'

  const list = useListStore()
  const settings = useSettingsStore()

  const STATUS = {
    STOP: 0,
    COUNTING: 1,
    PUASE: 2,
  }
  const status = ref(STATUS.STOP)
  // 倒數狀態(0：停止、1：進行、2：暫停)

  let timer = 0
  // 計時器
  const startTimer = () => {
    if (status.value === STATUS.STOP && list.items.length > 0) {
      list.setCurrentItem()
    }

    status.value = STATUS.COUNTING
    // 狀態變成倒數中

    timer = setInterval(() => {
      list.countDown()

      if (list.timeLeft <= 0) {
        finish(timer)
      }
    }, 1000)
    // 開始倒數
  }
  // 計時器開始倒數(繼續目前暫停的 或 停止目前之後開始)

  const puase = () => {
    clearInterval(timer)
    status.value = STATUS.PAUSE
  }

  const finish = () => {
    clearInterval(timer)

    status.value = STATUS.STOP

    const audio = new Audio()
    audio.src = settings.selectedAlarm.file
    audio.play()

    const { show, isSupported } = useWebNotification({
      title: '事項完成',
      body: list.currentItem,
      icon: new URL('@/assets/tomato.png', import.meta.url).href,
    })

    if (isSupported.value) {
      show()
    }

    list.setFinishItem()

    if (list.items.length > 0) {
      startTimer()
    }
  }

  const timeLeftText = computed(() => {
    const m = Math.floor(list.timeLeft / 60)
      .toString()
      .padStart(2, '0')
    const s = (list.timeLeft % 60)
      .toString()
      .padStart(2, '0')
    return m + '：' + s
  })
</script>

<style scope>
h1,h2{
  color: rgb(252, 0, 252)
}
</style>
