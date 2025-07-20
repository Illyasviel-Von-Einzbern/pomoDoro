<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">未完成</h1>
      </v-col>
      <v-col cols="12">
        <!--
          ref = 模板引用
          https://zh-hk.vuejs.org/guide/essentials/template-refs.html#ref-on-component

          v-model = 使用者輸入資料綁定
          :rules = 驗證規則的 function 的陣列

          https://vuetifyjs.com/zh-Hans/api/v-text-field/
        -->
        <v-text-field
          ref="inputTextField"
          v-model="input"
          append-icon="mdi-plus"
          clearable
          label="新增事項"
          :rules="[rules.required, rules.length]"
          @click:append="onInputSubmit"
          @keydown.enter="onInputSubmit"
        />
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="list.items.length === 0">
              <td colspan="2">沒有項目</td>
            </tr>
            <tr v-for="(item, i) in list.items" :key="item.id">
              <td>
                <v-text-field
                  v-show="item.edit"
                  ref="editTextField"
                  v-model="item.model"
                  autofocus
                  :rules="[rules.required, rules.length]"
                />
                <span v-show="!item.edit">{{ item.text }}</span>
              </td>
              <td>
                <template v-if="item.edit">
                  <v-btn
                    icon="mdi-check"
                    @click="onSubmitConfirm(item.id, i)"
                  />
                  <v-btn
                    icon="mdi-undo"
                    @click="list.cancelEdit(item.id)"
                  />
                </template>
                <template v-else>
                  <v-btn
                    icon="mdi-pencil"
                    @click="list.editItem(item.id)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    @click="list.delItem(item.id)"
                  />
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">已完成</h1>
      </v-col>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="list.finishedItems.length === 0">
              <td colspan="2">沒有事項</td>
            </tr>
            <tr v-for="item in list.finishedItems" :key="item.id">
              <td>{{ item.text }}</td>
              <td>
                <v-btn
                  icon="mdi-delete"
                  @click="list.delFinishedItem(item.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, useTemplateRef } from 'vue'
  import { useListStore } from '@/stores/list'

  const list = useListStore()

  const input = ref('')
  // 使用者新增輸入欄位資料綁定

  // const inputTextField = ref(null)
  // Vue 3.5 以前寫法
  const inputTextField = useTemplateRef('inputTextField')
  // Vue 3.5 寫法
  // 取得輸入欄位的模板引用
  // https://vuejs.org/api/composition-api-helpers.html#usetemplateref

  const editTextField = useTemplateRef('editTextField')

  // 驗證規則
  const rules = {
    required: value => {
      return Boolean(value) || '必填'
    },
    length: value => {
      return value.length >= 3 || '必須要三個字以上'
    },
  }

  const onInputSubmit = () => {
    // 取得輸入欄位的 expose 的驗證狀態
    // https://zh-hk.vuejs.org/api/sfc-script-setup.html#defineexpose
    // https://vuetifyjs.com/zh-Hans/api/v-text-field/#exposed-isValid
    if (!inputTextField.value.isValid) return
    list.addItem(input.value)
    inputTextField.value.reset()
  }
  // 新增輸入欄位送出時

  const onSubmitConfirm = (id, i) => {
    if (!editTextField.value[i].isValid) return
    list.confirmEdit(id)
  }
</script>
