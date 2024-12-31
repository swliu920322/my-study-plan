import { IStorage } from '../interfaces'
import { Task } from '../models'
import { BaseRepository } from './base.repository'

export class TaskRepository extends BaseRepository<Task> {
  constructor(storage: IStorage) {
    super(storage, 'tasks')
  }

  async findByGoalId(goalId: string): Promise<Task[]> {
    const tasks = await this.findAll()
    return tasks.filter((task) => task.goalId === goalId)
  }

  async findByDate(date: string): Promise<Task[]> {
    const tasks = await this.findAll()
    return tasks.filter((task) => task.date === date)
  }
}
