import type { Task, Handoff } from '../types'
import { AGENTS } from '../data/seed'

interface Props {
  task: Task
  handoff: Handoff
  onApprove: () => void
  onReject: () => void
  onClose: () => void
}

export default function ReviewGateModal({ task, handoff, onApprove, onReject, onClose }: Props) {
  const agent = AGENTS.find(a => a.id === handoff.agentId)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="block-card block-card--yellow"
        onClick={e => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 14, color: 'var(--yellow)' }}>⚑</span>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 12,
            color: 'var(--yellow)',
            letterSpacing: '0.1em',
            flex: 1,
          }}>
            REVIEW GATE
          </span>
          <span style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: 'var(--blue)',
            fontWeight: 600,
            marginRight: 12,
          }}>
            {task.sourceRef}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-3)',
              cursor: 'pointer',
              fontSize: 18,
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 18px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, lineHeight: 1.4 }}>
            {task.title}
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginBottom: 3 }}>AGENT</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'monospace', fontWeight: 600 }}>
                {agent?.name ?? handoff.agentId}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{agent?.role}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginBottom: 3 }}>ACTION</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'monospace', fontWeight: 600, textTransform: 'uppercase' }}>
                {handoff.action}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginBottom: 5 }}>SUMMARY</div>
            <div style={{
              fontSize: 12,
              color: 'var(--text-2)',
              lineHeight: 1.6,
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '10px 12px',
            }}>
              {handoff.summary}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: 10,
          padding: '12px 18px 16px',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            className="block-card block-card--green"
            onClick={onApprove}
            style={{
              flex: 1,
              padding: '9px 0',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: 'var(--green)',
            }}
          >
            APPROVE &amp; SEND
          </button>
          <button
            className="block-card block-card--red"
            onClick={onReject}
            style={{
              flex: 1,
              padding: '9px 0',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: 'var(--red)',
            }}
          >
            REJECT
          </button>
        </div>
      </div>
    </div>
  )
}
