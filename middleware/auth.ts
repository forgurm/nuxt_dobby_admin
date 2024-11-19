export default defineNuxtRouteMiddleware((to) => {
  // 클라이언트 사이드에서만 실행
  if (process.client) {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const auth = useState('auth', () => false)

    // 로그인 페이지는 미들웨어 검사에서 제외
    if (to.path === '/auth/login') {
      return
    }

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      auth.value = false
      return navigateTo('/auth/login')
    }

    auth.value = true
  }
}) 