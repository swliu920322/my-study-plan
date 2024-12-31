<script setup lang="ts">
import { Button, Popconfirm } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { TypeItem } from '../composables/useType'

defineProps<{
  types: TypeItem[]
  selectedType: TypeItem | null
  subTypesCount: number
}>()

defineEmits<{
  (e: 'add'): void
  (e: 'select', type: TypeItem): void
  (e: 'edit', type: TypeItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="overflow-x-auto -mx-6 px-6">
    <div class="flex gap-6 min-w-max pb-4">
      <div v-for="type in types" :key="type.id"
        class="w-72 bg-white rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer"
        :class="selectedType?.id === type.id ? 'border-blue-500 border-2' : 'border-gray-100'"
        @click="$emit('select', type)">
        <div class="p-4 border-b border-gray-50">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium text-gray-800">{{ type.name }}</h3>
            <div class="flex items-center space-x-1">
              <Button type="text" size="small" @click.stop="$emit('edit', type)">
                <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
              </Button>
              <Popconfirm title="确定删除该类型吗？" description="删除大类将同时删除其下所有小类" @confirm.stop="$emit('delete', type.id)">
                <Button type="text" size="small" @click.stop>
                  <DeleteOutlined class="text-gray-400 hover:text-red-500 transition-colors" />
                </Button>
              </Popconfirm>
            </div>
          </div>
          <p class="text-sm text-gray-500 line-clamp-2">{{ type.description || '暂无描述' }}</p>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ subTypesCount }} 个小类</span>
            <RightOutlined :class="selectedType?.id === type.id ? 'rotate-90' : ''"
              class="transition-transform duration-300" />
          </div>
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
