<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold mb-4">레퍼럴 관리</h1>
    <div class="bg-white rounded-lg shadow h-[calc(100vh-10rem)]">
      <iframe 
        src="https://affiliates.bybit.com/v2/affiliate-portal/login"
        class="w-full h-full rounded-lg"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped>
iframe {
  min-height: 800px;
}
</style> 