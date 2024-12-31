<script setup lang="ts">
import { Calendar, Card, Badge } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { Task } from '../goal.type'

defineProps<{
  getDateTasks: (date: Dayjs) => Task[]
}>()

defineEmits<{
  (e: 'select', date: Dayjs): void
}>()
</script>

<template>
  <Card class="h-full rounded-lg shadow-sm overflow-hidden">
    <Calendar :fullscreen="false" @select="$emit('select', $event)">
      <template #dateCell="{ current }">
        <div class="h-full p-1">
          <div class="text-right mb-1">{{ current.date() }}</div>
          <ul class="list-none p-0 m-0">
            <template v-for="task in getDateTasks(current).slice(0, 2)" :key="task.id">
              <li class="text-xs truncate mb-1.5 pl-0.5">
                <Badge :status="task.type === 'study' ? 'processing' : task.type === 'work' ? 'success' : 'warning'"
                  :text="task.name" />
              </li>
            </template>
            <li v-if="getDateTasks(current).length > 2" class="text-xs text-gray-500 pl-0.5">
              +{{ getDateTasks(current).length - 2 }}
            </li>
          </ul>
        </div>
      </template>
    </Calendar>
  </Card>
</template>

<style scoped>
/* 日历样式优化 */
:deep(.ant-picker-calendar) {
  background: transparent;
}

:deep(.ant-picker-calendar-header) {
  padding-bottom: 0.5rem;
  margin: 0 24px;
}

:deep(.ant-picker-panel) {
  border: none;
}

:deep(.ant-picker-calendar-date) {
  height: auto !important;
  padding: 4px !important;
  margin: 0 4px;
}

:deep(.ant-picker-calendar-date-content) {
  height: auto !important;
  line-height: 1.4;
}

:deep(.ant-picker-cell) {
  padding: 4px 0;
}

:deep(.ant-badge-status-text) {
  font-size: 12px;
  line-height: 1.4;
}
</style>
