import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { VitePluginRadar } from 'vite-plugin-radar'
import VueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    VitePluginRadar({
      analytics: {
        id: 'G-HVFG9ZYLQF',
        // Google Analytics tag injection
      },
    }),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      // 啟用
      registerType: 'autoUpdate',
      // 設定自動更新
      workbox: {
        cleanupOutdatedCaches: true,
        // 清除過期的快取
        globPatterns: [
          // '**/*.{html,css,js,jpg,png,svg,gif,woff,woff2,eot,ttf,ico,mp3',
          '**/*',
        ],
        // 快取檔案的路徑，現在是設定所有檔案
        ignoreURLParametersMatching: [/.*/],
        // 忽略網址參數，不同參數當作相同檔案，所有參數都忽略
        // a.jpg = a.jpg?fbclid=1234
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 把文件快取上限增加到5MB
      },
      // PWA 工具庫，自訂 service worker 的行為
      manifest: {
        // 網站設定
        name: 'Pomodoro',
        short_name: 'Pomodoro',
        icons: [
          {
            src: '/web-app-manifest-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: '#ea5e57',
        background_color: '#ea5e57',
        display: 'standalone',
        // 顯示模式
        // https://web.dev/articles/add-manifest?hl=zh-tw#display
        start_url: './',
        // 開始網址
        scope: './',
        // 應用程式範圍，超出範圍會開啟瀏覽器
      },
    }),
    VueDevTools(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
