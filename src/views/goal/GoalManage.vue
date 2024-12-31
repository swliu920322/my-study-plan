<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import TaskCalendar from './components/TaskCalendar.vue'
import GoalList from './components/GoalList.vue'
import TaskList from './components/TaskList.vue'
import GoalForm from './components/GoalForm.vue'
import TaskForm from './components/TaskForm.vue'
import { useGoal } from './composables/useGoal'
import { useTask } from './composables/useTask'
import type { Goal, Task } from './goal.type'

const {
  goals,
  selectedGoal,
  goalModalVisible,
  selectGoal,
  addGoal,
  updateGoal,
  deleteGoal
} = useGoal()

const {
  tasks,
  selectedDate,
  taskModalVisible,
  taskDrawerVisible,
  getDateTasks,
  getGoalTasks,
  addTask,
  deleteTask,
  selectDate
} = useTask()

// 处理目标相关操作
const handleAddGoal = () => {
  goalModalVisible.value = true
}

const handleEditGoal = (goal: Goal) => {
  selectedGoal.value = goal
  goalModalVisible.value = true
}

const handleDeleteGoal = async (id: string) => {
  await deleteGoal(id)
  if (selectedGoal.value?.id === id) {
    selectedGoal.value = null
  }
}

const handleSubmitGoal = async (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (selectedGoal.value) {
    await updateGoal(selectedGoal.value.id, data)
    selectedGoal.value = null
  } else {
    await addGoal(data)
  }
}

// 处理任务相关操作
const handleAddTask = (goalId?: string) => {
  if (goalId) {
    selectGoal(goals.value.find(g => g.id === goalId) || null)
  }
  taskModalVisible.value = true
}

const handleSubmitTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  await addTask(data)
}

const handleDeleteTask = async (id: string) => {
  await deleteTask(id)
}

// 查看目标任务
const viewGoalTasks = (goal: Goal) => {
  selectGoal(goal)
  taskDrawerVisible.value = true
}
</script>

<template>
  <div class="p-6 overflow-auto w-full h-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">目标管理</h1>
      <Button type="primary" @click="handleAddGoal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增目标
      </Button>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧日历 -->
      <div class="col-span-4 sticky top-6" style="height: calc(100vh - 8rem);">
        <TaskCalendar :get-date-tasks="getDateTasks" @select="selectDate" />
      </div>

      <!-- 右侧目标列表 -->
      <div class="col-span-8">
        <GoalList :goals="goals" :get-goal-tasks="getGoalTasks" @edit="handleEditGoal" @delete="handleDeleteGoal"
          @view-tasks="viewGoalTasks" />
      </div>
    </div>

    <!-- 目标表单 -->
    <GoalForm v-model:visible="goalModalVisible" :initial-values="selectedGoal || undefined"
      @submit="handleSubmitGoal" />

    <!-- 任务列表抽屉 -->
    <a-drawer :title="selectedGoal?.name + ' 的任务'" placement="right" :width="600" v-model:visible="taskDrawerVisible"
      :closable="false" :bodyStyle="{ padding: '24px', backgroundColor: '#f9fafb' }">
      <TaskList :tasks="getGoalTasks(selectedGoal?.id || '')" @add="() => handleAddTask(selectedGoal?.id)"
        @delete="handleDeleteTask" />
    </a-drawer>

    <!-- 任务表单 -->
    <TaskForm v-model:visible="taskModalVisible" :goals="goals" :selected-goal="selectedGoal"
      @submit="handleSubmitTask" />
  </div>
</template>
