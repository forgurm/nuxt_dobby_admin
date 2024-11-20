<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">관리자 로그인</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md space-y-4">
          <div>
            <label for="id" class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              id="id"
              v-model="id"
              type="text"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            로그인
          </button>
        </div>

        <div v-if="errorMessage" class="mt-4 text-center text-sm text-red-600">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const id = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = useState('auth', () => false)
const userLevel = useState('userLevel', () => 0)

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { 
        id: id.value, 
        password: password.value 
      }
    })

    if (response.success) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userLevel', response.user?.lv?.toString() || '0')
      auth.value = true
      userLevel.value = response.user?.lv || 0
      await router.push('/dashboard')
    } else {
      errorMessage.value = response.message
    }
  } catch (error) {
    console.error('로그인 요청 오류:', error)
    errorMessage.value = '로그인 처리 중 오류가 발생했습니다.'
  }
}
</script>

<style scoped>
input, button {
  -webkit-tap-highlight-color: transparent;
}

/* iOS 스타일 초기화 */
input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* 자동완성 배경색 제거 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* 포커스 시 아웃라인 제거 */
input:focus {
  outline: none;
}
</style> 