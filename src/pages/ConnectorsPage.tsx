import { CONNECTORS } from '../data/seed'
import type { Connector } from '../types'

function cardVariant(status: Connector['status']): string {
  switch (status) {
    case 'connected':    return 'block-card block-card--green'
    case 'error':        return 'block-card block-card--red'
    default:             return 'block-card'
  }
}

function ledClass(status: Connector['status']): string {
  switch (status) {
    case 'connected':    return 'status-led led-green led-pulse'
    case 'error':        return 'status-led led-red'
    default:             return 'status-led led-grey'
  }
}

function statusColor(status: Connector['status']): string {
  switch (status) {
    case 'connected':    return 'var(--green)'
    case 'error':        return 'var(--red)'
    default:             return 'var(--text-3)'
  }
}

function formatSync(iso?: string): string {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function ConnectorsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / CONNECTORS
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          Connectors
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace', marginTop: 4 }}>
          {CONNECTORS.filter(c => c.status === 'connected').length} of {CONNECTORS.length} connected
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {CONNECTORS.map(connector => (
          <div
            key={connector.id}
            className={cardVariant(connector.status)}
            style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={ledClass(connector.status)} />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--text)', flex: 1 }}>
                {connector.name}
              </span>
            </div>

            <div>
              <span style={{
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 3,
                padding: '2px 8px',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'var(--purple)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {connector.type}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginBottom: 2 }}>STATUS</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: statusColor(connector.status), textTransform: 'uppercase' }}>
                  {connector.status}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', marginBottom: 2 }}>LAST SYNC</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-2)' }}>
                  {formatSync(connector.lastSync)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
