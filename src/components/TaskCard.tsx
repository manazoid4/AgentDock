import type { Task, Agent } from '../types'
import { PriorityBadge, TaskStatusBadge } from './StatusBadge'

interface Props {
  task: Task
  agent?: Agent
  compact?: boolean
}

function ledClass(status: Task['status']): string {
  switch (status) {
    case 'in-progress':       return 'status-led led-green led-pulse'
    case 'awaiting-approval': return 'status-led led-yellow led-pulse'
    case 'triggered':         return 'status-led led-blue'
    default:                  return 'status-led led-grey'
  }
}

function cardVariant(status: Task['status']): string {
  switch (status) {
    case 'in-progress':       return 'block-card block-card--green'
    case 'awaiting-approval': return 'block-card block-card--yellow'
    default:                  return 'block-card'
  }
}

export default function TaskCard({ task, agent, compact = false }: Props) {
  return (
    <div className={cardVariant(task.status)} style={{ padding: compact ? '10px 12px' : 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Ref + LED + Priority */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className={ledClass(task.status)} />
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>{task.sourceRef}</span>
        <span style={{ marginLeft: 'auto' }}>
          <PriorityBadge priority={task.priority} />
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: compact ? 11 : 13,
        color: 'var(--text)',
        fontWeight: 600,
        lineHeight: 1.4,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {task.title}
      </div>

      {!compact && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <TaskStatusBadge status={task.status} />
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginLeft: 'auto' }}>
              {task.sourceSystem.toUpperCase()}
            </span>
          </div>
          {agent && (
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
              <span style={{ color: 'var(--text-3)' }}>AGENT </span>{agent.name}
            </div>
          )}
        </>
      )}
    </div>
  )
}
