<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <template v-if="isAuthenticated">
      <!-- 헤더 -->
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-4">
        <!-- 관리자 -->
        <div class="font-bold text-xl" v-if="userLevel === 9">도비 관리자 포털</div>
        <!-- 영업 -->
        <div class="font-bold text-xl" v-if="userLevel === 5">도비 영업 포털</div>
        <button @click="handleLogout" class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
          로그아웃
        </button>
      </header>

      <!-- 사이드바 -->
      <aside class="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30">
        <nav class="p-4 h-full overflow-y-auto">
          <ul class="space-y-2">
            <!-- 관리자 메뉴 -->
            <li v-if="userLevel === 9">
              <NuxtLink 
                to="/dashboard" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/dashboard' }"
              >
                <span>대시보드</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 9">
              <NuxtLink 
                to="/members" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/members' }"
              >
                <span>회원관리</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 9">
              <button @click="toggleBoards" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 focus:outline-none">
                <span class="text-sm font-semibold text-gray-500">게시판 관리</span>
                <svg :class="{ 'transform rotate-180': isBoardsOpen }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul v-if="isBoardsOpen" class="ml-4 space-y-2">
                <li>
                  <NuxtLink 
                    to="/boards/list" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/boards/list' }"
                  >
                    <span>게시판 목록</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/boards/notices" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/boards/notices' }"
                  >
                    <span>공지사항 관리</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/boards/terms" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/boards/terms' }"
                  >
                    <span>약관 관리</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <li v-if="userLevel === 9">
              <NuxtLink 
                to="/menus" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/menus' }"
              >
                <span>메뉴관리</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 9">
              <NuxtLink 
                to="/referrals" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/referrals' }"
              >
                <span>레퍼럴관리</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 9">
              <NuxtLink 
                to="/sales" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/sales' }"
              >
                <span>세일즈 메뉴관리</span>
              </NuxtLink>
            </li>
            <!-- 설정 관리 서브메뉴 -->
            <li v-if="userLevel === 9">
              <button @click="toggleSettings" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 focus:outline-none">
                <span class="text-sm font-semibold text-gray-500">설정 관리</span>
                <svg :class="{ 'transform rotate-180': isSettingsOpen }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul v-if="isSettingsOpen" class="ml-4 space-y-2">
                <li>
                  <NuxtLink 
                    to="/settings/symbols" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/settings/symbols' }"
                  >
                    <span>심볼관리</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/settings/bots" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/settings/bots' }"
                  >
                    <span>봇관리</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/settings/sectors" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/settings/sectors' }"
                  >
                    <span>섹터관리</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/settings/keywords" 
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    :class="{ 'bg-gray-100': route.path === '/settings/keywords' }"
                  >
                    <span>키워드관리</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <!-- 영업 메뉴 -->
            <li v-if="userLevel === 5">
              <NuxtLink 
                to="/sales_dashboard" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/sales_dashboard' }"
              >
                <span>대시보드</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 5">
              <NuxtLink 
                to="/sales_members" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/sales_members' }"
              >
                <span>회원관리</span>
              </NuxtLink>
            </li>
            <li v-if="userLevel === 5">
              <NuxtLink 
                to="/sales_revenue" 
                class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path === '/sales_revenue' }"
              >
                <span>수익관리</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 메인 컨텐츠 -->
      <main class="flex-1 pt-16 lg:pl-64 min-h-screen">
        <div class="max-w-7xl mx-auto p-4">
          <slot />
        </div>
      </main>
    </template>
    
    <!-- 비로그인 상태일 때는 slot만 표시 -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const isAuthenticated = ref(false)
const isSettingsOpen = ref(false)
const isBoardsOpen = ref(false)
const userLevel = useState('userLevel', () => 0)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const toggleBoards = () => {
  isBoardsOpen.value = !isBoardsOpen.value
}

const handleLogout = async () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userLevel')
  const auth = useState('auth')
  auth.value = false
  userLevel.value = 0
  await router.push('/auth/login')
}

onMounted(() => {
  const authStatus = localStorage.getItem('isAuthenticated')
  isAuthenticated.value = authStatus === 'true'

  const storedUserLevel = localStorage.getItem('userLevel')
  if (storedUserLevel) {
    userLevel.value = parseInt(storedUserLevel, 10)
  }
})

watch(() => useState('auth').value, (newValue) => {
  isAuthenticated.value = !!newValue
})
</script> 