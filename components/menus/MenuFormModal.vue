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
              <label class="block text-gray-700 text-sm font-bold mb-2">메뉴명</label>
              <input 
                type="text" 
                v-model="formData.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">메뉴 코드</label>
              <input 
                type="text" 
                v-model="formData.code"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">상위 메뉴</label>
              <select 
                v-model="formData.parent_id"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option :value="null">없음</option>
                <option v-for="menu in parentMenus" 
                        :key="menu.id" 
                        :value="menu.id"
                >
                  {{ menu.name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">필요 회원등급</label>
              <select 
                v-model="formData.user_level"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="0">전체</option>
                <option value="1">일반회원</option>
                <option value="5">영업</option>
                <option value="9">관리자</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">메뉴 경로</label>
              <input 
                type="text" 
                v-model="formData.path"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="mb-4">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="formData.is_visible"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-gray-700">노출 여부</span>
              </label>
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
  code: string;
  parent_id: number | null;
  level: number;
  sort_order: number;
  user_level: number;
  is_visible: boolean;
  path: string;
}

const props = defineProps<{
  show: boolean;
  isEdit: boolean;
  initialData?: FormData;
  menus: FormData[];
}>();

const emit = defineEmits(['close', 'submit']);

const formData = ref<FormData>({
  name: props.initialData?.name || '',
  code: props.initialData?.code || '',
  parent_id: props.initialData?.parent_id || null,
  level: props.initialData?.level || 1,
  sort_order: props.initialData?.sort_order || 0,
  user_level: props.initialData?.user_level || 0,
  is_visible: props.initialData?.is_visible ?? true,
  path: props.initialData?.path || ''
});

// 상위 메뉴로 선택 가능한 메뉴 목록 (현재 메뉴의 하위 메뉴는 제외)
const parentMenus = computed(() => {
  return props.menus.filter(menu => {
    if (!props.initialData) return true;
    return menu.id !== props.initialData.id;
  });
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
</script> 