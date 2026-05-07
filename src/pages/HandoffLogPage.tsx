import { HANDOFFS, AGENTS, TASKS } from '../data/seed'
import type { HandoffAction } from '../types'

function actionVariant(action: HandoffAction): string {
  switch (action) {
    case 'escalate': return 'block-card block-card--red'
    case 'draft':    return 'block-card block-card--blue'
    case 'update':   return 'block-card block-card--yellow'
    case 'resolve':  return 'block-card block-card--green'
    default:         return 'block-card'
  }
}

function actionColor(action: HandoffAction): string {
  switch (action) {
    case 'escalate': return 'var(--red)'
    case 'draft':    return 'var(--blue)'
    case 'update':   return 'var(--yellow)'
    case 'resolve':  return 'var(--green)'
    default:         return 'var(--text-2)'
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function HandoffLogPage() {
  const sorted = [...HANDOFFS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / AUDIT LOG
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          Handoff Log
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace', marginTop: 4 }}>
          {HANDOFFS.length} entries — newest first
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(handoff => {
          const agent = AGENTS.find(a => a.id === handoff.agentId)
          const task = TASKS.find(t => t.id === handoff.taskId)

          return (
            <div
              key={handoff.id}
              className={actionVariant(handoff.action)}
              style={{
                padding: '10px 14px',
                display: 'grid',
                gridTemplateColumns: '80px 130px 90px 80px 1fr 100px',
                gap: 12,
                alignItems: 'center',
              }}
            >
              {/* Time */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text)', fontWeight: 600 }}>
                  {formatTime(handoff.createdAt)}
                </span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-3)' }}>
                  {formatDate(handoff.createdAt)}
                </span>
              </div>

              {/* Agent */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {agent?.name ?? handoff.agentId}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                  {agent?.role}
                </span>
              </div>

              {/* Task ref */}
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                  {task?.sourceRef ?? handoff.taskId}
                </span>
              </div>

              {/* Action */}
              <div>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  color: actionColor(handoff.action),
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: `1px solid ${actionColor(handoff.action)}`,
                  borderRadius: 3,
                  padding: '2px 6px',
                }}>
                  {handoff.action}
                </span>
              </div>

              {/* Summary */}
              <div style={{
                fontSize: 11,
                color: 'var(--text-2)',
                lineHeight: 1.4,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {handoff.summary}
              </div>

              {/* Approval status */}
              <div style={{ textAlign: 'right' }}>
                {handoff.approvalRequired ? (
                  handoff.approvedBy ? (
                    <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'monospace', fontWeight: 700 }}>
                      APPROVED
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: 'var(--yellow)', fontFamily: 'monospace', fontWeight: 700 }}>
                      PENDING
                    </span>
                  )
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                    AUTO
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
