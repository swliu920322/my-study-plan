<script setup lang="ts">
import { Button, Tag, Popconfirm } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { Task } from '../goal.type'

defineProps<{
  tasks: Task[]
  title?: string
}>()

defineEmits<{
  (e: 'add'): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="space-y-1">
        <h3 class="text-lg font-medium text-gray-800">{{ title || '任务列表' }}</h3>
        <p class="text-sm text-gray-500">共 {{ tasks.length }} 个任务</p>
      </div>
      <Button type="primary" @click="$emit('add')">
        <template #icon>
          <PlusOutlined />
        </template>
        添加任务
      </Button>
    </div>

    <div class="space-y-4">
      <div v-for="task in tasks" :key="task.id"
        class="bg-white rounded-lg p-4 border border-gray-100 transition-all duration-300 hover:shadow-sm">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-800">{{ task.name }}</h3>
              <Tag :color="task.type === 'study' ? 'blue' : task.type === 'work' ? 'green' : 'orange'">
                {{ task.type }}
              </Tag>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ dayjs(task.date).format('MM-DD') }}</span>
              <span class="text-sm text-gray-500">{{ task.duration }}分钟</span>
            </div>
          </div>
          <Popconfirm title="确定删除该任务吗？" @confirm="$emit('delete', task.id)">
            <Button type="text" size="small" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>
