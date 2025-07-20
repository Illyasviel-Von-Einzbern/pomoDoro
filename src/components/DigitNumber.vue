<template>

  <svg
    class="digit"
    enable-background="new 10.667 0 226.771 430.528"
    height="430.528px"
    version="1.1"
    viewBox="10.667 0 226.771 430.528"
    width="226.771px"
    x="0px"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    y="0px"
  >
    <rect
      class="digit-a"
      :class="{ active: '02356789'.includes(data) }"
      height="22.677"
      width="181.417"
      x="33.343"
      y="-0.338"
    />
    <rect
      class="digit-b"
      :class="{ active: '01234789'.includes(data) }"
      height="181.417"
      width="22.679"
      x="214.76"
      y="22.338"
    />
    <rect
      class="digit-c"
      :class="{ active: '013456789'.includes(data) }"
      height="181.417"
      width="22.679"
      x="214.76"
      y="226.434"
    />
    <rect
      class="digit-d"
      :class="{ active: '0235689'.includes(data) }"
      height="22.679"
      width="181.417"
      x="33.343"
      y="407.851"
    />
    <rect
      class="digit-e"
      :class="{ active: '0268'.includes(data) }"
      height="181.417"
      width="22.678"
      x="10.667"
      y="226.434"
    />
    <rect
      class="digit-f"
      :class="{ active: '0456789'.includes(data) }"
      height="181.417"
      width="22.678"
      x="10.667"
      y="22.338"
    />
    <rect
      class="digit-g"
      :class="{ active: '2345689'.includes(data) }"
      height="22.678"
      width="181.417"
      x="33.343"
      y="203.756"
    />
    <circle :class="{ active: data === '：' }" cx="124.051" cy="113.047" r="22" />
    <circle :class="{ active: data === '：' }" cx="124.051" cy="319.502" r="22" />
  </svg>
</template>

<script setup>
  defineProps(['data', 'color'])
</script>

<style scoped lang="sass">
svg
  margin: 10px
  width: 150px
rect, circle
  fill: transparent
  &.active
    // v-bind 把 CSS 值和 Vue 變數綁定
    // https://zh-hk.vuejs.org/api/sfc-css-features.html#v-bind-in-css
    fill: v-bind(color)
</style>
