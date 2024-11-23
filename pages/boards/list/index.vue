<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">게시판 목록 관리</h1>
    
    <!-- 로딩 상태 -->
    <div v-if="pending" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- 게시판 목록 -->
    <div v-else class="space-y-4">
      <!-- 게시판 추가 버튼 -->
      <div class="flex justify-end mb-4">
        <button 
          @click="openAddModal"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          게시판 추가
        </button>
      </div>

      <!-- 게시판 목록 테이블 -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">게시판명</th>
              <th class="px-4 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">타입</th>
              <th class="px-4 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">생성일</th>
              <th class="px-4 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">수정일</th>
              <th class="px-4 py-3 border-b text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="board in boards" :key="board.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">{{ board.name }}</td>
              <td class="px-4 py-3">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800': board.type_code === 'NOTICE',
                        'bg-green-100 text-green-800': board.type_code === 'NORMAL',
                        'bg-purple-100 text-purple-800': board.type_code === 'FAQ',
                        'bg-yellow-100 text-yellow-800': board.type_code === 'QNA'
                      }">
                  {{ getBoardType(board.type_code) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(board.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(board.updated_at) }}</td>
              <td class="px-4 py-3 text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button 
                    @click="openEditModal(board)"
                    class="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                    수정
                  </button>
                  <button 
                    @click="handleDelete(board.id)"
                    class="text-red-600 hover:text-blue-900 flex items-center"
                  >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                    삭제
                  </button>
                  <button 
                    @click="viewDetail(board)"
                    class="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    상세
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 모달 추가 -->
    <BoardFormModal
      :show="showModal"
      :is-edit="!!selectedBoard"
      :initial-data="selectedBoard"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import BoardFormModal from '~/components/boards/BoardFormModal.vue'

interface Board {
  id: number;
  name: string;
  type_code: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Board[];
  message?: string;
}

const boards = ref<Board[]>([])
const pending = ref(false)
const error = ref<string | null>(null)

// 모달 관련 상태
const showModal = ref(false)
const selectedBoard = ref<Board | null>(null)

// 게시판 목록 조회
const fetchBoards = async () => {
  pending.value = true
  error.value = null
  
  try {
    const response = await $fetch<ApiResponse>('/api/boards/list/list')
    
    if (response.success && response.data) {
      boards.value = response.data
    } else {
      error.value = response.message || '게시판 목록을 불러오는데 실패했습니다.'
    }
  } catch (err) {
    console.error('게시판 목록 조회 실패:', err)
    error.value = '게시판 목록을 불러오는데 실패했습니다.'
  } finally {
    pending.value = false
  }
}

// 게시판 타입 코드를 문자열로 변환
const boardTypes: Record<string, string> = {
  'NORMAL': '일반',
  'NOTICE': '공지사항',
  'FAQ': 'FAQ',
  'QNA': 'Q&A'
}

const getBoardType = (typeCode: string) => {
  return boardTypes[typeCode] || typeCode
}

// 날짜 포맷팅
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 게시판 삭제 처리
const handleDelete = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const response = await $fetch<ApiResponse>(`/api/boards/list/${id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      await fetchBoards() // 목록 새로고침
    } else {
      alert(response.message || '삭제에 실패했습니다.')
    }
  } catch (err) {
    console.error('게시판 삭제 실패:', err)
    alert('게시판 삭제 중 오류가 발생했습니다.')
  }
}

// 모달 열기/닫기
const openAddModal = () => {
  selectedBoard.value = null
  showModal.value = true
}

const openEditModal = (board: Board) => {
  selectedBoard.value = board
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedBoard.value = null
}

// 폼 제출 처리
const handleSubmit = async (formData: Partial<Board>) => {
  try {
    let response;
    
    if (selectedBoard.value) {
      // 수정
      response = await $fetch<ApiResponse>(`/api/boards/list/${selectedBoard.value.id}`, {
        method: 'PUT',
        body: formData
      })
    } else {
      // 추가 - URL 변경
      response = await $fetch<ApiResponse>('/api/boards/list/0', {  // 여기를 수정
        method: 'POST',
        body: formData
      })
    }

    if (response.success) {
      await fetchBoards() // 목록 새로고침
      closeModal()
    } else {
      alert(response.message || '처리에 실패했습니다.')
    }
  } catch (err) {
    console.error('게시판 처리 실패:', err)
    alert('처리 중 오류가 발생했습니다.')
  }
}

// 페이지 로드 시 게시판 목록 조회
onMounted(() => {
  fetchBoards()
})

// 상세 보기 기능 추가
const viewDetail = (board: Board) => {
  // 상세 페이지로 이동하거나 상세 모달을 표시
  router.push(`/boards/list/${board.id}`)
}
</script>

<style scoped>
.table-header {
  @apply px-4 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-500;
}

.btn {
  @apply inline-flex items-center px-3 py-1 border rounded-md transition-colors duration-200;
}

.btn-icon {
  @apply w-4 h-4 mr-1;
}
</style> 