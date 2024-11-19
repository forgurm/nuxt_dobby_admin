// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-04-03',

  experimental: {
    renderJsonPayloads: true
  },

  typescript: {
    typeCheck: false,
    strict: true,
    shim: false
  },

  vite: {
    build: {
      target: 'esnext',
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['supports-color', 'debug']
    },
    esbuild: {
      target: 'esnext'
    },
    server: {
      hmr: false
    }
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
        platform: 'node'
      }
    }
  },

  routeRules: {
    '/': { redirect: '/auth/login' }
  },

  devServer: {
    port: 3000,
    host: 'localhost'
  },

  // 런타임 설정
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },

  // 플러그인 설정
  plugins: [
    '~/plugins/axios.ts'
  ],

  // app 설정
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' }
      ]
    }
  },

  router: {
    middleware: ['auth']
  },

  hooks: {
    'build:manifest': (manifest) => {
      manifest.override = true
    }
  }
})
