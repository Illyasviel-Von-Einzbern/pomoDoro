<!-- FileUploader.vue -->
<template>
  <div>
    <h2>上傳檔案</h2>
    <input type="file" @change="handleFileChange">
    <button @click="uploadFile">上傳</button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectedFile: null,
      }
    },
    methods: {
      handleFileChange (event) {
        this.selectedFile = event.target.files[0]
      },
      async uploadFile () {
        if (!this.selectedFile) {
          alert('請選擇一個檔案')
          return
        }

        const formData = new FormData()
        formData.append('file', this.selectedFile)

        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()
          alert('上傳成功：' + result.message)
        } catch (error) {
          console.error(error)
          alert('上傳失敗')
        }
      },
    },
  }
</script>
