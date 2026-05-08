import { useState, useEffect } from 'react'
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
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m ago`
}

function latencyColor(ms: number): string {
  if (ms < 100) return 'var(--green)'
  if (ms < 300) return 'var(--yellow)'
  return 'var(--red)'
}

function uptimeColor(pct: number): string {
  if (pct >= 99.9) return 'var(--green)'
  if (pct >= 99) return 'var(--yellow)'
  return 'var(--red)'
}

function useClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function ConnectorsPage() {
  const clock = useClock()
  const connected = CONNECTORS.filter(c => c.status === 'connected').length
  const totalErrors = CONNECTORS.reduce((sum, c) => sum + (c.health?.errorCount ?? 0), 0)
  const totalProcessed = CONNECTORS.reduce((sum, c) => sum + (c.health?.messagesProcessed ?? 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
            DASHBOARD / CONNECTORS
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            Connector Status
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
            {connected} of {CONNECTORS.length} connected · {totalProcessed.toLocaleString()} messages processed
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
          {clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        <SummaryCard label="CONNECTED" value={connected} color="var(--green)" />
        <SummaryCard label="DISCONNECTED" value={CONNECTORS.filter(c => c.status === 'disconnected').length} color="var(--text-3)" />
        <SummaryCard label="ERRORS" value={totalErrors} color={totalErrors > 0 ? 'var(--red)' : 'var(--green)'} />
        <SummaryCard label="AVG LATENCY" value={`${Math.round(CONNECTORS.filter(c => c.health).reduce((s, c) => s + (c.health?.latencyMs ?? 0), 0) / Math.max(1, CONNECTORS.filter(c => c.health && c.status === 'connected').length))}ms`} color="var(--blue)" />
      </div>

      {/* Connector cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONNECTORS.map(connector => (
          <div
            key={connector.id}
            className={cardVariant(connector.status)}
            style={{ padding: 0, overflow: 'hidden' }}
          >
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
            }}>
              <span className={ledClass(connector.status)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                  {connector.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  {connector.type.toUpperCase()} · ID: {connector.id}
                </div>
              </div>
              <span style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                color: statusColor(connector.status), textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '4px 10px', borderRadius: 4,
                background: `${statusColor(connector.status)}15`,
                border: `1px solid ${statusColor(connector.status)}40`,
              }}>
                {connector.status}
              </span>
            </div>

            {/* Health metrics grid */}
            {connector.health && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 1, background: 'var(--border)',
              }}>
                <HealthMetric label="LATENCY" value={`${connector.health.latencyMs}ms`} color={connector.status === 'connected' ? latencyColor(connector.health.latencyMs) : 'var(--text-3)'} />
                <HealthMetric label="ERRORS" value={String(connector.health.errorCount)} color={connector.health.errorCount > 5 ? 'var(--red)' : connector.health.errorCount > 0 ? 'var(--yellow)' : 'var(--green)'} />
                <HealthMetric label="UPTIME" value={`${connector.health.uptimePercent}%`} color={uptimeColor(connector.health.uptimePercent)} />
                <HealthMetric label="RATE LIMIT" value={`${connector.health.rateLimitRemaining}/200`} color={connector.health.rateLimitRemaining < 20 ? 'var(--red)' : 'var(--text-2)'} />
                <HealthMetric label="PROCESSED" value={connector.health.messagesProcessed.toLocaleString()} color="var(--text-2)" />
                <HealthMetric label="LAST SYNC" value={formatSync(connector.lastSync)} color={connector.status === 'connected' ? 'var(--green)' : 'var(--text-3)'} />
              </div>
            )}

            {/* Error details */}
            {connector.health?.lastError && (
              <div style={{
                padding: '10px 20px', borderTop: '1px solid var(--border)',
                background: 'rgba(248,81,73,0.04)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                  LAST ERROR
                </div>
                <div style={{ fontSize: 12, color: 'var(--red)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
                  {connector.health.lastError}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{
              display: 'flex', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--border)',
            }}>
              <button className="block-card" style={{
                padding: '6px 14px', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none',
                color: 'var(--blue)',
              }}>
                TEST CONNECTION
              </button>
              <button className="block-card" style={{
                padding: '6px 14px', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none',
                color: 'var(--text-2)',
              }}>
                VIEW LOGS
              </button>
              {connector.status !== 'connected' && (
                <button className="block-card block-card--green" style={{
                  padding: '6px 14px', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none',
                  color: 'var(--green)',
                }}>
                  RECONNECT
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="block-card" style={{ padding: '14px 16px' }}>
      <div style={{
        fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
        color, lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  )
}

function HealthMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '12px 14px', background: 'var(--bg-2)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
        color,
      }}>
        {value}
      </div>
    </div>
  )
}
