<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import TypeList from './components/TypeList.vue'
import SubTypeList from './components/SubTypeList.vue'
import TypeForm from './components/TypeForm.vue'
import { useType } from './composables/useType'
import { TypeItem } from '@/core/models'

const {
  mainTypes,
  selectedType,
  subTypes,
  selectType,
  addType,
  updateType,
  deleteType,
  loadTypes,
  getSubTypesCount
} = useType()

const modalVisible = ref(false)
const isEditing = ref(false)
const currentType = ref<TypeItem | null>(null)
const parentType = ref<TypeItem | null>(null)

// 初始化加载数据
loadTypes()

// 处理类型相关操作
const handleAdd = (parent: TypeItem | null = null) => {
  isEditing.value = false
  currentType.value = null
  parentType.value = parent
  modalVisible.value = true
}

const handleEdit = (type: TypeItem) => {
  isEditing.value = true
  currentType.value = { ...type }  // 创建副本
  // 如果是子类，设置其父类型
  if (type.pId) {
    parentType.value = selectedType.value
  } else {
    parentType.value = null
  }
  modalVisible.value = true
}

const handleSubmit = async (data: Omit<TypeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (isEditing.value && currentType.value) {
      await updateType(currentType.value.id, data)
    } else {
      await addType(data)
    }
    modalVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
  }
}
</script>

<template>
  <div class="p-6 space-y-6 overflow-hidden w-full h-full">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">类型管理</h1>
      <Button type="primary" @click="handleAdd()">
        <template #icon>
          <PlusOutlined />
        </template>
        新增大类
      </Button>
    </div>

    <!-- 大类列表 -->
    <TypeList :types="mainTypes" :selected-type="selectedType" :get-sub-types-count="getSubTypesCount"
      @select="selectType" @add="handleAdd" @edit="handleEdit" @delete="deleteType" />

    <!-- 小类列表 -->
    <SubTypeList v-if="selectedType" :parent-type="selectedType" :types="subTypes" @add="() => handleAdd(selectedType)"
      @edit="handleEdit" @delete="deleteType" />

    <!-- 表单 -->
    <TypeForm v-model:visible="modalVisible" :is-editing="isEditing" :initial-values="currentType"
      :parent-type="parentType" @submit="handleSubmit" />
  </div>
</template>
