<template>
    <div class="p-6 space-y-8">
      <h1 class="text-3xl font-bold mb-6">섹터 관리</h1>
      
      <!-- 검색어 입력 및 초기화 버튼 -->
      <div class="flex space-x-4 mb-4">
        <input v-model="searchTerm" type="text" placeholder="검색어 입력" class="border p-2 rounded w-full" />
        <button @click="resetSearch" class="bg-gray-300 px-4 py-1 rounded w-24">초기화</button>
      </div>
      
      <!-- 카테고리 및 섹터 추가 버튼 -->
      <div class="flex space-x-4 mb-4">
        <button @click="addCategory" class="bg-green-500 text-white px-4 py-2 rounded">카테고리 추가</button>
        <button @click="addSector" class="bg-green-500 text-white px-4 py-2 rounded">섹터 추가</button>
      </div>
      
      <!-- 탭 메뉴 (데스크탑) -->
      <div class="hidden md:flex items-center space-x-4 mt-4">
        <!-- 왼쪽 버튼 -->
        <button 
          @click="scrollTabs('left')" 
          class="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none flex-shrink-0 self-stretch flex items-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- 탭 컨테이너 -->
        <div ref="tabsContainer" class="flex-1 overflow-x-auto whitespace-nowrap pb-2 scroll-smooth" style="scrollbar-width: none;">
          <div class="flex space-x-4">
            <button
              v-for="(category, index) in categories"
              :key="category"
              @click="activeTab = index"
              :class="{'bg-blue-500 text-white': activeTab === index, 'bg-gray-200': activeTab !== index}"
              class="px-4 py-2 rounded whitespace-nowrap flex-shrink-0 h-10"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- 오른쪽 버튼 -->
        <button 
          @click="scrollTabs('right')" 
          class="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none flex-shrink-0 self-stretch flex items-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
  
      <!-- 콤보박스 (모바일) -->
      <div class="md:hidden mt-4">
        <select v-model="activeTab" class="border p-2 rounded w-full">
          <option v-for="(category, index) in categories" :key="category" :value="index">
            {{ category }}
          </option>
        </select>
      </div>
      
      <!-- 섹터 리스트 -->
      <div v-for="(category, index) in categories" :key="category" v-show="activeTab === index" class="mt-4">
        <h2 class="text-xl font-semibold mb-4">{{ category }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="symbol in filteredSectors(category)" :key="symbol.symbol_code" class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700">{{ symbol.symbol_name || '이름 없음' }}</h3>
            <p class="text-sm text-gray-500">코드: {{ symbol.symbol_code }}</p>
            <p class="text-sm text-gray-500">카테고리: {{ getCategories(symbol.symbol_code) }}</p>
            <!--<button class="bg-blue-500 text-white px-3 py-1 rounded mt-2">수정</button>-->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  interface Sector {
    id: number;
    sector_category: string;
    symbol_code: string;
    symbol_name: string;
    created_at: string;
    updated_at: string;
  }
  
  const sectors = ref<Sector[]>([])
  const categories = ref<string[]>([])
  const activeTab = ref(0)
  const searchTerm = ref('')
  const tabsContainer = ref<HTMLElement | null>(null)
  
  onMounted(async () => {
    await loadSectors()
  })
  
  async function loadSectors() {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Sector[];
      }>('/api/setting/sectors/sectors')
      
      if (response.success) {
        sectors.value = response.data
        categories.value = [...new Set(response.data.map(item => item.sector_category))]
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
    }
  }
  
  function filteredSectors(category: string) {
    return sectors.value.filter(symbol => 
      symbol.sector_category === category &&
      (symbol.symbol_name.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
       symbol.symbol_code.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
  }
  
  function getCategories(symbolCode: string) {
    const sectorCategories = sectors.value
      .filter(symbol => symbol.symbol_code === symbolCode)
      .map(symbol => symbol.sector_category)
    return sectorCategories.join(', ')
  }
  
  function resetSearch() {
    searchTerm.value = ''
  }
  
  async function addCategory() {
    // 카테고리 추가 로직 구현
    console.log('카테고리 추가')
  }
  
  async function addSector() {
    // 섹터 추가 로직 구현
    console.log('섹터 추가')
  }
  
  function scrollTabs(direction: 'left' | 'right') {
    if (!tabsContainer.value) return;
    
    const container = tabsContainer.value;
    const scrollAmount = 200; // 스크롤 단위
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }
  </script>
  
  <style scoped>
  /* 스크롤바 스타일링 */
  .overflow-x-auto {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
  
  /* 버튼 최소 너비 설정 */
  button {
    min-width: fit-content;
  }
  
  /* 스크롤 부드럽게 */
  .scroll-smooth {
    scroll-behavior: smooth;
  }
  
  /* 네비게이션 버튼 호버 효과 */
  button:hover {
    transition: all 0.2s;
  }
  </style>