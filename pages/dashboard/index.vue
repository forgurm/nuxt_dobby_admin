<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">대시보드</h1>
    
    <!-- 그리드 레이아웃 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- 활성화된 클라이언트 수 -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">활성화된 클라이언트 수</h2>
        <p class="text-2xl font-bold">{{ stats?.activeClients }}</p>
      </div>
      
      <!-- 회원수 카드 -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">회원수</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-blue-700">전체</h3>
            <p class="text-2xl font-bold text-blue-900">{{ stats?.members?.total }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-green-700">레퍼럴 사용자</h3>
            <p class="text-2xl font-bold text-green-900">{{ stats?.members?.inactive }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-yellow-700">미사용자</h3>
            <p class="text-2xl font-bold text-yellow-900">{{ stats?.members?.inactive }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-purple-700">영업</h3>
            <p class="text-2xl font-bold text-purple-900">{{ stats?.members?.active }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-lg text-center">
            <h3 class="text-lg font-medium text-red-700">차단</h3>
            <p class="text-2xl font-bold text-red-900">{{ stats?.members?.inactive }}</p>
          </div>
        </div>
      </div>
      
      <!-- 레퍼럴 일자별 수익 차트 -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">레퍼럴 일자별 수익 차트</h2>
        <!-- 차트 컴포넌트 자리 -->
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-gray-500">차��� 자리</span>
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
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface DashboardStats {
  activeClients: number;
  members: {
    total: number;
    active: number;
    inactive: number;
  };
  symbols: {
    total: number;
    empty: number;
    exchanges: {
      name: string;
      count: number;
      nullCount: number;
    }[];
  };
  bots: {
    total: number;
    active: number;
    inactive: number;
  };
}

const stats = ref<DashboardStats | null>(null);
const chartRef = ref<HTMLCanvasElement | null>(null);
let symbolChart: Chart | null = null;

async function initializeChart() {
  if (!chartRef.value || !stats.value?.symbols.exchanges) return;

  const exchanges = stats.value.symbols.exchanges;
  
  if (symbolChart) {
    symbolChart.destroy();
  }

  symbolChart = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: exchanges.map(ex => ex.name),
      datasets: [
        {
          label: '전체 심볼',
          data: exchanges.map(ex => ex.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          barPercentage: 1.0,
          categoryPercentage: 0.8
        },
        {
          label: '미설정 심볼',
          data: exchanges.map(ex => ex.nullCount),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          barPercentage: 1.0,
          categoryPercentage: 0.8
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          stacked: false,
          title: {
            display: true,
            text: '심볼 수'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: '거래소'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: '거래소별 심볼 현황'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.x;
              const total = exchanges[context.dataIndex].count;
              if (label === '미설정 심볼') {
                return `${label}`;
              }
              return `${label}: ${value}`;
            }
          }
        },
        datalabels: {
          color: '#000',
          font: {
            weight: 'bold'
          },
          formatter: function(value, context) {
            const total = exchanges[context.dataIndex].count;
            if (context.dataset.label === '미설정 심볼') {
              return `${value}`;
            }
            return value;
          },
          anchor: 'center',
          align: 'center',
          clamp: true,
          clip: true,
          display: function(context) {
            return context.dataset.data[context.dataIndex] > 0;
          }
        }
      }
    }
  });
}

async function fetchData() {
  try {
    const response = await $fetch<{
      success: boolean;
      data: DashboardStats;
    }>('/api/dashboard/stats');
    
    if (response.success) {
      stats.value = response.data;
      await initializeChart();  // 데이터 로드 후 차트 초기화
    }
  } catch (error) {
    console.error('대시보드 통계 로딩 오류:', error);
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style> 