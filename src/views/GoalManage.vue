<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Card,
  Tag,
  Progress,
  Calendar,
  Badge,
  InputNumber,
  Select,
  Drawer
} from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined, EditOutlined, CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

// 任务类型
type TaskType = 'study' | 'work' | 'life'

interface Task {
  id: string
  name: string
  type: TaskType
  duration: number // 预计时长（分钟）
  date: string // 具体日期
  goalId: string // 关联的目标ID
}

interface Goal {
  id: string
  name: string
  startDate: string
  endDate: string
  description: string
  progress: number
}

const goals = ref<Goal[]>([])
const tasks = ref<Task[]>([])
const selectedDate = ref(dayjs())
const selectedGoal = ref<Goal | null>(null)
const goalModalVisible = ref(false)
const taskModalVisible = ref(false)
const taskDrawerVisible = ref(false)

// 表单数据
const goalForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  description: ''
})

const taskForm = reactive({
  name: '',
  type: 'study' as TaskType,
  duration: 30,
  date: '',
  goalId: ''
})

// 获取指定日期的任务
const getDateTasks = (date: dayjs.Dayjs) => {
  return tasks.value.filter(task => dayjs(task.date).isSame(date, 'day'))
}

// 获取指定目标的任务
const getGoalTasks = (goalId: string) => {
  return tasks.value.filter(task => task.goalId === goalId)
}

// 当前显示的任务列表
const displayTasks = computed(() => {
  if (selectedGoal.value) {
    return getGoalTasks(selectedGoal.value.id)
  }
  return getDateTasks(selectedDate.value)
})

// 选择日期
const onSelectDate = (date: dayjs.Dayjs) => {
  selectedDate.value = date
  selectedGoal.value = null
}

// 选择目标
const onSelectGoal = (goal: Goal) => {
  selectedGoal.value = goal
}

// 目标相关操作
const handleAddGoal = () => {
  Object.assign(goalForm, {
    name: '',
    startDate: '',
    endDate: '',
    description: ''
  })
  goalModalVisible.value = true
}

const handleEditGoal = (goal: Goal) => {
  Object.assign(goalForm, goal)
  goalModalVisible.value = true
}

const handleDeleteGoal = (id: string) => {
  goals.value = goals.value.filter(goal => goal.id !== id)
  tasks.value = tasks.value.filter(task => task.goalId !== id)
  message.success('删除成功')
}

const handleSubmitGoal = () => {
  const goalData = {
    ...goalForm,
    id: Date.now().toString(),
    progress: 0
  }
  goals.value.push(goalData)
  goalModalVisible.value = false
  message.success('添加成功')
}

// 任务相关操作
const handleAddTask = (goalId?: string) => {
  Object.assign(taskForm, {
    name: '',
    type: 'study',
    duration: 30,
    date: selectedDate.value.format('YYYY-MM-DD'),
    goalId: goalId || ''
  })
  taskModalVisible.value = true
}

const handleSubmitTask = () => {
  const taskData = {
    ...taskForm,
    id: Date.now().toString()
  }
  tasks.value.push(taskData)
  taskModalVisible.value = false
  message.success('添加成功')
}

const handleDeleteTask = (id: string) => {
  tasks.value = tasks.value.filter(task => task.id !== id)
  message.success('删除成功')
}

// 查看目标任务
const viewGoalTasks = (goal: Goal) => {
  selectedGoal.value = goal
  taskDrawerVisible.value = true
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">目标管理</h1>
      <Button type="primary" @click="handleAddGoal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增目标
      </Button>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧日历 -->
      <div class="col-span-4 sticky top-6" style="height: calc(100vh - 8rem);">
        <Card class="h-full rounded-lg shadow-sm overflow-hidden">
          <Calendar :fullscreen="false" @select="onSelectDate">
            <template #dateCell="{ current }">
              <div class="h-full p-1">
                <div class="text-right mb-1">{{ current.date() }}</div>
                <ul class="list-none p-0 m-0">
                  <template v-for="task in getDateTasks(current).slice(0, 2)" :key="task.id">
                    <li class="text-xs truncate mb-1.5 pl-0.5">
                      <Badge
                        :status="task.type === 'study' ? 'processing' : task.type === 'work' ? 'success' : 'warning'"
                        :text="task.name" />
                    </li>
                  </template>
                  <li v-if="getDateTasks(current).length > 2" class="text-xs text-gray-500 pl-0.5">
                    +{{ getDateTasks(current).length - 2 }}
                  </li>
                </ul>
              </div>
            </template>
          </Calendar>
        </Card>
      </div>

      <!-- 右侧目标列表 -->
      <div class="col-span-8">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="goal in goals" :key="goal.id"
            class="bg-white rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-medium text-gray-800">{{ goal.name }}</h3>
                <div class="flex items-center space-x-1">
                  <Button type="text" size="small" @click="handleEditGoal(goal)">
                    <EditOutlined class="text-gray-400 hover:text-blue-500 transition-colors" />
                  </Button>
                  <Popconfirm title="确定删除该目标吗？" @confirm="handleDeleteGoal(goal.id)">
                    <Button type="text" size="small">
                      <DeleteOutlined class="text-gray-400 hover:text-red-500 transition-colors" />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ goal.description || '暂无描述' }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{{ goal.startDate }} ~ {{ goal.endDate }}</span>
                <span>{{ getGoalTasks(goal.id).length }} 个任务</span>
              </div>
              <div class="flex justify-between items-center">
                <Progress :percent="goal.progress" size="small" class="flex-1 mr-4" />
                <Button type="link" size="small" @click="viewGoalTasks(goal)">
                  <UnorderedListOutlined />查看任务
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标表单弹窗 -->
    <Modal :title="'新增目标'" v-model:visible="goalModalVisible" @ok="handleSubmitGoal">
      <Form layout="vertical">
        <Form.Item label="目标名称" required>
          <Input v-model:value="goalForm.name" placeholder="请输入目标名称" />
        </Form.Item>
        <Form.Item label="时间段" required>
          <DatePicker.RangePicker v-model:start-value="goalForm.startDate" v-model:end-value="goalForm.endDate"
            class="w-full" />
        </Form.Item>
        <Form.Item label="目标描述">
          <Input.TextArea v-model:value="goalForm.description" placeholder="请输入目标描述" :rows="4" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 任务抽屉 -->
    <Drawer :title="selectedGoal?.name + ' 的任务'" placement="right" :width="600" v-model:visible="taskDrawerVisible"
      :closable="false" :bodyStyle="{ padding: '24px', backgroundColor: '#f9fafb' }">
      <div class="flex justify-between items-center mb-6">
        <div class="space-y-1">
          <h3 class="text-lg font-medium text-gray-800">任务列表</h3>
          <p class="text-sm text-gray-500">共 {{ displayTasks.length }} 个任务</p>
        </div>
        <Button type="primary" @click="handleAddTask(selectedGoal?.id)">
          <template #icon>
            <PlusOutlined />
          </template>
          添加任务
        </Button>
      </div>

      <div class="space-y-4">
        <div v-for="task in displayTasks" :key="task.id"
          class="bg-white rounded-lg p-4 border border-gray-100 transition-all duration-300 hover:shadow-sm">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-medium text-gray-800">{{ task.name }}</h3>
                <Tag :color="task.type === 'study' ? 'blue' : task.type === 'work' ? 'green' : 'orange'">
                  {{ task.type }}
                </Tag>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm text-gray-500">{{ dayjs(task.date).format('MM-DD') }}</span>
                <span class="text-sm text-gray-500">{{ task.duration }}分钟</span>
              </div>
            </div>
            <Popconfirm title="确定删除该任务吗？" @confirm="handleDeleteTask(task.id)">
              <Button type="text" size="small" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </Drawer>

    <!-- 任务表单弹窗 -->
    <Modal :title="'新增任务'" v-model:visible="taskModalVisible" @ok="handleSubmitTask">
      <Form layout="vertical">
        <Form.Item label="任务名称" required>
          <Input v-model:value="taskForm.name" placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item label="任务类型" required>
          <Select v-model:value="taskForm.type">
            <Select.Option value="study">学习</Select.Option>
            <Select.Option value="work">工作</Select.Option>
            <Select.Option value="life">生活</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="预计时长(分钟)" required>
          <InputNumber v-model:value="taskForm.duration" :min="1" />
        </Form.Item>
        <Form.Item label="日期" required>
          <DatePicker v-model:value="taskForm.date" class="w-full" />
        </Form.Item>
        <Form.Item v-if="!selectedGoal" label="关联目标">
          <Select v-model:value="taskForm.goalId" placeholder="请选择关联目标">
            <Select.Option v-for="goal in goals" :key="goal.id" :value="goal.id">
              {{ goal.name }}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style>
/* 日历样式优化 */
.ant-picker-calendar {
  background: transparent;
}

.ant-picker-calendar-header {
  padding-bottom: 0.5rem;
  margin: 0 24px;
}

.ant-picker-panel {
  border: none;
}

.ant-picker-calendar-date {
  height: auto !important;
  padding: 4px !important;
  margin: 0 4px;
}

.ant-picker-calendar-date-content {
  height: auto !important;
  min-height: 60px !important;
  line-height: 1.4;
}

.ant-picker-cell {
  padding: 4px 0;
}

.ant-badge-status-text {
  font-size: 12px;
  line-height: 1.4;
}

/* 其他样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
