// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  plugins: [
    '~/plugins/crypto.ts',
    '~/plugins/toast-editor.client.ts'
  ],

  ssr: true,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  nitro: {
    typescript: {
      strict: true
    }
  },

  // 호환성 날짜 설정
  compatibilityDate: '2024-04-03',

  // Node.js 경고 메시지 비활성화
  cli: {
    env: {
      NODE_NO_WARNINGS: '1'
    }
  },

  // Vite 설정
  vite: {
    optimizeDeps: {
      exclude: ['debug', 'supports-color']
    }
  },

  experimental: {
    payloadExtraction: false
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
})