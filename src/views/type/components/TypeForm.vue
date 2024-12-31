<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue'
import { Modal, Form, Input } from 'ant-design-vue'
import type { TypeItem } from '@/core/models'

const props = defineProps<{
  visible: boolean
  isEditing: boolean
  initialValues?: Partial<TypeItem>
  parentType?: TypeItem
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'submit', data: Omit<TypeItem, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const modelRef = reactive({
  name: '',
  description: '',
  pId: null as string | null
})

const rulesRef = reactive({
  name: [{ required: true, message: '请输入类型名称' }]
})

const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

// 重置表单数据
const resetForm = () => {
  Object.assign(modelRef, {
    name: '',
    description: '',
    pId: props.parentType?.id || null
  })
}

// 设置表单数据
const setFormData = () => {
  if (props.initialValues) {
    Object.assign(modelRef, {
      ...props.initialValues,
      pId: props.isEditing ? props.initialValues.pId : props.parentType?.id || null
    })
  } else {
    resetForm()
  }
}

// 监听表单数据变化
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      setFormData()
    }
  }
)

// 监听父类型变化
watch(
  () => props.parentType,
  () => {
    if (props.visible && !props.isEditing) {
      modelRef.pId = props.parentType?.id || null
    }
  }
)

const handleSubmit = () => {
  validate()
    .then(() => {
      const rawData = toRaw({
        ...modelRef,
        pId: props.isEditing ? modelRef.pId : (props.parentType?.id || null)
      })
      emit('submit', rawData)
      emit('update:visible', false)
      resetForm()
    })
    .catch((err) => {
      console.error('表单验证失败:', err)
    })
}

const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}

// 获取表单标题
const getFormTitle = () => {
  const action = props.isEditing ? '编辑' : '新增'
  const type = props.isEditing ? (modelRef.pId ? '子类' : '大类') : (props.parentType ? '子类' : '大类')
  return `${action}${type}`
}
</script>

<template>
  <Modal :title="getFormTitle()" :visible="visible" @update:visible="handleCancel" @ok="handleSubmit">
    <Form layout="vertical">
      <Form.Item label="名称" v-bind="validateInfos.name">
        <Input v-model:value="modelRef.name" placeholder="请输入类型名称" />
      </Form.Item>
      <Form.Item label="描述">
        <Input.TextArea v-model:value="modelRef.description" placeholder="请输入类型描述" :rows="4" />
      </Form.Item>
    </Form>
  </Modal>
</template>
