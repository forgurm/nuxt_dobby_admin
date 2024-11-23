<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEdit ? '공지사항 수정' : '공지사항 작성' }}</h1>
      <div class="space-x-2">
        <button 
          @click="handleSubmit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ isEdit ? '수정하기' : '등록하기' }}
        </button>
        <button 
          @click="router.back()"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          취소
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <!-- 제목 입력 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
        <input 
          v-model="formData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="제목을 입력하세요"
        >
      </div>

      <!-- 노출 설정 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">노출 타입</label>
          <select 
            v-model="formData.exposure_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="type in exposureTypes" 
                    :key="type.value" 
                    :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">게시판 선택</label>
          <div class="border rounded-lg p-3 max-h-48 overflow-y-auto">
            <div v-for="board in boards" 
                 :key="board.id" 
                 class="flex items-center mb-2 last:mb-0"
            >
              <input 
                type="checkbox"
                :id="`board-${board.id}`"
                :value="board.id"
                v-model="formData.board_ids"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label :for="`board-${board.id}`" class="ml-2 block text-sm text-gray-900">
                {{ board.name }}
              </label>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-500">게시판을 여러 개 선택할 수 있습니다.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">만료일</label>
          <input 
            v-model="formData.expire_date"
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>

      <!-- 에디터 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
        <ClientOnly>
          <div ref="editorElement" class="border rounded-lg"></div>
        </ClientOnly>
      </div>

      <!-- 파일 첨부 영역 추가 -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500">
                <span class="font-semibold">클릭</span>하여 파일을 선택하거나
                <br>파일을 여기에 끌어다 놓으세요
              </p>
              <p class="text-xs text-gray-500">최대 10개 파일, 각 100MB 이하</p>
            </div>
            <input 
              type="file" 
              class="hidden" 
              multiple 
              @change="handleFileSelect"
              accept="*/*"
            >
          </label>
        </div>

        <!-- 선택된 파일 목록 -->
        <div v-if="selectedFiles.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">선택된 파일</h4>
          <ul class="space-y-2">
            <li v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span class="text-sm text-gray-600">{{ file.name }}</span>
              <button 
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <!-- 기존 첨부 파일 목록 (수정 시) -->
        <div v-if="formData.file_urls && formData.file_urls.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">첨부된 파일</h4>
          <ul class="space-y-2">
            <li v-for="(file, index) in formData.file_urls" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <a 
                :href="file.path" 
                target="_blank" 
                class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ file.originalName }}
                <span class="ml-2 text-xs text-gray-500">
                  ({{ formatFileSize(file.size) }})
                </span>
              </a>
              <button 
                @click="removeExistingFile(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.params.id !== 'new')

interface FormData {
  title: string;
  content: string;
  html_content: string;
  exposure_type: string;
  board_ids: number[];
  expire_date: string | null;
  file_urls: Array<{
    originalName: string;
    filename: string;
    path: string;
    size: number;
    type: string;
  }>;
}

const formData = ref<FormData>({
  title: '',
  content: '',
  html_content: '',
  exposure_type: 'NONE',
  board_ids: [],
  expire_date: null,
  file_urls: []
})

const { $initEditor } = useNuxtApp()
const editorElement = ref<HTMLElement | null>(null)
let editor: any = null

const boards = ref<any[]>([])

// 노출 타입 옵션 추가
const exposureTypes = [
  { value: 'NONE', label: '없음' },
  { value: 'NORMAL', label: '일반' },
  { value: 'FIXED', label: '상단고정' }
]

// 파일 관련 상태
const selectedFiles = ref<File[]>([])

// 파일 선택 핸들러
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    // 기존 선택된 파일과 새로 선택된 파일 합치기
    const newFiles = Array.from(input.files);
    selectedFiles.value = [...selectedFiles.value, ...newFiles];
    
    // 파일 선택 초기화 (같은 파일 다시 선택 가능하도록)
    input.value = '';
  }
};

// 선택된 파일 제거
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// 기존 첨부 파일 제거
const removeExistingFile = (index: number) => {
  formData.value.file_urls.splice(index, 1)
}

// 에디터 옵기화
onMounted(() => {
  nextTick(() => {
    if (editorElement.value) {
      editor = $initEditor(editorElement.value, {
        initialValue: formData.value.content || '',
        events: {
          change: () => {
            formData.value.content = editor.getHTML()
            formData.value.html_content = editor.getHTML()
          }
        },
        hooks: {
          addImageBlobHook: async (blob: Blob, callback: Function) => {
            try {
              const formData = new FormData()
              formData.append('file', blob)

              const response = await $fetch('/api/common/upload', {
                method: 'POST',
                body: formData
              })

              if (response.success && response.data[0]) {
                callback(response.data[0].path, response.data[0].originalName)
              }
            } catch (error) {
              console.error('이미지 업로드 실패:', error)
              alert('이미지 업로드 실패했습니다.')
            }
          }
        }
      })
    }
  })
})

// 에디터 인스턴스 정리
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

// 게시판 목록 조회
const fetchBoards = async () => {
  try {
    const response = await $fetch('/api/boards/list/list')
    if (response.success) {
      boards.value = response.data
    }
  } catch (err) {
    console.error('게시판 목록 조회 실패:', err)
  }
}

interface NoticeResponse {
  success: boolean;
  data?: {
    id: number;
    title: string;
    content: string;
    html_content: string;
    exposure_type: string;
    board_ids: string;
    expire_date: string | null;
    created_at: string;
    updated_at: string;
    file_urls: Array<{
      originalName: string;
      filename: string;
      path: string;
      size: number;
      type: string;
    }>;
  };
  message?: string;
}

// 공지사항 상세 조회
const fetchNotice = async (id: string) => {
  try {
    const response = await $fetch<NoticeResponse>(`/api/boards/notices/${id}`)
    if (response.success && response.data) {
      const formatDateTime = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
      };

      // board_ids를 숫자 배열로 변환
      const boardIds = typeof response.data.board_ids === 'string' 
        ? JSON.parse(response.data.board_ids)
        : (Array.isArray(response.data.board_ids) ? response.data.board_ids : []);

      formData.value = {
        ...response.data,
        board_ids: boardIds,  // 변환된 board_ids 사용
        expire_date: formatDateTime(response.data.expire_date),
        file_urls: response.data.file_urls || []
      }
      
      if (editor) {
        editor.setHTML(response.data.content || '')
      }

      console.log('Loaded board_ids:', formData.value.board_ids); // 디버깅용
    }
  } catch (err) {
    console.error('공지사항 조회 실패:', err)
    alert('공지사항을 불러오는데 실패했습니다.')
  }
}

// 폼 제출
const handleSubmit = async () => {
  try {
    // 새로 선택된 파일들 업로드
    let uploadedFiles = [];
    if (selectedFiles.value.length > 0) {
      const uploadFormData = new FormData();
      selectedFiles.value.forEach(file => {
        uploadFormData.append('files', file);
      });

      const uploadResponse = await $fetch<{success: boolean, data: any[]}>('/api/common/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (uploadResponse.success) {
        uploadedFiles = uploadResponse.data;
      }
    }

    // 기존 파일과 새로 업로드된 파일 합치기
    const allFiles = [
      ...(formData.value.file_urls || []),
      ...uploadedFiles
    ];

    // 공지사항 저장
    const url = isEdit.value 
      ? `/api/boards/notices/${route.params.id}`
      : '/api/boards/notices/0';
    
    const method = isEdit.value ? 'PUT' : 'POST';

    console.log('Submitting board_ids:', formData.value.board_ids); // 디버깅용

    const response = await $fetch(url, {
      method,
      body: {
        ...formData.value,
        board_ids: formData.value.board_ids,  // 배열 그대로 전달
        file_urls: allFiles
      }
    });

    if (response.success) {
      router.push('/boards/notices');
    }
  } catch (err) {
    console.error('공지사항 저장 실패:', err);
    alert('저장에 실패했습니다.');
  }
};

// 체크박스 변경 이벤트 핸들러 추가
const handleBoardSelection = (boardId: number) => {
  const index = formData.value.board_ids.indexOf(boardId);
  if (index === -1) {
    formData.value.board_ids.push(boardId);
  } else {
    formData.value.board_ids.splice(index, 1);
  }
  console.log('Selected board_ids:', formData.value.board_ids); // 디버깅용
};

onMounted(async () => {
  await fetchBoards()
  if (isEdit.value) {
    await fetchNotice(route.params.id as string)
  }
})

// 파일 크기 포맷팅
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style>
.toastui-editor-defaultUI {
  border: none !important;
}

.toastui-editor-defaultUI-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.5rem;
}

.toastui-editor-main {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.toastui-editor-main .ProseMirror {
  padding: 1rem;
}
</style> 