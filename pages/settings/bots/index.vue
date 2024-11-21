<template>
    <div class="p-6 space-y-8">
      <h1 class="text-3xl font-bold mb-6">봇 관리</h1>
      
      <!-- 봇 리스트 -->
      <table class="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th class="py-2">봇 ID</th>
            <th class="py-2">이름</th>
            <th class="py-2">상태</th>
            <th class="py-2">위치</th>
            <th class="py-2">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bot in bots" :key="bot.bot_id">
            <td class="border px-4 py-2">{{ bot.bot_id }}</td>
            <td class="border px-4 py-2">
              <input v-model="bot.name" type="text" class="border p-1 rounded w-full" />
            </td>
            <td class="border px-4 py-2">
              <span :class="statusClass(bot.status)">
                {{ statusEmoji(bot.status) }}
              </span>
            </td>
            <td class="border px-4 py-2">
              <input v-model="bot.location" type="text" class="border p-1 rounded w-full" />
            </td>
            <td class="border px-4 py-2">
              <button @click="saveBot(bot)" class="bg-blue-500 text-white px-2 py-1 rounded mr-2">저장</button>
              <button @click="deleteBot(bot.bot_id)" class="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  interface Bot {
    id: number;
    name: string;
    status: number;
    location: string;
    last_updated: string;
    bot_id: string;
  }
  
  const bots = ref<Bot[]>([])
  
  onMounted(async () => {
    await loadBots()
  })
  
  async function loadBots() {
    try {
      const response = await $fetch<{
        success: boolean;
        data: Bot[];
      }>('/api/bots')
      
      if (response.success) {
        bots.value = response.data
      } else {
        console.error('봇 데이터를 가져오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
    }
  }
  
  async function saveBot(bot: Bot) {
    try {
      const response = await $fetch(`/api/setting/bots/${bot.bot_id}`, {
        method: 'POST',
        body: bot
      })
      if (response.success) {
        console.log('봇 저장 완료')
      }
    } catch (error) {
      console.error('봇 저장 오류:', error)
    }
  }
  
  async function deleteBot(bot_id: string) {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await $fetch(`/api/setting/bots/${bot_id}`, { 
          method: 'DELETE' 
        })
        if (response.success) {
          bots.value = bots.value.filter(bot => bot.bot_id !== bot_id)
        }
      } catch (error) {
        console.error('삭제 오류:', error)
      }
    }
  }
  
  function statusEmoji(status: number): string {
    switch (status) {
      case 1:
        return '✅ 동작중'
      case 2:
        return '⏸️ 중지'
      case 3:
        return '❌ 에러'
      default:
        return '❓ 알 수 없음'
    }
  }
  
  function statusClass(status: number): string {
    switch (status) {
      case 1:
        return 'text-green-500'
      case 2:
        return 'text-yellow-500'
      case 3:
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }
  </script>
  
  <style scoped>
  /* 추가 스타일링 */
  </style>