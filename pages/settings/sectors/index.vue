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
      <div class="hidden md:flex space-x-4 mt-4">
        <button
          v-for="(category, index) in categories"
          :key="category"
          @click="activeTab = index"
          :class="{'bg-blue-500 text-white': activeTab === index, 'bg-gray-200': activeTab !== index}"
          class="px-4 py-2 rounded"
        >
          {{ category }}
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
  
  const sectors = ref([])
  const categories = ref([])
  const activeTab = ref(0)
  const searchTerm = ref('')
  
  onMounted(async () => {
    try {
      const response = await fetch('/api/sectors')
      const data = await response.json()
      sectors.value = data
      categories.value = [...new Set(data.map(item => item.sector_category))]
    } catch (error) {
      console.error('API 호출 오류:', error)
    }
  })
  
  function filteredSectors(category) {
    return sectors.value.filter(symbol => 
      symbol.sector_category === category &&
      (symbol.symbol_name.includes(searchTerm.value) || symbol.symbol_code.includes(searchTerm.value))
    )
  }
  
  function getCategories(symbolCode) {
    const categories = sectors.value
      .filter(symbol => symbol.symbol_code === symbolCode)
      .map(symbol => symbol.sector_category)
    return categories.join(', ')
  }
  
  function resetSearch() {
    searchTerm.value = ''
  }
  
  function addCategory() {
    // 카테고리 추가 로직 구현
    console.log('카테고리 추가')
  }
  
  function addSector() {
    // 섹터 추가 로직 구현
    console.log('섹터 추가')
  }
  </script>
  
  <style scoped>
  /* 추가 스타일링 */
  </style>