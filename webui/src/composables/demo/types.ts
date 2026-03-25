// =============================================
// Demo 沙盒引擎 — TypeScript 类型定义
// =============================================

/** Agent 角色 */
export type AgentRole = 'planner' | 'executor' | 'reviewer' | 'patrol'

/** Agent 实时状态 */
export type AgentStatus =
  | 'idle'        // 空闲 😴
  | 'thinking'    // 思考中 🤔
  | 'working'     // 工作中 😤
  | 'reviewing'   // 审查中 🧐
  | 'reworking'   // 返工中 😢
  | 'patrolling'  // 巡逻中 🔍
  | 'done'        // 完成 😊

/** Agent 表情映射 */
export const AGENT_EMOJI: Record<AgentStatus, string> = {
  idle: '😴',
  thinking: '🤔',
  working: '😤',
  reviewing: '🧐',
  reworking: '😢',
  patrolling: '🔍',
  done: '😊',
}

/** Agent 角色色卡 */
export const ROLE_COLORS: Record<AgentRole, string> = {
  planner: '#8B6F4E',   // 棕褐
  executor: '#4A7FA5',  // 沉蓝
  reviewer: '#C09840',  // 暗金
  patrol: '#4A7A5E',    // 深绿
}

// ─── 场景定义 ───────────────────────────────

/** 场景中的 Agent 定义 */
export interface AgentDef {
  id: string
  name: string
  role: AgentRole
  avatar: string       // emoji
}

/** 任务状态 */
export type TaskStatus = 'pending' | 'assigned' | 'working' | 'review' | 'rework' | 'done'

/** 场景事件类型 */
export type ScenarioEventType =
  | 'agent_status'   // Agent 状态变更
  | 'task_created'   // 创建子任务
  | 'task_status'    // 子任务状态变更
  | 'log'            // 日志输出
  | 'review'         // 审查结果
  | 'score_change'   // 积分变化
  | 'reflection'     // Agent 反思
  | 'summary'        // 结果统计

/** 场景事件（JSON 剧本中的一条记录） */
export interface ScenarioEvent {
  /** 相对时间（秒），从 0 开始 */
  t: number
  /** 事件类型 */
  type: ScenarioEventType
  /** 关联的 Agent ID */
  agent?: string
  /** 关联的任务 ID（task_status / review 用字符串） */
  task?: string | { id: string; name: string; assignee: string }
  /** 状态（agent_status 用 AgentStatus，task_status 用 TaskStatus） */
  status?: string
  /** 显示消息 */
  message?: string
  /** 日志内容 */
  content?: string
  /** 审查结果 */
  result?: 'approved' | 'rejected'
  /** 审查评分 */
  score?: number
  /** 审查评语 */
  comment?: string
  /** 积分变化 */
  delta?: number
  /** 积分总分 */
  total?: number
  /** 变化原因 */
  reason?: string
  /** 结果统计数据 */
  data?: SummaryData
}

/** 结果统计 */
export interface SummaryData {
  tasks_completed: number
  average_score: number
  tokens_used: number
  rework_count: number
  time_saved: string
}

/** 完整场景数据（一个 JSON 文件） */
export interface ScenarioData {
  id: string
  name: string
  description: string
  icon: string
  duration: number        // 总时长（秒）
  agents: AgentDef[]
  events: ScenarioEvent[]
}

// ─── 运行时状态 ─────────────────────────────

/** Agent 运行时状态 */
export interface AgentState {
  id: string
  name: string
  role: AgentRole
  avatar: string
  status: AgentStatus
  score: number
  message: string         // 当前气泡消息
  expression: string      // 当前表情 emoji
}

/** 任务运行时状态 */
export interface TaskState {
  id: string
  name: string
  assignee: string        // Agent ID
  status: TaskStatus
  score?: number
  comment?: string
}

/** 时间轴条目（渲染日志用） */
export interface TimelineEntry {
  id: string
  timestamp: number       // 事件发生的相对时间
  event: ScenarioEvent
  agentName?: string
  agentAvatar?: string
}

/** 模拟阶段 */
export type SimulationPhase = 'idle' | 'playing' | 'paused' | 'result'
