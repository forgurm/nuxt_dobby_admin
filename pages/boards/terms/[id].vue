<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEdit ? '약관 수정' : '약관 작성' }}</h1>
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

      <!-- 노전 및 필수 동의 설정 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">버전</label>
          <input 
            v-model="formData.version"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 1.0"
          >
        </div>

        <div class="flex items-center">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox"
              v-model="formData.is_required"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <span class="text-sm font-medium text-gray-700">필수 동의</span>
          </label>
        </div>
      </div>

      <!-- 에디터 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
        <ClientOnly>
          <div ref="editorElement" class="border rounded-lg"></div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.params.id !== 'new')

interface FormData {
  title: string;
  content: string;
  version: string;
  is_required: boolean;
}

const formData = ref<FormData>({
  title: '',
  content: '',
  version: '1.0',
  is_required: false
})

const { $initEditor } = useNuxtApp()
const editorElement = ref<HTMLElement | null>(null)
let editor: any = null

// 에디터 초기화
onMounted(() => {
  nextTick(() => {
    if (editorElement.value) {
      editor = $initEditor(editorElement.value, {
        initialValue: formData.value.content || '',
        events: {
          change: () => {
            formData.value.content = editor.getHTML()
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

interface TermResponse {
  success: boolean;
  data?: {
    id: number;
    title: string;
    content: string;
    version: string;
    is_required: boolean;
    created_at: string;
    updated_at: string;
  };
  message?: string;
}

// 약관 상세 조회
const fetchTerm = async (id: string) => {
  try {
    const response = await $fetch<TermResponse>(`/api/boards/terms/${id}`)
    if (response.success && response.data) {
      formData.value = {
        title: response.data.title,
        content: response.data.content,
        version: response.data.version,
        is_required: response.data.is_required
      }
      
      if (editor) {
        editor.setHTML(response.data.content || '')
      }
    }
  } catch (err) {
    console.error('약관 조회 실패:', err)
    alert('약관을 불러오는데 실패했습니다.')
  }
}

// 폼 제출
const handleSubmit = async () => {
  try {
    const url = isEdit.value 
      ? `/api/boards/terms/${route.params.id}`
      : '/api/boards/terms/0';
    
    const method = isEdit.value ? 'PUT' : 'POST';

    // 전송할 데이터 구성
    const submitData = {
      title: formData.value.title,
      content: formData.value.content,
      version: formData.value.version,
      is_required: formData.value.is_required
    };

    console.log('Submitting data:', submitData); // 전송 데이터 로깅

    const response = await $fetch<{success: boolean, message?: string}>(url, {
      method,
      body: submitData
    });

    console.log('Server response:', response); // 서버 응답 로깅

    if (response.success) {
      router.push('/boards/terms');
    } else {
      alert(response.message || '저장에 실패했습니다.');
    }
  } catch (err) {
    console.error('약관 저장 실패:', err);
    alert('저장에 실패했습니다.');
  }
};

onMounted(async () => {
  if (isEdit.value) {
    await fetchTerm(route.params.id as string)
  }
})
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