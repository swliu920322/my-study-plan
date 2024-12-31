import { IModel } from '../interfaces'

export interface Goal extends IModel {
  name: string
  startDate: string
  endDate: string
  description: string
  progress: number
}
