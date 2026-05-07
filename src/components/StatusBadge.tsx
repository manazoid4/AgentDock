import type { Priority, TaskStatus, AgentStatus } from '../types'

interface PriorityBadgeProps { priority: Priority }
interface TaskStatusBadgeProps { status: TaskStatus }
interface AgentStatusBadgeProps { status: AgentStatus }

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  critical: { label: 'CRITICAL', color: 'var(--red)' },
  high:     { label: 'HIGH',     color: 'var(--yellow)' },
  medium:   { label: 'MEDIUM',   color: 'var(--blue)' },
  low:      { label: 'LOW',      color: 'var(--text-2)' },
}

const taskStatusConfig: Record<TaskStatus, { label: string; color: string }> = {
  'triggered':         { label: 'TRIGGERED',    color: 'var(--text-2)' },
  'triaged':           { label: 'TRIAGED',      color: 'var(--blue)' },
  'in-progress':       { label: 'IN PROGRESS',  color: 'var(--green)' },
  'awaiting-approval': { label: 'NEEDS REVIEW', color: 'var(--yellow)' },
  'resolved':          { label: 'RESOLVED',     color: 'var(--green)' },
  'logged':            { label: 'LOGGED',       color: 'var(--text-2)' },
}

const agentStatusConfig: Record<AgentStatus, { label: string; color: string }> = {
  idle:    { label: 'IDLE',    color: 'var(--text-2)' },
  running: { label: 'RUNNING', color: 'var(--green)' },
  waiting: { label: 'WAITING', color: 'var(--yellow)' },
  error:   { label: 'ERROR',   color: 'var(--red)' },
}

const chipStyle = (color: string): React.CSSProperties => ({
  color,
  border: `1px solid ${color}`,
  borderRadius: 3,
  padding: '1px 6px',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
})

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = priorityConfig[priority]
  return <span style={chipStyle(cfg.color)}>{cfg.label}</span>
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const cfg = taskStatusConfig[status]
  return <span style={chipStyle(cfg.color)}>{cfg.label}</span>
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const cfg = agentStatusConfig[status]
  return <span style={chipStyle(cfg.color)}>{cfg.label}</span>
}
