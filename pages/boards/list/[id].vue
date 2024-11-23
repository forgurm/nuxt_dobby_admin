<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ board?.name || '게시판' }} 글목록</h1>
      <button 
        @click="openAddModal"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        글쓰기
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

    <!-- 게시글 목록 -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ post.title }}</td>
            <td class="px-6 py-4">{{ post.author }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(post.created_at) }}
            </td>
            <td class="px-6 py-4 text-sm text-center">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="openEditModal(post)"
                  class="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  수정
                </button>
                <button 
                  @click="handleDelete(post.id)"
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
const route = useRoute()
const router = useRouter()

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Board {
  id: number;
  name: string;
  type_code: string;
}

interface ApiResponse {
  success: boolean;
  data?: Post[] | Board;
  message?: string;
}

const posts = ref<Post[]>([])
const board = ref<Board | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

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

// 게시판 정보 조회
const fetchBoard = async () => {
  try {
    const response = await $fetch<ApiResponse>(`/api/boards/list/${route.params.id}`)
    if (response.success && response.data) {
      board.value = response.data as Board
    }
  } catch (err) {
    console.error('게시판 정보 조회 실패:', err)
  }
}

// 게시글 목록 조회
const fetchPosts = async () => {
  pending.value = true
  error.value = null
  
  try {
    const response = await $fetch<ApiResponse>(`/api/boards/list/${route.params.id}/posts`)
    if (response.success && response.data) {
      posts.value = response.data as Post[]
    } else {
      error.value = response.message || '게시글 목록을 불러오는데 실패했습니다.'
    }
  } catch (err) {
    console.error('게시글 목록 조회 실패:', err)
    error.value = '게시글 목록을 불러오는데 실패했습니다.'
  } finally {
    pending.value = false
  }
}

// 글쓰기 버튼 클릭 시
const openAddModal = () => {
  router.push(`/boards/list/${route.params.id}/posts/new`)
}

// 수정 버튼 클릭 시
const openEditModal = (post: Post) => {
  router.push(`/boards/list/${route.params.id}/posts/${post.id}`)
}

// 삭제 처리
const handleDelete = async (postId: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    const response = await $fetch<ApiResponse>(`/api/boards/list/${route.params.id}/posts/${postId}`, {
      method: 'DELETE'
    });

    if (response.success) {
      await fetchPosts(); // 목록 새로고침
    } else {
      alert(response.message || '삭제에 실패했습니다.');
    }
  } catch (err) {
    console.error('게시글 삭제 실패:', err);
    alert('삭제 중 오류가 발생했습니다.');
  }
};

// 페이지 로드 시 데이터 조회
onMounted(async () => {
  await fetchBoard()
  await fetchPosts()
})
</script> 