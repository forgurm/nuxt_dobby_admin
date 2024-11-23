<template>
  <nav :class="[
    'overflow-y-auto flex flex-col',
    $attrs.class || 'hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30'
  ]">
    <ul class="space-y-2 p-4 flex-grow">
      <!-- 관리자 메뉴 -->
      <li v-if="userLevel === 9">
        <NuxtLink 
          to="/dashboard" 
          class="flex items-center p-3 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': route.path === '/dashboard' }"
          @click="$emit('menuClick')"
        >
          <span>대시보드</span>
        </NuxtLink>
      </li>
      <li v-if="userLevel === 9">
        <NuxtLink 
          to="/members" 
          class="flex items-center p-3 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': route.path === '/members' }"
          @click="$emit('menuClick')"
        >
          <span>회원관리</span>
        </NuxtLink>
      </li>
      <!-- 게시판 관리 -->
      <li v-if="userLevel === 9">
        <button @click="toggleBoards" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100">
          <span class="text-sm font-semibold text-gray-500">게시판 관리</span>
          <svg :class="{ 'transform rotate-180': isBoardsOpen }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <ul v-if="isBoardsOpen" class="ml-4 space-y-2">
          <li>
            <NuxtLink 
              to="/boards/list" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/boards/list' }"
              @click="$emit('menuClick')"
            >
              <span>게시판 목록</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/boards/notices" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/boards/notices' }"
              @click="$emit('menuClick')"
            >
              <span>공지사항 관리</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/boards/terms" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/boards/terms' }"
              @click="$emit('menuClick')"
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
          @click="$emit('menuClick')"
        >
          <span>메뉴관리</span>
        </NuxtLink>
      </li>
      <li v-if="userLevel === 9">
        <button @click="toggleReferrals" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100">
          <span class="text-sm font-semibold text-gray-500">레퍼럴 관리</span>
          <svg :class="{ 'transform rotate-180': isReferralsOpen }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <ul v-if="isReferralsOpen" class="ml-4 space-y-2">
          <li>
            <NuxtLink 
              to="/referrals/bybit" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/referrals/bybit' }"
              @click="$emit('menuClick')"
            >
              <span>바이비트</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/referrals/bingx" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/referrals/bingx' }"
              @click="$emit('menuClick')"
            >
              <span>빙엑스</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/referrals/bitget" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/referrals/bitget' }"
              @click="$emit('menuClick')"
            >
              <span>비트겟</span>
            </NuxtLink>
          </li>
        </ul>
      </li>
      <!-- 설정 관리 -->
      <li v-if="userLevel === 9">
        <button @click="toggleSettings" class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100">
          <span class="text-sm font-semibold text-gray-500">설정 관리</span>
          <svg :class="{ 'transform rotate-180': isSettingsOpen }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <ul v-if="isSettingsOpen" class="ml-4 space-y-2">
          <li>
            <NuxtLink 
              to="/settings/symbols" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/settings/symbols' }"
              @click="$emit('menuClick')"
            >
              <span>심볼관리</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/settings/bots" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/settings/bots' }"
              @click="$emit('menuClick')"
            >
              <span>봇관리</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/settings/sectors" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/settings/sectors' }"
              @click="$emit('menuClick')"
            >
              <span>섹터관리</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/settings/keywords" 
              class="flex items-center p-3 rounded-lg hover:bg-gray-100"
              :class="{ 'bg-gray-100': route.path === '/settings/keywords' }"
              @click="$emit('menuClick')"
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
          @click="$emit('menuClick')"
        >
          <span>대시보드</span>
        </NuxtLink>
      </li>
      <li v-if="userLevel === 5">
        <NuxtLink 
          to="/sales_members" 
          class="flex items-center p-3 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': route.path === '/sales_members' }"
          @click="$emit('menuClick')"
        >
          <span>회원관리</span>
        </NuxtLink>
      </li>
      <li v-if="userLevel === 5">
        <NuxtLink 
          to="/sales_revenue" 
          class="flex items-center p-3 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': route.path === '/sales_revenue' }"
          @click="$emit('menuClick')"
        >
          <span>수익관리</span>
        </NuxtLink>
      </li>
    </ul>

    <!-- 모바일에서만 보이는 하단 닫기 버튼 -->
    <div v-if="$attrs.class?.includes('!block')" class="p-4 border-t">
      <button 
        @click="$emit('menuClick')"
        class="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        메뉴 닫기
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const userLevel = useState('userLevel', () => 0)

const isSettingsOpen = ref(false)
const isBoardsOpen = ref(false)
const isReferralsOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const toggleBoards = () => {
  isBoardsOpen.value = !isBoardsOpen.value
}

const toggleReferrals = () => {
  isReferralsOpen.value = !isReferralsOpen.value
}

defineEmits(['menuClick'])
</script>