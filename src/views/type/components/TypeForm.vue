<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue'
import { Modal, Form, Input } from 'ant-design-vue'
import type { TypeItem } from '../composables/useType'

const props = defineProps<{
  visible: boolean
  isEditing: boolean
  initialValues?: Partial<TypeItem>
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

// 监听visible变化，重置表单
watch(
  () => props.visible,
  (visible) => {
    resetFields()
    if (visible && props.initialValues) {
      Object.assign(modelRef, props.initialValues)
    }
  }
)

const handleSubmit = () => {
  validate()
    .then(() => {
      const rawData = toRaw(modelRef)
      emit('submit', rawData)
      emit('update:visible', false)
    })
    .catch((err) => {
      console.error('表单验证失败:', err)
    })
}


</script>

<template>
  <Modal :title="(isEditing ? '编辑' : '新增') + (modelRef.pId ? '子类' : '大类')" :visible="visible"
    @update:visible="$emit('update:visible', $event)" @ok="handleSubmit">
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
