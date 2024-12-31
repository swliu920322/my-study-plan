<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from 'ant-design-vue'

// 看板数据
const boards = ref([
  {
    id: 'todo',
    title: '待完成',
    tasks: []
  },
  {
    id: 'in-progress',
    title: '进行中',
    tasks: []
  },
  {
    id: 'completed',
    title: '已完成',
    tasks: []
  }
])

// 进度数据
const progress = ref({
  total: 0,
  today: 0,
  remainingDays: 30
})
</script>

<template>
  <main class="p-6 min-h-screen bg-gray-50">
    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧区域：统计卡片和看板 -->
      <div class="col-span-12 lg:col-span-8 space-y-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">目标管理</h3>
        <!-- 顶部统计区域 -->
        <div class="grid grid-cols-2 bg-white p-4 rounded-lg lg:grid-cols-4 gap-4">
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">总体进度</h3>
            <a-progress type="circle" :percent="65" :size="80" />
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">今日进度</h3>
            <a-progress type="circle" :percent="35" :size="80" />
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">剩余时间</h3>
            <p class="mt-4 text-2xl font-semibold text-gray-900">{{ progress.remainingDays }}天</p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">今日专注</h3>
            <p class="mt-4 text-2xl font-semibold text-gray-900">2小时30分</p>
          </div>
        </div>

        <!-- 看板区域 -->
        <h3 class="text-2xl font-bold text-gray-800 mb-6">任务看板</h3>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="board in boards" :key="board.id"
            class="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">{{ board.title }}</h2>
              <span class="text-sm text-gray-500">0</span>
            </div>
            <div class="space-y-3 min-h-80">
              <!-- 这里后续会添加任务卡片 -->
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域：日历和激励语 -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <!-- 日历区域 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <Calendar class="custom-calendar" :fullscreen="false" />
        </div>

        <!-- 激励语录 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-lg text-gray-600 italic leading-relaxed">
            "学习是一个持续不断的旅程，每一小步都是向着目标迈进。"
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="postcss"></style>
