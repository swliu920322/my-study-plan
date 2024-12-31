<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue'
import { Modal, Form, Input, DatePicker } from 'ant-design-vue'
import type { Goal, GoalForm } from '../goal.type'
import dayjs from 'dayjs';

const props = defineProps<{
  visible: boolean
  initialValues?: Partial<Goal>
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'submit', data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): void
}>()

const modelRef = reactive<GoalForm>({
  name: '',
  dateRange: [dayjs(), dayjs().add(1, 'month')],
  description: '',
})
const rulesRef = reactive({
  name: [{ required: true, message: '请输入目标名称' }],
  startDate: [{ required: true, message: '请选择时间段' }],
  endDate: [{ required: true, message: '请选择时间段' }],
});
const useForm = Form.useForm;

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args),
});
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
  validate().then(() => {
    const { dateRange, ...data } = toRaw(modelRef)
    emit('submit', {
      ...data,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    })
    emit('update:visible', false)
  })
}
</script>

<template>
  <Modal :title="initialValues ? '编辑目标' : '新增目标'" :visible="visible" @update:visible="$emit('update:visible', $event)"
    @ok="handleSubmit">
    <Form layout="vertical">
      <Form.Item label="目标名称" v-bind="validateInfos.name">
        <Input v-model:value="modelRef.name" placeholder="请输入目标名称" />
      </Form.Item>
      <Form.Item label="时间段" v-bind="validateInfos.startDate">
        <DatePicker.RangePicker v-model:value="modelRef.dateRange" class="w-full" />
      </Form.Item>
      <Form.Item label="目标描述">
        <Input.TextArea v-model:value="modelRef.description" placeholder="请输入目标描述" :rows="4" />
      </Form.Item>
    </Form>
  </Modal>
</template>
