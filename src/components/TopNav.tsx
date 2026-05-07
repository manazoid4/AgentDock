import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Connector } from '../types'

function LiveClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')

  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: 'var(--text-3)',
      letterSpacing: '0.08em',
      userSelect: 'none',
    }}>
      {hh}:{mm}:{ss}
    </span>
  )
}

interface Props {
  pendingApprovals: number
  connectors: Connector[]
}

function connectorLedClass(status: Connector['status']): string {
  switch (status) {
    case 'connected': return 'status-led led-green'
    case 'error': return 'status-led led-red'
    default: return 'status-led led-grey'
  }
}

export default function TopNav({ pendingApprovals, connectors }: Props) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: 52,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      gap: 16,
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span className="block-card block-card--blue" style={{
          padding: '2px 7px',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.05em',
        }}>
          AD
        </span>
        <span style={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--text)',
          letterSpacing: '0.12em',
        }}>
          AGENTDOCK
        </span>
      </Link>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Connector status dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {connectors.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }} title={`${c.name}: ${c.status}`}>
            <span className={connectorLedClass(c.status)} />
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {c.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Live clock */}
      <LiveClock />

      {/* Pending approvals badge */}
      {pendingApprovals > 0 && (
        <Link to="/dashboard/review" style={{ textDecoration: 'none' }}>
          <span className="block-card block-card--yellow" style={{
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span className="status-led led-yellow led-pulse" />
            {pendingApprovals} PENDING REVIEW
          </span>
        </Link>
      )}

      {/* New Workflow button */}
      <button
        className="block-card block-card--blue"
        style={{
          padding: '4px 14px',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          color: 'var(--blue)',
        }}
        onClick={() => alert('New Workflow — coming soon')}
      >
        NEW WORKFLOW →
      </button>
    </nav>
  )
}
