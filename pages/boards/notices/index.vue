<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">공지사항 관리</h1>
      <button 
        @click="openAddModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        공지사항 작성
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

    <!-- 공지사항 목록 -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노출 타입</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">만료일</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="notice in notices" :key="notice.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <span v-if="notice.exposure_type === 'FIXED'" class="mr-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">고정</span>
                {{ notice.title }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-red-100 text-red-800': notice.exposure_type === 'FIXED',
                      'bg-green-100 text-green-800': notice.exposure_type === 'NORMAL'
                    }">
                {{ getExposureType(notice.exposure_type) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ notice.expire_date ? formatDate(notice.expire_date) : '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(notice.created_at) }}
            </td>
            <td class="px-6 py-4 text-sm text-center">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="openEditModal(notice)"
                  class="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  수정
                </button>
                <button 
                  @click="handleDelete(notice.id)"
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
  </div>
</template>

<script setup lang="ts">
interface Notice {
  id: number;
  title: string;
  exposure_type: string;
  board_ids: string;
  expire_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Notice[];
  message?: string;
}

const notices = ref<Notice[]>([])
const pending = ref(false)
const error = ref<string | null>(null)

const router = useRouter()

// 노출 타입 변환
const getExposureType = (type: string) => {
  const types: Record<string, string> = {
    'FIXED': '상단고정',
    'NORMAL': '일반'
  }
  return types[type] || type
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

// 공지사항 목록 조회
const fetchNotices = async () => {
  pending.value = true
  error.value = null
  
  try {
    const response = await $fetch<ApiResponse>('/api/boards/notices/list')
    if (response.success && response.data) {
      notices.value = response.data
    } else {
      error.value = response.message || '공지사항 목록을 불러오는데 실패했습니다.'
    }
  } catch (err) {
    console.error('공지사항 목록 조회 실패:', err)
    error.value = '공지사항 목록을 불러오는데 실패했습니다.'
  } finally {
    pending.value = false
  }
}

// 페이지 로드 시 목록 조회
onMounted(() => {
  fetchNotices()
})

// 추가 버튼 클릭 시
const openAddModal = () => {
  router.push('/boards/notices/new')
}

// 수정 버튼 클릭 시
const openEditModal = (notice: Notice) => {
  router.push(`/boards/notices/${notice.id}`)
}

// 삭제 처리
const handleDelete = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    const response = await $fetch<ApiResponse>(`/api/boards/notices/${id}`, {
      method: 'DELETE'
    });

    if (response.success) {
      await fetchNotices(); // 목록 새로고침
    } else {
      alert(response.message || '삭제에 실패했습니다.');
    }
  } catch (err) {
    console.error('공지사항 삭제 실패:', err);
    alert('삭제 중 오류가 발생했습니다.');
  }
};
</script> 