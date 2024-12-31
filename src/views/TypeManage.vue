<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Empty,
  Popconfirm
} from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

interface TypeItem {
  id: string
  name: string
  description: string
  pId: string | null
}

const types = ref<TypeItem[]>([])
const selectedType = ref<TypeItem | null>(null)
const modalVisible = ref(false)
const isEditing = ref(false)

const form = ref({
  name: '',
  description: '',
  pId: null as string | null
})

// 获取所有大类
const mainTypes = computed(() => {
  return types.value.filter(type => !type.pId)
})

// 获取选中大类的子类
const subTypes = computed(() => {
  if (!selectedType.value) return []
  return types.value.filter(type => type.pId === selectedType.value?.id)
})

const handleAdd = (pId: string | null = null) => {
  isEditing.value = false
  form.value = {
    name: '',
    description: '',
    pId
  }
  modalVisible.value = true
}

const handleEdit = (type: TypeItem) => {
  isEditing.value = true
  form.value = { ...type }
  modalVisible.value = true
}

const handleDelete = (id: string) => {
  // 如果是大类，同时删除其下的所有小类
  types.value = types.value.filter(type => type.id !== id && type.pId !== id)
  if (selectedType.value?.id === id) {
    selectedType.value = null
  }
  message.success('删除成功')
}

const handleSubmit = () => {
  const data = {
    ...form.value,
    id: isEditing.value ? form.value.id : Date.now().toString()
  }

  if (isEditing.value) {
    const index = types.value.findIndex(t => t.id === data.id)
    if (index > -1) {
      types.value[index] = data as TypeItem
    }
  } else {
    types.value.push(data as TypeItem)
  }

  modalVisible.value = false
  message.success(isEditing.value ? '编辑成功' : '添加成功')
}

const selectType = (type: TypeItem) => {
  selectedType.value = type
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">类型管理</h1>
      <Button type="primary" @click="handleAdd()">
        <template #icon>
          <PlusOutlined />
        </template>
        新增大类
      </Button>
    </div>

    <!-- 大类卡片列表 -->
    <div class="overflow-x-auto -mx-6 px-6">
      <div class="flex gap-6 min-w-max pb-4">
        <div v-for="type in mainTypes" :key="type.id"
          class="w-72 bg-white rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer"
          :class="selectedType?.id === type.id ? 'border-blue-500 border-2' : 'border-gray-100'"
          @click="selectType(type)">
          <div class="p-4 border-b border-gray-50">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-medium text-gray-800">{{ type.name }}</h3>
              <div class="flex items-center space-x-1">
                <Button type="text" size="small" @click.stop="handleEdit(type)">
                  <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
                </Button>
                <Popconfirm title="确定删除该类型吗？" description="删除大类将同时删除其下所有小类" @confirm="handleDelete(type.id)">
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
              <span>{{ subTypes.length }} 个小类</span>
              <RightOutlined :class="selectedType?.id === type.id ? 'rotate-90' : ''"
                class="transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小类列表 -->
    <div v-if="selectedType" class="bg-gray-50 rounded-lg p-6 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-800">
          {{ selectedType.name }} 的子类
        </h2>
        <Button type="primary" ghost @click="handleAdd(selectedType.id)">
          <template #icon>
            <PlusOutlined />
          </template>
          添加子类
        </Button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="subType in subTypes" :key="subType.id"
          class="bg-white rounded-lg p-4 border border-gray-100 transition-all duration-300 hover:shadow-sm">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 mb-2">{{ subType.name }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2">{{ subType.description || '暂无描述' }}</p>
            </div>
            <div class="flex items-center space-x-1">
              <Button type="text" size="small" @click="handleEdit(subType)">
                <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
              </Button>
              <Popconfirm title="确定删除该类型吗？" @confirm="handleDelete(subType.id)">
                <Button type="text" size="small">
                  <DeleteOutlined class="text-gray-400 hover:text-red-500 transition-colors" />
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>

      <Empty v-if="subTypes.length === 0" description="暂无子类" />
    </div>

    <!-- 表单弹窗 -->
    <Modal :title="(isEditing ? '编辑' : '新增') + (form.pId ? '子类' : '大类')" v-model:visible="modalVisible"
      @ok="handleSubmit">
      <Form layout="vertical">
        <Form.Item label="名称" required>
          <Input v-model:value="form.name" placeholder="请输入类型名称" />
        </Form.Item>
        <Form.Item label="描述">
          <Input.TextArea v-model:value="form.description" placeholder="请输入类型描述" :rows="4" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
