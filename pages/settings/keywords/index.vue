<template>
    <div class="p-6 space-y-8">
      <h1 class="text-3xl font-bold mb-6">키워드 필터 관리</h1>
      
      <!-- 키워드 추가 및 저장 버튼 -->
      <div class="flex space-x-4">
        <button @click="addKeyword" class="bg-green-500 text-white px-4 py-2 rounded">키워드 추가</button>
        <button @click="saveKeywords" class="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
      </div>
      
      <!-- 키워드 리스트 -->
      <table class="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th class="py-2">활성</th>
            <th class="py-2">키워드</th>
            <th class="py-2">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="keyword in keywords" :key="keyword.id">
            <td class="border px-4 py-2">
              <input type="checkbox" :checked="keyword.active === 1" @change="toggleActive(keyword)" />
            </td>
            <td class="border px-4 py-2">{{ keyword.keyword }}</td>
            <td class="border px-4 py-2">
              <button @click="deleteKeyword(keyword.id)" class="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  interface Keyword {
    id: number;
    keyword: string;
    active: number;
    created_at: string;
  }
  
  const keywords = ref<Keyword[]>([])
  
  onMounted(async () => {
    await loadKeywords()
  })
  
  async function loadKeywords() {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Keyword[];
      }>('/api/setting/keywords/keywords')
      
      if (response.success) {
        keywords.value = response.data
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
    }
  }
  
  function toggleActive(keyword: Keyword) {
    keyword.active = keyword.active === 1 ? 0 : 1
  }
  
  async function saveKeywords() {
    try {
      for (const keyword of keywords.value) {
        const response = await $fetch('/api/setting/keywords/update', {
          method: 'POST',
          body: keyword
        })
        if (!response.success) {
          throw new Error('키워드 업데이트 실패')
        }
      }
      console.log('키워드 저장 완료')
    } catch (error) {
      console.error('키워드 저장 오류:', error)
    }
  }
  
  async function deleteKeyword(id: number) {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await $fetch(`/api/setting/keywords/delete/${id}`, { 
          method: 'DELETE' 
        })
        if (response.success) {
          keywords.value = keywords.value.filter(k => k.id !== id)
        }
      } catch (error) {
        console.error('삭제 오류:', error)
      }
    }
  }
  
  async function addKeyword() {
    const keyword = prompt('추가할 키워드를 입력하세요:')
    if (keyword) {
      try {
        const response = await $fetch<{
          success: boolean;
          data: Keyword;
        }>('/api/setting/keywords/add', {
          method: 'POST',
          body: { keyword, active: 1 }
        })
        if (response.success) {
          await loadKeywords()
        }
      } catch (error) {
        console.error('키워드 추가 오류:', error)
      }
    }
  }
  </script>
  
  <style scoped>
  /* 추가 스타일링 */
  </style>