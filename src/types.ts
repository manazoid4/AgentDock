export type AgentStatus = 'idle' | 'running' | 'waiting' | 'error'
export type TaskStatus = 'triggered' | 'triaged' | 'in-progress' | 'awaiting-approval' | 'resolved' | 'logged'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type HandoffAction = 'triage' | 'draft' | 'update' | 'escalate' | 'resolve' | 'log'
export type ConnectorType = 'servicenow' | 'zendesk' | 'jira' | 'email' | 'webhook'

export interface Agent {
  id: string
  name: string
  role: string
  provider: 'openai' | 'anthropic' | 'local'
  model: string
  status: AgentStatus
  currentWorkflowId?: string
  connectedSystem?: string
  lastAction?: string
  lastActionAt?: string
}

export interface Task {
  id: string
  title: string
  sourceSystem: ConnectorType
  sourceRef: string
  projectId: string
  assignedAgentId?: string
  status: TaskStatus
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface Handoff {
  id: string
  taskId: string
  agentId: string
  action: HandoffAction
  summary: string
  approvalRequired: boolean
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

export interface Connector {
  id: string
  type: ConnectorType
  name: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  health?: ConnectorHealth
}

export interface ConnectorHealth {
  latencyMs: number
  errorCount: number
  rateLimitRemaining: number
  uptimePercent: number
  lastError?: string
  messagesProcessed: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  agentId: string
  agentName: string
  taskId?: string
  taskRef?: string
  action: string
  detail: string
  approvalRequired: boolean
  approvedBy?: string
  severity: 'info' | 'warning' | 'critical'
}

export interface DemoState {
  active: boolean
  phase: number
  p1Ticket: P1Ticket | null
  auditLog: AuditLogEntry[]
  metrics: DemoMetrics
  pendingApproval: DemoApproval | null
}

export interface P1Ticket {
  id: string
  ref: string
  title: string
  stage: string
  stageIndex: number
  createdAt: string
  updatedAt: string
}

export interface DemoMetrics {
  ticketsProcessed: number
  avgResolutionMinutes: number
  approvalRate: number
  complianceScore: number
  activeAgents: number
}

export interface DemoApproval {
  taskId: string
  taskRef: string
  title: string
  action: string
  detail: string
  agentName: string
  timestamp: string
}
