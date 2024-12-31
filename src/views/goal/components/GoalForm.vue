<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Modal, Form, Input, DatePicker } from 'ant-design-vue'
import type { Goal } from '../goal.type'

const props = defineProps<{
  visible: boolean
  initialValues?: Partial<Goal>
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'submit', data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const form = reactive({
  name: '',
  startDate: '',
  endDate: '',
  description: '',
  progress: 0
})

// 监听visible变化，重置表单
watch(
  () => props.visible,
  (visible) => {
    if (visible && props.initialValues) {
      Object.assign(form, props.initialValues)
    } else {
      Object.assign(form, {
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        progress: 0
      })
    }
  }
)

const handleSubmit = () => {
  emit('submit', { ...form })
  emit('update:visible', false)
}
</script>

<template>
  <Modal :title="initialValues ? '编辑目标' : '新增目标'" :visible="visible" @update:visible="$emit('update:visible', $event)"
    @ok="handleSubmit">
    <Form layout="vertical">
      <Form.Item label="目标名称" required>
        <Input v-model:value="form.name" placeholder="请输入目标名称" />
      </Form.Item>
      <Form.Item label="时间段" required>
        <DatePicker.RangePicker v-model:start-value="form.startDate" v-model:end-value="form.endDate" class="w-full" />
      </Form.Item>
      <Form.Item label="目标描述">
        <Input.TextArea v-model:value="form.description" placeholder="请输入目标描述" :rows="4" />
      </Form.Item>
    </Form>
  </Modal>
</template>
