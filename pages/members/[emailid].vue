<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">회원 수정</h1>
    
    <!-- 메시지 창 -->
    <div v-if="message" class="bg-red-100 text-red-700 p-4 rounded">
      {{ message }}
    </div>
    
    <!-- 입력 폼 -->
    <form @submit.prevent="updateMember" class="space-y-4">
      <div class="space-y-4">
        <input v-model="member.name" type="text" placeholder="이름 *" class="mt-1 block w-full border p-2 rounded" required />
        <input v-model="member.emailid" type="email" placeholder="이메일아이디 *" class="mt-1 block w-full border p-2 rounded" required />
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const member = ref({
  name: '',
  emailid: '',
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

onMounted(async () => {
  const memberId = route.params.emailid
  try {
    const response = await fetch(`/api/members/${memberId}`)
    const data = await response.json()
    //console.log(data)
    member.value = data
  } catch (error) {
    console.error('회원 정보 불러오기 오류:', error)
  }
})

function updateMember() {
  // 유효성 검사
  if (!member.value.name || !member.value.emailid || !member.value.phone) {
    message.value = '필수 입력 항목을 모두 입력해주세요.'
    return
  }
  
  // 회원 수정 로직 구현
  //console.log('회원 수정:', member.value)
  // 예시: 서버에 PUT 요청 보내기
  // await fetch(`/api/members/${route.params.id}`, { method: 'PUT', body: JSON.stringify(member.value) })
  router.push('/members')
}

function cancel() {
  router.push('/members')
}
</script>

<style scoped>
/* 추가 스타일링 */
</style> 