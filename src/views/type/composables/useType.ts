import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { typeRepository } from '../../../infrastructure/storage'
import { toRaw } from 'vue'
import { TypeItem } from '@/core/models'

export function useType() {
  const types = ref<TypeItem[]>([])
  const selectedType = ref<TypeItem | null>(null)

  // 加载所有类型
  const loadTypes = async () => {
    types.value = await typeRepository.findAll()
  }

  // 获取所有大类
  const mainTypes = computed(() => {
    return types.value.filter((type) => !type.pId)
  })

  // 获取选中大类的子类
  const subTypes = computed(() => {
    if (!selectedType.value) return []
    return types.value.filter((type) => type.pId === selectedType.value?.id)
  })

  // 选择类型
  const selectType = (type: TypeItem) => {
    selectedType.value = type
  }

  // 添加类型
  const addType = async (data: Omit<TypeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 创建一个普通对象的副本
    const rawData = toRaw(data)
    const newType = await typeRepository.create(rawData)
    types.value.push(newType)
    message.success('添加成功')
    return newType
  }

  // 更新类型
  const updateType = async (id: string, data: Partial<TypeItem>) => {
    // 创建一个普通对象的副本
    const rawData = toRaw(data)
    const updatedType = await typeRepository.update(id, rawData)
    const index = types.value.findIndex((t) => t.id === id)
    if (index > -1) {
      types.value[index] = updatedType
      message.success('更新成功')
      return updatedType
    }
    return null
  }

  // 删除类型
  const deleteType = async (id: string) => {
    await typeRepository.delete(id)
    // 如果是大类，同时删除其下的所有小类
    types.value = types.value.filter((type) => type.id !== id && type.pId !== id)
    if (selectedType.value?.id === id) {
      selectedType.value = null
    }
    message.success('删除成功')
  }

  return {
    types,
    selectedType,
    mainTypes,
    subTypes,
    selectType,
    addType,
    updateType,
    deleteType,
    loadTypes,
  }
}
