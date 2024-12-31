import { IStorage } from '../interfaces'
import { Goal } from '../models'
import { BaseRepository } from './base.repository'

export class GoalRepository extends BaseRepository<Goal> {
  constructor(storage: IStorage) {
    super(storage, 'goals')
  }
}
