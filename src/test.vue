<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- 上傳按鈕 -->
        <label class="upload-btn">
          上傳鈴聲
          <input
            accept=".mp3, .mp4"
            hidden
            multiple
            type="file"
            @change="handleFileUpload"
          >
        </label>

        <p v-if="error" style="color: red;">{{ error }}</p>

        <!-- 檔案清單 -->
        <ul v-if="files.length > 0">
          <li v-for="(file) in files" :key="file.name">
            <a href="#" @click.prevent="previewFile(file)">{{ file.name }}</a>
            ({{ formatSize(file.size) }})
            <button @click="deleteFile(file.name)">🗑 刪除</button>
          </li>
        </ul>

        <div v-if="previewUrl">
          <p>正在預覽：</p>
          <audio v-if="isAudio" autoplay controls :src="previewUrl" />
          <video
            v-else
            autoplay
            controls
            :src="previewUrl"
            width="300"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { openDB } from 'idb'
  import { onMounted, ref } from 'vue'

  // refs and state
  const files = ref([])
  const error = ref('')
  const db = ref(null)
  const previewUrl = ref(null)
  const isAudio = ref(true)

  // 初始化資料庫
  const initDB = async () => {
    db.value = await openDB('AlarmDB', 1, {
      upgrade (db) {
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media')
        }
      },
    })
  }

  // 載入已存在的檔案
  const loadFilesFromDB = async () => {
    const tx = db.value.transaction('media', 'readonly')
    const store = tx.objectStore('media')
    const allKeys = await store.getAllKeys()

    const loadedFiles = []
    for (const key of allKeys) {
      const file = await store.get(key)
      loadedFiles.push(file)
    }

    files.value = loadedFiles
  }

  // 上傳處理
  const handleFileUpload = async event => {
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
      files.value.push(renamedFile)
    }

    await tx.done
  }

  // 預覽
  const previewFile = file => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)
    isAudio.value = file.type.startsWith('audio')
  }

  // 刪除
  const deleteFile = async fileName => {
    const tx = db.value.transaction('media', 'readwrite')
    const store = tx.objectStore('media')
    await store.delete(fileName)
    await tx.done

    files.value = files.value.filter(file => file.name !== fileName)

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }

  // 檔案大小格式化
  const formatSize = size => {
    const kb = size / 1024
    return kb > 1024
      ? `${(kb / 1024).toFixed(4)} MB`
      : `${kb.toFixed(4)} KB`
  }

  // 掛載時初始化
  onMounted(async () => {
    await initDB()
    await loadFilesFromDB()
  })
</script>

<style scoped>
.upload-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3a86ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.upload-btn:hover {
  background-color: #265dcf;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 8px 0;
}
a {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}
button {
  margin-left: 10px;
}
</style>
