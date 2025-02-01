export type Status = "todo" | "in_progress" | "completed"

export type Priority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: Date | null
  estimatedTime?: number
  timeSpent?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  id: string
  name: string
  email: string
  points: number
  level: number
  completedTasks: number
  createdAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  requiredTasks: number
  reward: number // Points
  completed: boolean
  userId: string
}

export interface Reward {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date | null
  condition: string
  userId: string
}

