<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">메뉴 관리</h1>
      <button 
        @click="openAddModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        메뉴 추가
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="pending" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- 메뉴 목록 -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메뉴명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">코드</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">레벨</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">필요 회원등급</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노출여부</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="menu in menus" :key="menu.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <span :style="{ marginLeft: `${(menu.level - 1) * 20}px` }">{{ menu.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">{{ menu.code }}</td>
            <td class="px-6 py-4">{{ menu.level }}</td>
            <td class="px-6 py-4">{{ getUserLevelName(menu.user_level) }}</td>
            <td class="px-6 py-4">
              <span :class="menu.is_visible ? 'text-green-600' : 'text-red-600'">
                {{ menu.is_visible ? '노출' : '숨김' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-center">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="openEditModal(menu)"
                  class="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  수정
                </button>
                <button 
                  @click="handleDelete(menu.id)"
                  class="text-red-600 hover:text-red-900 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 메뉴 추가/수정 모달 -->
    <MenuFormModal
      v-if="showModal"
      :show="showModal"
      :is-edit="!!selectedMenu"
      :initial-data="selectedMenu"
      :menus="menus"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import MenuFormModal from '~/components/menus/MenuFormModal.vue'

definePageMeta({
  middleware: ['auth']
})

interface Menu {
  id: number;
  name: string;
  code: string;
  parent_id: number | null;
  level: number;
  sort_order: number;
  user_level: number;
  is_visible: boolean;
  path: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Menu[];
  message?: string;
}

const menus = ref<Menu[]>([])
const pending = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)
const selectedMenu = ref<Menu | null>(null)

// 회원등급 이름 변환
const getUserLevelName = (level: number) => {
  const levels: Record<number, string> = {
    0: '전체',
    1: '일반회원',
    5: '영업',
    9: '관리자'
  }
  return levels[level] || level.toString()
}

// 메뉴 목록 조회
const fetchMenus = async () => {
  pending.value = true
  error.value = null
  
  try {
    const response = await $fetch<ApiResponse>('/api/menus/list')
    if (response.success && response.data) {
      menus.value = response.data
    } else {
      error.value = response.message || '메뉴 목록을 불러오는데 실패했습니다.'
    }
  } catch (err) {
    console.error('메뉴 목록 조회 실패:', err)
    error.value = '메뉴 목록을 불러오는데 실패했습니다.'
  } finally {
    pending.value = false
  }
}

// 모달 관련 함수들
const openAddModal = () => {
  selectedMenu.value = null
  showModal.value = true
}

const openEditModal = (menu: Menu) => {
  selectedMenu.value = menu
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMenu.value = null
}

// 폼 제출 처리
const handleSubmit = async (formData: Partial<Menu>) => {
  try {
    const url = selectedMenu.value
      ? `/api/menus/${selectedMenu.value.id}`
      : '/api/menus/0'
    
    const method = selectedMenu.value ? 'PUT' : 'POST'
    
    const response = await $fetch<ApiResponse>(url, {
      method,
      body: formData
    })

    if (response.success) {
      await fetchMenus()
      closeModal()
    } else {
      alert(response.message || '처리에 실패했습니다.')
    }
  } catch (err) {
    console.error('메뉴 처리 실패:', err)
    alert('처리 중 오류가 발생했습니다.')
  }
}

// 삭제 처리
const handleDelete = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const response = await $fetch<ApiResponse>(`/api/menus/${id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      await fetchMenus()
    } else {
      alert(response.message || '삭제에 실패했습니다.')
    }
  } catch (err) {
    console.error('메뉴 삭제 실패:', err)
    alert('삭제 중 오류가 발생했습니다.')
  }
}

// 페이지 로드 시 메뉴 목록 조회
onMounted(() => {
  fetchMenus()
})
</script> 