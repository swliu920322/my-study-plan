import { IModel } from './model.interface'

export interface IRepository<T extends IModel> {
  findAll(): T[]
  findById(id: string): T | null
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T
  update(id: string, data: Partial<T>): T
  delete(id: string): void
  clear(): void
}
