import { IModel } from '../interfaces'

export type TaskType = 'study' | 'work' | 'life'

export interface Task extends IModel {
  name: string
  type: TaskType
  duration: number
  date: string
  goalId: string
}
