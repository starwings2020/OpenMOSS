import { reactive, computed } from 'vue'
import type {
  AgentDef,
  AgentState,
  AgentStatus,
  ScenarioEvent,
  SimulationPhase,
  SummaryData,
  TaskState,
  TimelineEntry,
} from './types'
import { AGENT_EMOJI } from './types'

// =============================================
// SimulationStore — 统一状态层
// 两种模式（Demo 回放 / Real API）共用
// UI 组件只读这个 store，不关心数据来源
// =============================================

let _entryId = 0

function createStore() {
  const state = reactive({
    /** 模拟阶段 */
    phase: 'idle' as SimulationPhase,

    /** Agent 状态表（key = agent id） */
    agents: new Map<string, AgentState>(),

    /** 任务列表 */
    tasks: [] as TaskState[],

    /** 时间轴日志（最新在前） */
    timeline: [] as TimelineEntry[],

    /** 结果统计 */
    summary: null as SummaryData | null,

    /** 已播放时间（秒） */
    elapsed: 0,

    /** 总时长（秒） */
    duration: 0,
  })

  // ── Computed ──

  const agentList = computed(() => Array.from(state.agents.values()))

  const tasksByStatus = computed(() => {
    const groups: Record<string, TaskState[]> = {
      pending: [],
      assigned: [],
      working: [],
      review: [],
      rework: [],
      done: [],
    }
    for (const t of state.tasks) {
      groups[t.status]?.push(t)
    }
    return groups
  })

  // ── Actions ──

  /** 初始化：加载场景的 Agent 定义 */
  function initAgents(defs: AgentDef[]) {
    state.agents.clear()
    for (const def of defs) {
      state.agents.set(def.id, {
        id: def.id,
        name: def.name,
        role: def.role,
        avatar: def.avatar,
        status: 'idle',
        score: 100,
        message: '',
        expression: AGENT_EMOJI.idle,
      })
    }
  }

  /** 重置所有状态 */
  function reset() {
    state.phase = 'idle'
    state.agents.clear()
    state.tasks = []
    state.timeline = []
    state.summary = null
    state.elapsed = 0
    state.duration = 0
    _entryId = 0
  }

  /** 推入一个事件（核心方法，Demo 回放和 Real API 都通过这个写入） */
  function pushEvent(event: ScenarioEvent) {
    const agent = event.agent ? state.agents.get(event.agent) : undefined

    switch (event.type) {
      case 'agent_status':
        if (agent && event.status) {
          const agentStatus = event.status as AgentStatus
          agent.status = agentStatus
          agent.expression = (agentStatus in AGENT_EMOJI) ? AGENT_EMOJI[agentStatus] : AGENT_EMOJI.idle
          if (event.message) agent.message = event.message
        }
        break

      case 'task_created':
        if (event.task && typeof event.task === 'object') {
          state.tasks.push({
            id: event.task.id,
            name: event.task.name,
            assignee: event.task.assignee,
            status: 'assigned',
          })
        }
        break

      case 'task_status':
        if (event.task && typeof event.task === 'string') {
          const task = state.tasks.find((t) => t.id === event.task)
          if (task && event.status) {
            task.status = (event.status as TaskState['status']) || task.status
          }
        }
        break

      case 'review':
        {
          const taskId = typeof event.task === 'string' ? event.task : undefined
          if (taskId) {
            const task = state.tasks.find((t) => t.id === taskId)
            if (task) {
              task.status = event.result === 'approved' ? 'done' : 'rework'
              task.score = event.score
              task.comment = event.comment
            }
          }
        }
        break

      case 'score_change':
        if (agent && event.delta !== undefined) {
          agent.score += event.delta
          if (event.total !== undefined) agent.score = event.total
        }
        break

      case 'reflection':
        // 反思日志，仅写入 timeline
        if (agent && event.content) {
          agent.message = `💭 ${event.content}`
        }
        break

      case 'summary':
        if (event.data) {
          state.summary = event.data
          state.phase = 'result'
        }
        break
    }

    // 所有事件都写入 timeline
    const entry: TimelineEntry = {
      id: `e-${++_entryId}`,
      timestamp: event.t,
      event,
      agentName: agent?.name,
      agentAvatar: agent?.avatar,
    }
    state.timeline.unshift(entry) // 最新在前
  }

  return {
    state,
    agentList,
    tasksByStatus,
    initAgents,
    reset,
    pushEvent,
  }
}

// 单例
let _store: ReturnType<typeof createStore> | null = null

export function useSimulationStore() {
  if (!_store) {
    _store = createStore()
  }
  return _store
}
