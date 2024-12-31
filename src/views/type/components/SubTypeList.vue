<script setup lang="ts">
import { Button, Empty, Popconfirm } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { TypeItem } from '@/core/models'

defineProps<{
  parentType: TypeItem
  types: TypeItem[]
}>()

defineEmits<{
  (e: 'add'): void
  (e: 'edit', type: TypeItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6 space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-800">
        {{ parentType.name }} 的子类
      </h2>
      <Button type="primary" ghost @click="$emit('add')">
        <template #icon>
          <PlusOutlined />
        </template>
        添加子类
      </Button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="type in types" :key="type.id"
        class="bg-white rounded-lg p-4 border border-gray-100 transition-all duration-300 hover:shadow-sm">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-800 mb-2">{{ type.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ type.description || '暂无描述' }}</p>
          </div>
          <div class="flex items-center space-x-1">
            <Button type="text" size="small" @click="$emit('edit', type)">
              <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
            </Button>
            <Popconfirm title="确定删除该类型吗？" @confirm="$emit('delete', type.id)">
              <Button type="text" size="small">
                <DeleteOutlined class="text-gray-400 hover:text-red-500 transition-colors" />
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>

    <Empty v-if="types.length === 0" description="暂无子类" />
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
