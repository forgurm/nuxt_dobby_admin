export default defineNuxtPlugin(() => {
  addRouteMiddleware('hmr-fix', (to) => {
    // HMR 관련 경로를 명시적으로 처리
    if (to.path.includes('__webpack_hmr') || to.path.includes('__vite_hmr')) {
      return abortNavigation()
    }
  }, { global: true })
}) 