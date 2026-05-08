import type { Task, Agent } from '../types'
import TaskCard from './TaskCard'

interface Props {
  label: string
  tasks: Task[]
  agents: Agent[]
}

export default function PipelineStage({ label, tasks, agents }: Props) {
  const isActive = tasks.length > 0

  return (
    <div
      className="block-card"
      style={{
        minWidth: 180,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 14,
        opacity: isActive ? 1 : 0.55,
      }}
    >
      {/* Stage header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? 'var(--blue)' : 'var(--text-3)',
          letterSpacing: '0.1em',
        }}>
          {label}
        </span>
        {tasks.length > 0 && (
          <span style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 10,
            color: 'var(--text-2)',
            fontWeight: 600,
          }}>
            {tasks.length}
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Task cards */}
      {tasks.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0', fontFamily: 'monospace' }}>
          — EMPTY —
        </div>
      ) : (
        tasks.map(task => {
          const agent = agents.find(a => a.id === task.assignedAgentId)
          return (
            <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <TaskCard task={task} agent={agent} compact />
              {task.status === 'awaiting-approval' && (
                <div style={{
                  padding: '3px 8px',
                  background: 'var(--yellow-dark)',
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#000',
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}>
                  NEEDS REVIEW
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
