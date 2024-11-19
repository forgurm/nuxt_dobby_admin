<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">회원 관리</h1>
    
    <!-- 회원 추가 버튼 -->
    <button @click="goToAddMember" class="bg-blue-500 text-white px-4 py-2 rounded-lg">회원 추가</button>
    
    <!-- 검색 조건 -->
    <div class="flex space-x-4 mt-4">
      <select v-model="filters.status" class="border p-2 rounded">
        <option value="">상태 선택</option>
        <option value="active">활성</option>
        <option value="inactive">비활성</option>
      </select>
      
      <select v-model="filters.level" class="border p-2 rounded">
        <option value="">레벨 선택</option>
        <option v-for="level in 9" :key="level" :value="level">레벨 {{ level }}</option>
      </select>
      
      <input v-model="filters.search" type="text" placeholder="검색어 입력" class="border p-2 rounded" />
      
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">초기화</button>
    </div>
    
    <!-- 회원 리스트 -->
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2">아이디</th>
          <th class="py-2">이름</th>
          <th class="py-2">이메일아이디</th>
          <th class="py-2">거래소</th>
          <th class="py-2">레퍼럴 코드</th>
          <th class="py-2">상태</th>
          <th class="py-2">레벨</th>
          <th class="py-2">작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in filteredMembers" :key="member.id">
          <td class="border px-4 py-2">{{ member.id }}</td>
          <td class="border px-4 py-2">{{ member.name }}</td>
          <td class="border px-4 py-2">{{ member.emailid }}</td>
          <td class="border px-4 py-2">{{ member.exchange }}</td>
          <td class="border px-4 py-2">{{ member.referralCode }}</td>
          <td class="border px-4 py-2">{{ member.status }}</td>
          <td class="border px-4 py-2">{{ member.level }}</td>
          <td class="border px-4 py-2">
            <button @click="editMember(member.emailid)" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">수정</button>
            <button @click="deleteMember(member.emailid)" class="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const members = ref([])

const filters = ref({
  status: '',
  level: '',
  search: '',
})

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    return (!filters.value.status || member.status === filters.value.status) &&
           (!filters.value.level || member.level === parseInt(filters.value.level)) &&
           (!filters.value.search || member.name.includes(filters.value.search) || member.emailid.includes(filters.value.search))
  })
})

function resetFilters() {
  filters.value = { status: '', level: '', search: '' }
}

function goToAddMember() {
  router.push('/members/add')
}

function editMember(emailid) {
  router.push(`/members/${emailid}`)
}

async function deleteMember(emailid) {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await fetch(`/api/members/${emailid}`, { method: 'DELETE' })
      members.value = members.value.filter(member => member.emailid !== emailid)
    } catch (error) {
      console.error('삭제 오류:', error)
    }
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/api/members/list')
    members.value = await response.json()
  } catch (error) {
    console.error('API 호출 오류:', error)
  }
})
</script>

<style scoped>
/* 추가 스타일링 */
</style> 