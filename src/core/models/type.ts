import type { IModel } from '../interfaces'

export interface TypeItem extends IModel {
  name: string
  description: string
  pId: string | null
}
