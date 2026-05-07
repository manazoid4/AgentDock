import type { Agent } from '../types'
import { AgentStatusBadge } from './StatusBadge'

interface Props { agent: Agent }

const providerLabel: Record<Agent['provider'], string> = {
  openai:    'GPT-4o',
  anthropic: 'Claude 3.5',
  local:     'Local LLM',
}

function ledClass(status: Agent['status']): string {
  switch (status) {
    case 'running': return 'status-led led-green led-pulse'
    case 'waiting': return 'status-led led-yellow led-pulse'
    case 'error':   return 'status-led led-red'
    default:        return 'status-led led-grey'
  }
}

function cardVariant(status: Agent['status']): string {
  switch (status) {
    case 'running': return 'block-card block-card--green'
    case 'waiting': return 'block-card block-card--yellow'
    case 'error':   return 'block-card block-card--red'
    default:        return 'block-card'
  }
}

function formatTime(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function AgentCard({ agent }: Props) {
  return (
    <div className={cardVariant(agent.status)} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={ledClass(agent.status)} />
        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {agent.name}
        </span>
        <AgentStatusBadge status={agent.status} />
      </div>

      {/* Role */}
      <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.04em' }}>{agent.role}</div>

      {/* Provider + model chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 7px', fontSize: 10, color: 'var(--purple)', fontFamily: 'monospace', fontWeight: 600 }}>
          {providerLabel[agent.provider]}
        </span>
        <span style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 7px', fontSize: 10, color: 'var(--text-2)', fontFamily: 'monospace' }}>
          {agent.model}
        </span>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Current task */}
      <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
        <span style={{ color: 'var(--text-3)', marginRight: 4 }}>TASK</span>
        <span style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{agent.currentWorkflowId ?? 'IDLE'}</span>
      </div>

      {/* Last action */}
      {agent.lastAction && (
        <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>
          <div style={{ color: 'var(--text-3)', marginBottom: 2 }}>LAST ACTION</div>
          <div style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {agent.lastAction}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', textAlign: 'right' }}>
        {formatTime(agent.lastActionAt)}
      </div>
    </div>
  )
}
