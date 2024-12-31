import { IStorage } from '../../core/interfaces'

export class LocalStorage implements IStorage {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
      throw error
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      throw error
    }
  }
}
