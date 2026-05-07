import { useState } from 'react'
import ReviewGateModal from '../components/ReviewGateModal'
import { TASKS, HANDOFFS, AGENTS } from '../data/seed'
import type { Task, Handoff } from '../types'

function waitingTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ${mins % 60}m`
  return `${Math.floor(hrs / 24)}d`
}

export default function ReviewGatePage() {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeHandoff, setActiveHandoff] = useState<Handoff | null>(null)

  const pendingTasks = TASKS.filter(t => t.status === 'awaiting-approval')

  function openReview(task: Task) {
    const handoff = HANDOFFS.find(h => h.taskId === task.id && h.approvalRequired && !h.approvedBy)
    if (handoff) {
      setActiveTask(task)
      setActiveHandoff(handoff)
    }
  }

  function closeModal() {
    setActiveTask(null)
    setActiveHandoff(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / REVIEW GATE
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          Review Gate
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace', marginTop: 4 }}>
          {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} awaiting approval
        </div>
      </div>

      {pendingTasks.length === 0 && (
        <div className="block-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontFamily: 'monospace', fontSize: 12 }}>
          NO PENDING REVIEWS — ALL CLEAR
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pendingTasks.map(task => {
          const agent = AGENTS.find(a => a.id === task.assignedAgentId)
          const waiting = waitingTime(task.updatedAt)

          return (
            <div
              key={task.id}
              className="block-card block-card--yellow"
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 90 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="status-led led-yellow led-pulse" />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                    {task.sourceRef}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                  waiting {waiting}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                  {task.title}
                </div>
                {agent && (
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'monospace' }}>
                    {agent.name} — {agent.role}
                  </div>
                )}
              </div>

              <button
                className="block-card block-card--yellow"
                onClick={() => openReview(task)}
                style={{
                  padding: '7px 16px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  color: 'var(--yellow)',
                  whiteSpace: 'nowrap',
                }}
              >
                ⚑ OPEN REVIEW
              </button>
            </div>
          )
        })}
      </div>

      {activeTask && activeHandoff && (
        <ReviewGateModal
          task={activeTask}
          handoff={activeHandoff}
          onApprove={closeModal}
          onReject={closeModal}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
