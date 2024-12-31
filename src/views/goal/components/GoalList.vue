<script setup lang="ts">
import { Button, Card, Popconfirm, Progress } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import type { Goal } from '../goal.type'

defineProps<{
  goals: Goal[]
  getGoalTasks: (goalId: string) => { length: number }[]
}>()

defineEmits<{
  (e: 'edit', goal: Goal): void
  (e: 'delete', id: string): void
  (e: 'view-tasks', goal: Goal): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="goal in goals" :key="goal.id"
      class="bg-white rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div class="p-4">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-medium text-gray-800">{{ goal.name }}</h3>
          <div class="flex items-center space-x-1">
            <Button type="text" size="small" @click="$emit('edit', goal)">
              <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
            </Button>
            <Popconfirm title="确定删除该目标吗？" @confirm="$emit('delete', goal.id)">
              <Button type="text" size="small">
                <DeleteOutlined class="text-gray-400 hover:text-red-500 transition-colors" />
              </Button>
            </Popconfirm>
          </div>
        </div>
        <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ goal.description || '暂无描述' }}</p>
        <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{{ goal.startDate }} ~ {{ goal.endDate }}</span>
          <span>{{ getGoalTasks(goal.id).length }} 个任务</span>
        </div>
        <div class="flex justify-between items-center">
          <Progress :percent="goal.progress" size="small" class="flex-1 mr-4" />
          <Button type="link" size="small" @click="$emit('view-tasks', goal)">
            <UnorderedListOutlined />查看任务
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
