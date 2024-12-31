<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'ant-design-vue'
import type { Task, Goal } from '../goal.type'

const props = defineProps<{
  visible: boolean
  goals: Goal[]
  selectedGoal?: Goal
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'submit', data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const form = reactive({
  name: '',
  type: 'study',
  duration: 30,
  date: '',
  goalId: ''
})

// 监听visible变化，重置表单
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      Object.assign(form, {
        name: '',
        type: 'study',
        duration: 30,
        date: '',
        goalId: props.selectedGoal?.id || ''
      })
    }
  }
)

const handleSubmit = () => {
  emit('submit', { ...form } as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>)
  emit('update:visible', false)
}
</script>

<template>
  <Modal :title="'新增任务'" :visible="visible" @update:visible="(val) => $emit('update:visible', val)" @ok="handleSubmit">
    <Form layout="vertical">
      <Form.Item label="任务名称" required>
        <Input v-model:value="form.name" placeholder="请输入任务名称" />
      </Form.Item>
      <Form.Item label="任务类型" required>
        <Select v-model:value="form.type">
          <Select.Option value="study">学习</Select.Option>
          <Select.Option value="work">工作</Select.Option>
          <Select.Option value="life">生活</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="预计时长(分钟)" required>
        <InputNumber v-model:value="form.duration" :min="1" />
      </Form.Item>
      <Form.Item label="日期" required>
        <DatePicker v-model:value="form.date" class="w-full" />
      </Form.Item>
      <Form.Item v-if="!selectedGoal" label="关联目标">
        <Select v-model:value="form.goalId" placeholder="请选择关联目标">
          <Select.Option v-for="goal in goals" :key="goal.id" :value="goal.id">
            {{ goal.name }}
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  </Modal>
</template>
