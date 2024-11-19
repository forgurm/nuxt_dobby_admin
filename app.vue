<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* 전역 스타일이 있다면 제거하거나 수정 */
</style>

<script setup>
const router = useRouter()

// HMR 경로 무시 설정
router.beforeEach((to, from, next) => {
  if (to.path.includes('__webpack_hmr')) {
    return
  }
  next()
})

useHead({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
  ]
})
</script>
