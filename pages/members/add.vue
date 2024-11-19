<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">회원 추가</h1>
    
    <!-- 메시지 창 -->
    <div v-if="message" class="bg-red-100 text-red-700 p-4 rounded">
      {{ message }}
    </div>
    
    <!-- 입력 폼 -->
    <form @submit.prevent="saveMember" class="space-y-4">
      <div class="space-y-4">
        <input v-model="member.name" type="text" placeholder="이름 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.email" type="email" placeholder="이메일 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.password" type="password" placeholder="암호 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.confirmPassword" type="password" placeholder="암호 확인 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.phone" type="text" placeholder="전화번호 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.address1" type="text" placeholder="주소 1" class="mt-1 block w-full border p-2 rounded" />
        <input v-model="member.address2" type="text" placeholder="주소 2" class="mt-1 block w-full border p-2 rounded" />
        <input v-model="member.exchange" type="text" placeholder="거래소" class="mt-1 block w-full border p-2 rounded" />
        <input v-model="member.referralCode" type="text" placeholder="레퍼럴 코드" class="mt-1 block w-full border p-2 rounded" />
        <select v-model="member.status" class="mt-1 block w-full border p-2 rounded">
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
        <select v-model="member.level" class="mt-1 block w-full border p-2 rounded">
          <option v-for="level in 9" :key="level" :value="level">레벨 {{ level }}</option>
        </select>
        <textarea v-model="member.memo" placeholder="메모" class="mt-1 block w-full border p-2 rounded"></textarea>
        <input v-model="member.recommender" type="text" placeholder="추천인" class="mt-1 block w-full border p-2 rounded" />
      </div>
      
      <!-- 버튼 -->
      <div class="mt-6 flex space-x-4">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
        <button type="button" @click="cancel" class="bg-gray-300 px-4 py-2 rounded">취소</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const member = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address1: '',
  address2: '',
  exchange: '',
  referralCode: '',
  status: 'active',
  level: 1,
  memo: '',
  recommender: '',
})

const message = ref('')

async function saveMember() {
  // 유효성 검사
  if (!member.value.name || !member.value.email || !member.value.password || !member.value.phone) {
    message.value = '필수 입력 항목을 모두 입력해주세요.'
    return
  }
  if (member.value.password !== member.value.confirmPassword) {
    message.value = '암호가 일치하지 않습니다.'
    return
  }
  
  try {
    const response = await fetch('/api/members/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member.value)
    });
    const data = await response.json();
    if (data.success) {
      router.push('/members');
    } else {
      message.value = '회원 저장에 실패했습니다.';
    }
  } catch (error) {
    console.error('회원 저장 오류:', error);
    message.value = '회원 저장 중 오류가 발생했습니다.';
  }
}

function cancel() {
  router.push('/members')
}
</script>

<style scoped>
/* 추가 스타일링 */
</style> 