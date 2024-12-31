import { Dayjs } from 'dayjs'

// 任务类型
export type TaskType = 'study' | 'work' | 'life'

export interface Task {
  id: string
  name: string
  type: TaskType
  duration: number // 预计时长（分钟）
  date: string // 具体日期
  goalId: string // 关联的目标ID
}

export interface Goal {
  id: string
  name: string
  startDate: string
  endDate: string
  description: string
  progress: number
}

export interface GoalForm {
  name: string
  dateRange: [Dayjs, Dayjs]
  description: string
}
