<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">공지사항 관리</h1>
    <div class="space-y-4">
      <!-- 공지사항 목록 테이블 -->
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="px-4 py-2 border">제목</th>
            <th class="px-4 py-2 border">작성자</th>
            <th class="px-4 py-2 border">상단고정</th>
            <th class="px-4 py-2 border">작성일</th>
            <th class="px-4 py-2 border">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notice in notices" :key="notice.id">
            <td class="px-4 py-2 border">{{ notice.title }}</td>
            <td class="px-4 py-2 border">{{ notice.author }}</td>
            <td class="px-4 py-2 border">
              <toggle-button v-model="notice.isPinned" />
            </td>
            <td class="px-4 py-2 border">{{ notice.createdAt }}</td>
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

const notices = ref([
  { 
    id: 1, 
    title: '서비스 점검 안내', 
    author: '관리자',
    isPinned: true, 
    createdAt: '2024-03-20' 
  },
  { 
    id: 2, 
    title: '이용약관 개정 안내', 
    author: '관리자',
    isPinned: false, 
    createdAt: '2024-03-19' 
  },
])
</script> 