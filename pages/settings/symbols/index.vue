<template>
    <div class="p-6 space-y-8">
      <h1 class="text-3xl font-bold mb-6">심볼 관리</h1>
      
      <!-- 저장 버튼 -->
      <button @click="saveSymbols" class="bg-blue-500 text-white px-4 py-2 rounded-lg">저장</button>
      
      <!-- 탭 메뉴 -->
      <div class="flex space-x-4 mt-4">
        <button
          v-for="(exchange, index) in exchanges"
          :key="exchange.exchange_name"
          @click="activeTab = index"
          :class="{'bg-blue-500 text-white': activeTab === index, 'bg-gray-200': activeTab !== index}"
          class="px-4 py-2 rounded"
        >
          {{ exchange.exchange_name }} ({{ exchange.empty_count }}/{{ exchange.total_count }})
        </button>
      </div>
      
      <!-- 심볼 리스트 -->
      <div v-for="(exchange, index) in exchanges" :key="exchange.exchange_name" v-show="activeTab === index" class="mt-4">
        <h2 class="text-xl font-semibold mb-4">{{ exchange.exchange_name }}</h2>
        <div v-for="symbol in exchange.symbols" :key="symbol.symbol_code" class="flex items-center space-x-4 mb-2">
          <input v-model="symbol.symbol_name" type="text" class="border p-2 rounded w-full" placeholder="심볼 이름 입력" />
          <span class="text-gray-700">{{ symbol.symbol_code }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  const exchanges = ref([])
  const activeTab = ref(0)
  
  onMounted(async () => {
    await loadSymbols()
  })
  
  async function loadSymbols() {
    try {
      const response = await fetch('/api/symbols')
      const data = await response.json()
      const grouped = data.reduce((acc, symbol) => {
        let exchange = acc.find(e => e.exchange_name === symbol.exchange_name)
        if (!exchange) {
          exchange = {
            exchange_name: symbol.exchange_name,
            total_count: symbol.total_count,
            empty_count: symbol.empty_count,
            symbols: []
          }
          acc.push(exchange)
        }
        exchange.symbols.push({
          ...symbol,
          original_name: symbol.symbol_name // 원래 이름 저장
        })
        return acc
      }, [])
      exchanges.value = grouped
    } catch (error) {
      console.error('API 호출 오류:', error)
    }
  }
  
  async function saveSymbols() {
    try {
      for (const exchange of exchanges.value) {
        for (const symbol of exchange.symbols) {
          const originalName = symbol.original_name || '';
          const symbolName = symbol.symbol_name || '';
          if (symbolName.trim() !== '' && symbolName !== originalName) { // 변경된 심볼만 업데이트
            await fetch('/api/symbols/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                exchange_name: exchange.exchange_name,
                symbol_code: symbol.symbol_code,
                symbol_name: symbolName
              })
            });
          }
        }
      }
      await loadSymbols() // 업데이트 후 데이터 다시 로드
    } catch (error) {
      console.error('심볼 저장 오류:', error);
    }
  }
  </script>
  
  <style scoped>
  /* 추가 스타일링 */
  </style> 