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
}
