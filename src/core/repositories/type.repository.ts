import { IStorage } from '../interfaces'
import { BaseRepository } from './base.repository'
import type { TypeItem } from '../../views/type/composables/useType'

export class TypeRepository extends BaseRepository<TypeItem> {
  constructor(storage: IStorage) {
    super(storage, 'types')
  }
}
