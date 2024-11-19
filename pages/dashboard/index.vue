<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">대시보드</h1>
    
    <!-- 그리드 레이아웃 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- 활성화된 클라이언트 수 -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">활성화된 클라이언트 수</h2>
        <p class="text-2xl font-bold">{{ counts.active_client }}</p>
      </div>
      
      <!-- 회원수 카드 -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">회원수</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-blue-700">전체</h3>
            <p class="text-2xl font-bold text-blue-900">{{ counts.total }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-green-700">레퍼럴 사용자</h3>
            <p class="text-2xl font-bold text-green-900">{{ counts.referral }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-yellow-700">미사용자</h3>
            <p class="text-2xl font-bold text-yellow-900">{{ counts.inactive }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-purple-700">영업</h3>
            <p class="text-2xl font-bold text-purple-900">{{ counts.sales }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-red-700">차단</h3>
            <p class="text-2xl font-bold text-red-900">{{ counts.blocked }}</p>
          </div>
        </div>
      </div>
      
      <!-- 레퍼럴 일자별 수익 차트 -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">레퍼럴 일자별 수익 차트</h2>
        <!-- 차트 컴포넌트 자리 -->
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-gray-500">차트 자리</span>
        </div>
      </div>
      
      <!-- 거래소별 심볼 차트 -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">거래소별 심볼 차트</h2>
        <div class="chart-container">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js'
import type { ChartType, ChartData, ChartOptions } from 'chart.js'
import { BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip)

// 차트 캔버스 ref
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

interface CountsData {
  total: number
  referral: number
  inactive: number
  sales: number
  blocked: number
  active_client: number
}

const counts = ref<CountsData>({
  total: 0,
  referral: 0,
  inactive: 0,
  sales: 0,
  blocked: 0,
  active_client: 0,
})

// 차트 생성 함수
const createChart = (labels: string[], nullCounts: number[], totalCounts: number[]) => {
  if (!chartRef.value) return
  
  // 기존 차트가 있다면 제거
  if (chart) {
    chart.destroy()
  }

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'bar' as ChartType,
    data: {
      labels,
      datasets: [
        {
          label: 'Null Symbol Names',
          data: nullCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Total Symbols',
          data: totalCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '거래소별 심볼 통계',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        }
      }
    },
  })
}

// 데이터 로드 및 차트 초기화
const initializeChart = async () => {
  try {
    const response = await fetch('/api/symbols')
    const data = await response.json()
    const labels = [...new Set(data.map(item => item.exchange_name))]
    const nullCounts = labels.map(label => 
      data.filter(item => item.exchange_name === label && (!item.symbol_name || item.symbol_name === '')).length
    )
    const totalCounts = labels.map(label => 
      data.filter(item => item.exchange_name === label).length
    )

    createChart(labels, nullCounts, totalCounts)
  } catch (error) {
    console.error('심볼 API 호출 오류:', error)
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/api/members/count')
    const data = await response.json()
    counts.value = data
  } catch (error) {
    console.error('API 호출 오류:', error)
  }

  // 차트 초기화는 별도 함수로 분리
  await initializeChart()
})

// 컴포넌트가 제거될 때 차트 정리
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style> 