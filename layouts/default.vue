<template>
  <div class="min-h-screen bg-gray-100">
    <ClientOnly>
      <div v-if="isAuthenticated" class="flex flex-col min-h-screen">
        <!-- 헤더 -->
        <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-4">
          <button 
            @click="toggleMobileMenu" 
            class="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div class="font-bold text-xl">
            {{ userLevel === 9 ? '도비 관리자 포털' : '도비 영업 포털' }}
          </div>
          
          <button @click="handleLogout" class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            로그아웃
          </button>
        </header>

        <!-- 사이드 메뉴 -->
        <SideMenu />

        <!-- 모바일 메뉴 -->
        <div v-if="isMobileMenuOpen" class="lg:hidden fixed inset-0 z-40">
          <!-- 오버레이 배경 -->
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
          
          <!-- 모바일 메뉴 내용 -->
          <div class="absolute inset-y-0 left-0 w-full bg-white flex flex-col h-full">
            <div class="h-16 px-4 flex items-center justify-between border-b">
              <h2 class="text-xl font-bold">메뉴</h2>
              <button @click="toggleMobileMenu" class="p-2 text-gray-600 hover:text-gray-900">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <SideMenu class="!block" @menu-click="toggleMobileMenu" />
          </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <main class="flex-1 pt-16 lg:pl-64 min-h-screen pb-16">
          <div class="max-w-7xl mx-auto p-4">
            <slot />
          </div>
        </main>

        <!-- 모바일 하단 네비게이션 -->
        <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div class="flex justify-around p-2">
            <!-- 관리자용 네비게이션 -->
            <template v-if="userLevel === 9">
              <NuxtLink 
                to="/dashboard" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path === '/dashboard' }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs">대시보드</span>
              </NuxtLink>
              <NuxtLink 
                to="/members" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path === '/members' }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span class="text-xs">회원관리</span>
              </NuxtLink>
              <NuxtLink 
                to="/boards" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path.startsWith('/boards') }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
                </svg>
                <span class="text-xs">게시판</span>
              </NuxtLink>
            </template>

            <!-- 영업용 네비게이션 -->
            <template v-if="userLevel === 5">
              <NuxtLink 
                to="/sales_dashboard" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path === '/sales_dashboard' }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs">대시보드</span>
              </NuxtLink>
              <NuxtLink 
                to="/sales_members" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path === '/sales_members' }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span class="text-xs">회원관리</span>
              </NuxtLink>
              <NuxtLink 
                to="/sales_revenue" 
                class="flex flex-col items-center p-2"
                :class="{ 'text-blue-600': route.path === '/sales_revenue' }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span class="text-xs">수익관리</span>
              </NuxtLink>
            </template>
          </div>
        </nav>
      </div>
      <div v-else class="min-h-screen">
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const auth = useState('auth', () => false)
const isAuthenticated = computed(() => !!auth.value)
const isMobileMenuOpen = ref(false)
const userLevel = useState('userLevel', () => 0)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = async () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userLevel')
  auth.value = false
  userLevel.value = 0
  await router.push('/auth/login')
}

onMounted(() => {
  if (process.client) {
    const authStatus = localStorage.getItem('isAuthenticated')
    auth.value = authStatus === 'true'

    if (!auth.value && route.path !== '/auth/login') {
      router.push('/auth/login')
    }

    const storedUserLevel = localStorage.getItem('userLevel')
    if (storedUserLevel) {
      userLevel.value = parseInt(storedUserLevel, 10)
    }
  }
})
</script>

<style scoped>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 