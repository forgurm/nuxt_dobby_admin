<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">게시판 목록 관리</h1>
    <div class="space-y-4">
      <!-- 게시판 목록 테이블 -->
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="px-4 py-2 border">게시판명</th>
            <th class="px-4 py-2 border">사용여부</th>
            <th class="px-4 py-2 border">작성일</th>
            <th class="px-4 py-2 border">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="board in boards" :key="board.id">
            <td class="px-4 py-2 border">{{ board.name }}</td>
            <td class="px-4 py-2 border">
              <toggle-button v-model="board.isActive" />
            </td>
            <td class="px-4 py-2 border">{{ board.createdAt }}</td>
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

const boards = ref([
  { id: 1, name: '자유게시판', isActive: true, createdAt: '2024-03-20' },
  { id: 2, name: '공지사항', isActive: true, createdAt: '2024-03-20' },
  { id: 3, name: 'FAQ', isActive: false, createdAt: '2024-03-20' },
])
</script> 