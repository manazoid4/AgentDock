import { useState } from 'react'
import type { Task, TaskStatus } from '../types'
import { TASKS } from '../data/seed'
import { TaskStatusBadge, PriorityBadge } from '../components/StatusBadge'

interface Stage {
  key: string
  label: string
  statuses: TaskStatus[]
  variant?: string
  description: string
}

const STAGES: Stage[] = [
  { key: 'trigger', label: 'TRIGGER', statuses: ['triggered'], description: 'New tickets land here' },
  { key: 'triage',  label: 'TRIAGE',  statuses: ['triaged'], description: 'Classified & scored' },
  { key: 'draft',   label: 'DRAFT',   statuses: ['in-progress'], description: 'Response in progress' },
  { key: 'review',  label: 'REVIEW',  statuses: ['awaiting-approval'], variant: 'yellow', description: 'Awaiting human approval' },
  { key: 'send',    label: 'SEND',    statuses: ['resolved'], description: 'Action executed' },
  { key: 'log',     label: 'LOG',     statuses: ['logged'], description: 'Audit trail locked' },
]

function MiniTaskCard({ task, highlight, onDragStart }: { task: Task; highlight?: string; onDragStart?: (e: React.DragEvent, task: Task) => void }) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      className={highlight ? `block-card block-card--${highlight}` : 'block-card'}
      style={{
        padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6,
        cursor: 'grab', opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.15s, transform 0.15s',
      }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        onDragStart?.(e, task)
      }}
      onDragEnd={() => setIsDragging(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>
          {task.sourceRef}
        </span>
        <span style={{ marginLeft: 'auto' }}>
          <PriorityBadge priority={task.priority} />
        </span>
      </div>
      <div style={{
        fontSize: 11, color: 'var(--text)', lineHeight: 1.35,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {task.title}
      </div>
      <TaskStatusBadge status={task.status} />
    </div>
  )
}

export default function PipelineViewPage() {
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  function handleDragStart(_e: React.DragEvent, task: Task) {
    _e.dataTransfer.setData('taskId', task.id)
  }

  function handleDragOver(e: React.DragEvent, stageKey: string) {
    e.preventDefault()
    setDragOverStage(stageKey)
  }

  function handleDragLeave() {
    setDragOverStage(null)
  }

  function handleDrop(_e: React.DragEvent, _stage: Stage) {
    _e.preventDefault()
    setDragOverStage(null)
    // In a real app, this would update the task's status
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / PIPELINE
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
          Pipeline View
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
          Drag cards between stages · {TASKS.length} total tasks
        </div>
      </div>

      {/* Pipeline arrow legend */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {STAGES.map((stage, i) => (
          <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: stage.variant ? `var(--${stage.variant})` : 'var(--text-2)',
              letterSpacing: '0.06em',
            }}>
              {stage.label}
            </span>
            {i < STAGES.length - 1 && (
              <span style={{ color: 'var(--text-3)', fontSize: 12 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, minmax(180px, 1fr))`, gap: 12, minWidth: `${STAGES.length * 190}px` }}>
          {STAGES.map(stage => {
            const stageTasks = TASKS.filter(t => stage.statuses.includes(t.status))
            const headerClass = stage.variant ? `block-card block-card--${stage.variant}` : 'block-card'
            const isDragOver = dragOverStage === stage.key

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 8,
                  padding: 8, borderRadius: 8,
                  background: isDragOver ? 'rgba(88,166,255,0.06)' : 'transparent',
                  border: isDragOver ? '1px dashed var(--blue)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Stage header */}
                <div
                  className={headerClass}
                  style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11,
                      color: stage.variant ? `var(--${stage.variant})` : 'var(--text)',
                      letterSpacing: '0.08em',
                    }}>
                      {stage.label}
                    </span>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                      {stage.description}
                    </div>
                  </div>
                  <span style={{
                    background: stageTasks.length > 0
                      ? (stage.variant ? `var(--${stage.variant})` : 'var(--blue)')
                      : 'var(--bg-3)',
                    color: stageTasks.length > 0
                      ? (stage.variant ? 'var(--bg)' : 'var(--bg)')
                      : 'var(--text-3)',
                    borderRadius: 10, padding: '2px 8px', fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    minWidth: 24, textAlign: 'center',
                  }}>
                    {stageTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                {stageTasks.map(task => (
                  <MiniTaskCard key={task.id} task={task} highlight={stage.variant} onDragStart={handleDragStart} />
                ))}

                {/* Empty state */}
                {stageTasks.length === 0 && (
                  <div style={{
                    padding: '20px 12px', fontSize: 10, color: 'var(--text-3)',
                    fontFamily: "'JetBrains Mono', monospace", textAlign: 'center',
                    border: '1px dashed var(--border)', borderRadius: 6,
                    background: 'var(--bg-2)',
                  }}>
                    Drop tasks here
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
