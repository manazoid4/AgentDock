import { Link, useLocation } from 'react-router-dom'
import { TASKS } from '../data/seed'

const navItems = [
  { icon: '⬡', label: 'Operations', path: '/dashboard' },
  { icon: '◈', label: 'Agents', path: '/dashboard/agents' },
  { icon: '⟶', label: 'Pipeline', path: '/dashboard/pipeline' },
  { icon: '≡', label: 'Audit Log', path: '/dashboard/logs' },
  { icon: '⚑', label: 'Review Gate', path: '/dashboard/review' },
  { icon: '⬡', label: 'Connectors', path: '/dashboard/connectors' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const pendingCount = TASKS.filter(t => t.status === 'awaiting-approval').length

  function isActive(path: string): boolean {
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(path)
  }

  return (
    <aside style={{
      width: 200, flexShrink: 0, background: 'var(--bg)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', paddingTop: 0, overflow: 'hidden',
    }}>
      {/* Logo mark */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8,
      }}>
        <span className="block-card block-card--blue" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700, fontSize: 16, color: 'var(--blue)', letterSpacing: '0.05em',
          marginBottom: 8, flexShrink: 0,
        }}>
          AD
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.18em',
        }}>
          AGENTDOCK
        </span>
      </div>

      {navItems.map(item => {
        const active = isActive(item.path)
        const showBadge = item.path === '/dashboard/review' && pendingCount > 0

        return (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
                background: active ? 'var(--bg-2)' : 'transparent', cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-2)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              <span style={{
                fontSize: 14, color: active ? 'var(--blue)' : 'var(--text-3)',
                width: 18, textAlign: 'center', flexShrink: 0,
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? 'white' : 'var(--text-2)',
                fontFamily: 'monospace', letterSpacing: '0.04em',
              }}>
                {item.label.toUpperCase()}
              </span>
              {showBadge && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--yellow)', color: 'var(--bg)',
                  borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {pendingCount}
                </span>
              )}
            </div>
          </Link>
        )
      })}

      {/* Footer info */}
      <div style={{
        marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--border)',
        fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1.6,
      }}>
        <div>v0.1.0 — demo mode</div>
        <div>Self-hosted · UK region</div>
      </div>
    </aside>
  )
}
