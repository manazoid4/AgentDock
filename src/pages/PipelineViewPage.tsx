import type { Task, TaskStatus } from '../types'
import { TASKS } from '../data/seed'
import { TaskStatusBadge, PriorityBadge } from '../components/StatusBadge'

interface Stage {
  key: string
  label: string
  statuses: TaskStatus[]
  variant?: string
}

const STAGES: Stage[] = [
  { key: 'trigger', label: 'TRIGGER', statuses: ['triggered'] },
  { key: 'triage',  label: 'TRIAGE',  statuses: ['triaged'] },
  { key: 'draft',   label: 'DRAFT',   statuses: ['in-progress'] },
  { key: 'review',  label: 'REVIEW',  statuses: ['awaiting-approval'], variant: 'yellow' },
  { key: 'send',    label: 'SEND',    statuses: ['resolved'] },
  { key: 'log',     label: 'LOG',     statuses: ['logged'] },
]

function MiniTaskCard({ task, highlight }: { task: Task; highlight?: string }) {
  return (
    <div
      className={highlight ? `block-card block-card--${highlight}` : 'block-card'}
      style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>
          {task.sourceRef}
        </span>
        <span style={{ marginLeft: 'auto' }}>
          <PriorityBadge priority={task.priority} />
        </span>
      </div>
      <div style={{
        fontSize: 11,
        color: 'var(--text)',
        lineHeight: 1.35,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {task.title}
      </div>
      <TaskStatusBadge status={task.status} />
    </div>
  )
}

export default function PipelineViewPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / PIPELINE
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
          Pipeline View
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, minmax(160px, 1fr))`, gap: 10, minWidth: `${STAGES.length * 170}px` }}>
          {STAGES.map(stage => {
            const stageTasks = TASKS.filter(t => stage.statuses.includes(t.status))
            const headerClass = stage.variant ? `block-card block-card--${stage.variant}` : 'block-card'

            return (
              <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  className={headerClass}
                  style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 11,
                    color: stage.variant ? `var(--${stage.variant})` : 'var(--text)',
                    letterSpacing: '0.08em',
                  }}>
                    {stage.label}
                  </span>
                  <span style={{
                    background: stageTasks.length > 0
                      ? (stage.variant ? `var(--${stage.variant})` : 'var(--blue)')
                      : 'var(--bg-3)',
                    color: stageTasks.length > 0
                      ? (stage.variant ? 'var(--bg)' : 'var(--bg)')
                      : 'var(--text-3)',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}>
                    {stageTasks.length}
                  </span>
                </div>

                {stageTasks.map(task => (
                  <MiniTaskCard key={task.id} task={task} highlight={stage.variant} />
                ))}

                {stageTasks.length === 0 && (
                  <div style={{
                    padding: '12px 10px',
                    fontSize: 10,
                    color: 'var(--text-3)',
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: 'center',
                    border: '1px dashed var(--border)',
                    borderRadius: 4,
                  }}>
                    EMPTY
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
