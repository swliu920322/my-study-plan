import { GoalRepository, TaskRepository } from '../../core/repositories'
import { LocalStorage } from './local-storage'

// 创建单例实例
const storage = new LocalStorage()
export const goalRepository = new GoalRepository(storage)
export const taskRepository = new TaskRepository(storage)
