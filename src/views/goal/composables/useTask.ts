import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { taskRepository } from '@/infrastructure/storage'
import type { Task } from '../goal.type'

export function useTask() {
  const tasks = ref<Task[]>([])
  const selectedDate = ref(dayjs())
  const taskModalVisible = ref(false)
  const taskDrawerVisible = ref(false)

  // 加载任务列表
  const loadTasks = async () => {
    tasks.value = await taskRepository.findAll()
  }

  // 获取指定日期的任务
  const getDateTasks = (date: dayjs.Dayjs) => {
    return tasks.value.filter((task) => dayjs(task.date).isSame(date, 'day'))
  }

  // 获取指定目标的任务
  const getGoalTasks = (goalId: string) => {
    return tasks.value.filter((task) => task.goalId === goalId)
  }

  // 添加任务
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = await taskRepository.create(taskData)
    tasks.value.push(newTask)
    message.success('添加成功')
    return newTask
  }

  // 删除任务
  const deleteTask = async (id: string) => {
    await taskRepository.delete(id)
    tasks.value = tasks.value.filter((task) => task.id !== id)
    message.success('删除成功')
  }

  // 选择日期
  const selectDate = (date: dayjs.Dayjs) => {
    selectedDate.value = date
  }

  // 初始化
  loadTasks()

  return {
    tasks,
    selectedDate,
    taskModalVisible,
    taskDrawerVisible,
    getDateTasks,
    getGoalTasks,
    addTask,
    deleteTask,
    selectDate,
  }
}
