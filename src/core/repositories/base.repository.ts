import { IModel, IRepository, IStorage } from '../interfaces'

export abstract class BaseRepository<T extends IModel> implements IRepository<T> {
  protected constructor(
    protected readonly storage: IStorage,
    protected readonly storageKey: string,
  ) {}

  async findAll(): Promise<T[]> {
    const data = await this.storage.get<T[]>(this.storageKey)
    return data || []
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.findAll()
    return items.find((item) => item.id === id) || null
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = await this.findAll()
    const now = Date.now()
    const newItem = {
      ...data,
      id: now.toString(),
      createdAt: now,
      updatedAt: now,
    } as T

    items.push(newItem)
    await this.storage.set(this.storageKey, items)
    return newItem
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const items = await this.findAll()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`)
    }

    const updatedItem = {
      ...items[index],
      ...data,
      updatedAt: Date.now(),
    }

    items[index] = updatedItem
    await this.storage.set(this.storageKey, items)
    return updatedItem
  }

  async delete(id: string): Promise<void> {
    const items = await this.findAll()
    const filteredItems = items.filter((item) => item.id !== id)
    await this.storage.set(this.storageKey, filteredItems)
  }

  async clear(): Promise<void> {
    await this.storage.remove(this.storageKey)
  }
}
