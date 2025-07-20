import { defineStore } from 'pinia'
import { ref } from 'vue'

const time = Number.parseInt(import.meta.env.VITE_TIME)
const timeBreak = Number.parseInt(import.meta.env.VITE_TIME_BREAK)

export const useListStore = defineStore(
  'list',
  () => {
    // const items = reactive([])
    const items = ref([])
    // 未完成事項

    // const finishedItems = reactive([])
    const finishedItems = ref([])
    // 完成事項
    // pinia 本地儲存不能用 reactive，用 ref 後面要補 .value

    const currentItem = ref('')
    // 目前進行事項

    // let id = 1
    const id = ref(1)
    // id
    // pinia 本地儲存需要設定成 ref ，不然id會重複

    const timeLeft = ref(time)
    // 倒數剩餘時間

    const isBreak = ref(false)
    // 判斷是不是休息時間

    const addItem = value => {
      items.value.push({
        id: id.value++,
        text: value,
        edit: false,
        model: value,
      })
    }
    // 新增事件

    const editItem = id => {
      const i = items.value.findIndex(item => item.id === id)
      items.value[i].edit = true
    }
    // 編輯事項

    const confirmEdit = id => {
      const i = items.value.findIndex(item => item.id === id)
      items.value[i].text = items.value[i].model
      items.value[i].edit = false
    }
    // 確認編輯

    const cancelEdit = id => {
      const i = items.value.findIndex(item => item.id === id)
      items.value[i].model = items.value[i].text
      items.value[i].edit = false
    }
    // 取消編輯

    const delItem = id => {
      const i = items.value.findIndex(item => item.id === id)
      items.value.splice(i, 1)
    }
    // 刪除事項

    const delFinishItem = id => {
      const i = finishedItems.value.findIndex(item => item.id === id)
      finishedItems.value.splice(i, 1)
    }
    // 刪除完成事項

    const setCurrentItem = () => {
      currentItem.value = isBreak.value ? '休息時間' : items.value.shift().text
    }
    // 移除並取得陣列的第一個東西

    const countDown = () => {
      timeLeft.value--
    }
    // 倒數

    const setFinishItem = () => {
      if (!isBreak.value) {
        finishedItems.value.push({
          id: id.value++,
          text: currentItem.value,
        })
      }
      currentItem.value = ''

      if (items.value.length > 0) {
        isBreak.value = !isBreak.value
      }
      timeLeft.value = isBreak.value ? timeBreak : time
    }
    // 完成事項

    return {
      items,
      finishedItems,
      currentItem,
      timeLeft,
      id,
      addItem,
      editItem,
      confirmEdit,
      cancelEdit,
      delItem,
      delFinishItem,
      setCurrentItem,
      countDown,
      setFinishItem,
    }
  },
  {
    persist: {
      key: 'pomodoro-list',
    },
  },
)
