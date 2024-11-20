export default defineNuxtRouteMiddleware((to) => {
  // 클라이언트 사이드에서만 실행
  if (process.client) {
    const auth = useState('auth')
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    // 인증 상태 동기화
    auth.value = isAuthenticated

    // 로그인 페이지가 아니고 인증되지 않은 경우
    if (to.path !== '/auth/login' && !isAuthenticated) {
      return navigateTo('/auth/login')
    }

    // 이미 로그인된 상태에서 로그인 페이지 접근 시
    if (to.path === '/auth/login' && isAuthenticated) {
      return navigateTo('/dashboard')
    }
  }
}) 