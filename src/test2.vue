<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">鈴聲設定</h1>
      </v-col>

      <!-- 鈴聲清單 -->
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
              <th>刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in settings.alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <audio controls :src="alarm.file" />
              </td>
              <td>
                <v-radio-group v-model="settings.selected" hide-details>
                  <v-radio :value="alarm.id" />
                </v-radio-group>
              </td>
              <td>
                <!-- 僅顯示刪除按鈕在自定義鈴聲上（避免刪除預設） -->
                <button
                  v-if="isCustomAlarm(alarm)"
                  title="刪除"
                  @click="deleteAlarm(alarm)"
                > <v-btn
                  icon="mdi-delete"
                  @click="addAlarms"
                />
                </button>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <!-- 上傳 -->
      <v-col cols="12">
        <label class="upload-btn">
          ＋
          <input
            accept=".mp3, .mp4"
            hidden
            multiple
            type="file"
            @change="handleFileUpload"
          >
        </label>
        <p v-if="error" style="color: red;">{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { openDB } from 'idb'
  import { onMounted, ref } from 'vue'
  import { useSettingsStore } from '@/stores/settings'

  const settings = useSettingsStore()
  const error = ref('')
  const db = ref(null)

  const initDB = async () => {
    // 初始化 IndexedDB
    db.value = await openDB('AlarmDB', 1, {
      upgrade (db) {
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media')
        }
      },
    })
  }

  const loadFilesFromDB = async () => {
    // 載入檔案並轉成可播放的 URL
    const tx = db.value.transaction('media', 'readonly')
    const store = tx.objectStore('media')
    const allKeys = await store.getAllKeys()

    const alarms = []
    for (const key of allKeys) {
      const file = await store.get(key)
      const url = URL.createObjectURL(file)
      alarms.push({
        id: file.name,
        name: file.name,
        file: url,
      })
    }

    const existingIds = new Set(settings.alarms.map(a => a.id))
    // 避免重複加入相同的 ID
    for (const alarm of alarms) {
      if (!existingIds.has(alarm.id)) {
        settings.alarms.push(alarm)
      }
    }
  }

  const handleFileUpload = async event => {
    // 上傳並儲存
    const uploadedFiles = Array.from(event.target.files)
    const validFiles = uploadedFiles.filter(file =>
      file.type === 'audio/mpeg' || file.type === 'video/mp4',
    )

    if (validFiles.length === 0) {
      error.value = '只能上傳 mp3 或 mp4 檔案。'
      return
    }

    const tx = db.value.transaction('media', 'readwrite')
    const store = tx.objectStore('media')
    const allKeys = await store.getAllKeys()
    // eslint-disable-next-line
    for (let file of validFiles) {
      let fileName = file.name
      if (allKeys.includes(fileName)) {
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const base = file.name.replace(/\.[^/.]+$/, '')
        fileName = `${base}_${timestamp}.${ext}`
      }

      const renamedFile = new File([file], fileName, { type: file.type })
      await store.put(renamedFile, renamedFile.name)

      const url = URL.createObjectURL(renamedFile)
      settings.alarms.push({
        id: renamedFile.name,
        name: renamedFile.name,
        default: false,
        file: url,
      })
    }

    await tx.done
  }

  const isCustomAlarm = alarm => {
    // 判斷是否為上傳的自定義鈴聲
    // return String(alarm.id).startsWith('default') === false
    return !alarm.default
  }

  const deleteAlarm = async alarm => {
    // 刪除鈴聲：從 IndexedDB 和 store 移除
    if (!db.value || !alarm?.id) return

    try {
      const tx = db.value.transaction('media', 'readwrite')
      const store = tx.objectStore('media')
      await store.delete(alarm.id)
      await tx.done

      if (alarm.file) {
        // 移除 URL 資源與 store 中資料
        URL.revokeObjectURL(alarm.file)
      }

      settings.alarms = settings.alarms.filter(a => a.id !== alarm.id)

      if (settings.selected === alarm.id) {
        // 若選中的剛好是刪除項目，重置選擇
        settings.selected = null
      }
    } catch (error_) {
      console.error('刪除失敗:', error_)
      error.value = '刪除失敗，請稍後再試。'
    }
  }

  onMounted(async () => {
    await initDB()
    await loadFilesFromDB()
  })
</script>

<style scoped>
.upload-btn {
  width: 40px;
  height: 40px;
  padding: 8px 12px;
  border-radius: 50%;
  font-weight: bold;
  display: inline-block;
  cursor: pointer;
  color: white;
  background-color: #3a86ff;
}

.upload-btn:hover {
  background-color: #265dcf;
}

td:nth-child(4) {
  color: #333;
}

td:nth-child(4):hover {
  color: #fff;
}

</style>
