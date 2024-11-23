<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="show">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                게시판명
              </label>
              <input 
                type="text" 
                v-model="formData.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                게시판 타입
              </label>
              <select 
                v-model="formData.type_code"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option v-for="type in boardTypes" 
                        :key="type.code" 
                        :value="type.code"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ isEdit ? '수정' : '추가' }}
            </button>
            <button 
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="$emit('close')"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  name: string;
  type_code: string;
}

const props = defineProps<{
  show: boolean;
  isEdit: boolean;
  initialData?: FormData;
}>();

const emit = defineEmits(['close', 'submit']);

const formData = ref<FormData>({
  name: props.initialData?.name || '',
  type_code: props.initialData?.type_code || 'NORMAL'
});

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};

// 초기 데이터가 변경될 때 폼 데이터 업데이트
watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  }
}, { deep: true });

interface BoardType {
  code: string;
  name: string;
}

interface ApiResponse {
  success: boolean;
  data?: BoardType[];
  message?: string;
}

const boardTypes = ref<BoardType[]>([])

// 게시판 타입 목록 가져오기
const fetchBoardTypes = async () => {
  try {
    const response = await $fetch<ApiResponse>('/api/common/types')
    if (response.success && response.data) {
      boardTypes.value = response.data
    }
  } catch (err) {
    console.error('게시판 타입 조회 실패:', err)
  }
}

onMounted(() => {
  fetchBoardTypes()
})
</script> 