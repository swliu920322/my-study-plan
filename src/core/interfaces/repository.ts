import { IModel } from './model'

export interface IRepository<T extends IModel> {
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}
