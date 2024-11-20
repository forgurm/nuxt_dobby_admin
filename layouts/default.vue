<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <template v-if="isAuthenticated">
      <!-- 헤더 -->
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-4">
        <!-- 모바일 메뉴 버튼 -->
        <button 
          @click="toggleMobileMenu" 
          class="lg:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- 타이틀 -->
        <div class="font-bold text-xl" v-if="userLevel === 9">도비 관리자 포털</div>
        <div class="font-bold text-xl" v-if="userLevel === 5">도비 영업 포털</div>
        
        <button @click="handleLogout" class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
          로그아웃
        </button>
      </header>

      <!-- 모바일 사이드 메뉴 -->
      <div 
        v-if="isMobileMenuOpen" 
        class="lg:hidden fixed inset-0 z-40"
      >
        <!-- 오버레이 배경 -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="toggleMobileMenu"
        ></div>
        
        <!-- 사이드 메뉴 -->
        <div class="absolute inset-y-0 left-0 w-full bg-white flex flex-col h-full">
          <!-- 헤더 -->
          <div class="h-16 px-4 flex items-center justify-between border-b">
            <h2 class="text-xl font-bold">메뉴</h2>
            <button 
              @click="toggleMobileMenu"
              class="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- 메뉴 내용 -->
          <nav class="flex-1 overflow-y-auto p-4">
            <ul class="space-y-2">
              <!-- 관리자 메뉴 -->
              <li v-if="userLevel === 9">
                <NuxtLink 
                  to="/dashboard" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/dashboard' }"
                  @click="toggleMobileMenu"
                >
                  <span>대시보드</span>
                </NuxtLink>
              </li>
              <li v-if="userLevel === 9">
                <NuxtLink 
                  to="/members" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/members' }"
                  @click="toggleMobileMenu"
                >
                  <span>회원관리</span>
                </NuxtLink>
              </li>
              <!-- 게시판 관리 -->
              <li v-if="userLevel === 9">
                <button @click="toggleMobileBoards" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100">
                  <span>게시판 관리</span>
                  <svg :class="{ 'transform rotate-180': isMobileBoardsOpen }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <ul v-if="isMobileBoardsOpen" class="ml-4 space-y-2">
                  <li>
                    <NuxtLink 
                      to="/boards/list" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/boards/list' }"
                      @click="toggleMobileMenu"
                    >
                      <span>게시판 목록</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink 
                      to="/boards/notices" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/boards/notices' }"
                      @click="toggleMobileMenu"
                    >
                      <span>공지사항 관리</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink 
                      to="/boards/terms" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/boards/terms' }"
                      @click="toggleMobileMenu"
                    >
                      <span>약관 관리</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <!-- 나머지 메뉴들 -->
              <li v-if="userLevel === 9">
                <NuxtLink 
                  to="/menus" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/menus' }"
                  @click="toggleMobileMenu"
                >
                  <span>메뉴관리</span>
                </NuxtLink>
              </li>
              <li v-if="userLevel === 9">
                <NuxtLink 
                  to="/referrals" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/referrals' }"
                  @click="toggleMobileMenu"
                >
                  <span>레퍼럴관리</span>
                </NuxtLink>
              </li>
              <!-- 설정 관리 -->
              <li v-if="userLevel === 9">
                <button @click="toggleMobileSettings" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100">
                  <span>설정 관리</span>
                  <svg :class="{ 'transform rotate-180': isMobileSettingsOpen }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <ul v-if="isMobileSettingsOpen" class="ml-4 space-y-2">
                  <li>
                    <NuxtLink 
                      to="/settings/symbols" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/settings/symbols' }"
                      @click="toggleMobileMenu"
                    >
                      <span>심볼관리</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink 
                      to="/settings/bots" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/settings/bots' }"
                      @click="toggleMobileMenu"
                    >
                      <span>봇관리</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink 
                      to="/settings/sectors" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/settings/sectors' }"
                      @click="toggleMobileMenu"
                    >
                      <span>섹터관리</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink 
                      to="/settings/keywords" 
                      class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                      :class="{ 'bg-gray-100': route.path === '/settings/keywords' }"
                      @click="toggleMobileMenu"
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
                  @click="toggleMobileMenu"
                >
                  <span>대시보드</span>
                </NuxtLink>
              </li>
              <li v-if="userLevel === 5">
                <NuxtLink 
                  to="/sales_members" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/sales_members' }"
                  @click="toggleMobileMenu"
                >
                  <span>회원관리</span>
                </NuxtLink>
              </li>
              <li v-if="userLevel === 5">
                <NuxtLink 
                  to="/sales_revenue" 
                  class="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  :class="{ 'bg-gray-100': route.path === '/sales_revenue' }"
                  @click="toggleMobileMenu"
                >
                  <span>수익관리</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
          
          <!-- 하단 닫기 버튼 -->
          <div class="p-4 border-t">
            <button 
              @click="toggleMobileMenu"
              class="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              메뉴 닫기
            </button>
          </div>
        </div>
      </div>

      <!-- 기존 데스크톱 사이드바 -->
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
    </template>
    
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useState('auth', () => false)
const isAuthenticated = computed(() => !!auth.value)
const isSettingsOpen = ref(false)
const isBoardsOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileBoardsOpen = ref(false)
const isMobileSettingsOpen = ref(false)
const userLevel = useState('userLevel', () => 0)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const toggleBoards = () => {
  isBoardsOpen.value = !isBoardsOpen.value
}

const toggleMobileBoards = () => {
  isMobileBoardsOpen.value = !isMobileBoardsOpen.value
}

const toggleMobileSettings = () => {
  isMobileSettingsOpen.value = !isMobileSettingsOpen.value
}

const handleLogout = async () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userLevel')
  auth.value = false
  userLevel.value = 0
  await router.push('/auth/login')
}

onMounted(() => {
  const authStatus = localStorage.getItem('isAuthenticated')
  auth.value = authStatus === 'true'

  if (!auth.value && route.path !== '/auth/login') {
    router.push('/auth/login')
  }

  const storedUserLevel = localStorage.getItem('userLevel')
  if (storedUserLevel) {
    userLevel.value = parseInt(storedUserLevel, 10)
  }
})
</script> 