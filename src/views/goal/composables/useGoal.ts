import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { goalRepository } from '@/infrastructure/storage'
import type { Goal } from '../goal.type'

export function useGoal() {
  const goals = ref<Goal[]>([])
  const selectedGoal = ref<Goal | null>(null)
  const goalModalVisible = ref(false)

  // 加载目标列表
  const loadGoals = async () => {
    goals.value = await goalRepository.findAll()
  }

  // 选择目标
  const selectGoal = (goal: Goal | null) => {
    selectedGoal.value = goal
  }

  // 添加目标
  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal = await goalRepository.create(goalData)
    goals.value.push(newGoal)
    message.success('添加成功')
    return newGoal
  }

  // 更新目标
  const updateGoal = async (id: string, goalData: Partial<Goal>) => {
    const updatedGoal = await goalRepository.update(id, goalData)
    const index = goals.value.findIndex((goal) => goal.id === id)
    if (index !== -1) {
      goals.value[index] = updatedGoal
    }
    message.success('更新成功')
    return updatedGoal
  }

  // 删除目标
  const deleteGoal = async (id: string) => {
    await goalRepository.delete(id)
    goals.value = goals.value.filter((goal) => goal.id !== id)
    message.success('删除成功')
  }

  // 初始化
  loadGoals()

  return {
    goals,
    selectedGoal,
    goalModalVisible,
    selectGoal,
    addGoal,
    updateGoal,
    deleteGoal,
  }
}
