<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">약관 관리</h1>
    <div class="space-y-4">
      <!-- 약관 목록 테이블 -->
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="px-4 py-2 border">약관명</th>
            <th class="px-4 py-2 border">필수여부</th>
            <th class="px-4 py-2 border">사용여부</th>
            <th class="px-4 py-2 border">수정일</th>
            <th class="px-4 py-2 border">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="term in terms" :key="term.id">
            <td class="px-4 py-2 border">{{ term.name }}</td>
            <td class="px-4 py-2 border">
              <toggle-button v-model="term.isRequired" />
            </td>
            <td class="px-4 py-2 border">
              <toggle-button v-model="term.isActive" />
            </td>
            <td class="px-4 py-2 border">{{ term.updatedAt }}</td>
            <td class="px-4 py-2 border">
              <button class="text-blue-500 mr-2">수정</button>
              <button class="text-red-500">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const terms = ref([
  { 
    id: 1, 
    name: '서비스 이용약관', 
    isRequired: true,
    isActive: true, 
    updatedAt: '2024-03-20' 
  },
  { 
    id: 2, 
    name: '개인정보 처리방침', 
    isRequired: true,
    isActive: true, 
    updatedAt: '2024-03-20' 
  },
  { 
    id: 3, 
    name: '마케팅 정보 수신 동의', 
    isRequired: false,
    isActive: true, 
    updatedAt: '2024-03-20' 
  },
])
</script> 