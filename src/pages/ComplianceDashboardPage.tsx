import { COMPLIANCE_METRICS, ESCALATION_RULES, TASKS } from '../data/seed'

function statusColor(status: string): string {
  switch (status) {
    case 'compliant': return 'var(--green)'
    case 'at-risk': return 'var(--yellow)'
    case 'breached': return 'var(--red)'
    default: return 'var(--text-3)'
  }
}

function statusBg(status: string): string {
  switch (status) {
    case 'compliant': return 'rgba(63,185,80,0.1)'
    case 'at-risk': return 'rgba(210,153,34,0.1)'
    case 'breached': return 'rgba(248,81,73,0.1)'
    default: return 'var(--bg-3)'
  }
}

function statusBorder(status: string): string {
  switch (status) {
    case 'compliant': return 'var(--green-dark)'
    case 'at-risk': return 'var(--yellow-dark)'
    case 'breached': return 'var(--red-dark)'
    default: return 'var(--border)'
  }
}

function trendIcon(trend: string): string {
  switch (trend) {
    case 'up': return '↑'
    case 'down': return '↓'
    default: return '→'
  }
}

function trendColor(trend: string): string {
  switch (trend) {
    case 'up': return 'var(--green)'
    case 'down': return 'var(--red)'
    default: return 'var(--text-3)'
  }
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const frameworks = [
  { key: 'FCA', label: 'FCA DISP', icon: '⬡', color: 'var(--blue)' },
  { key: 'Ofcom', label: 'Ofcom GC', icon: '◈', color: 'var(--purple)' },
  { key: 'GDPR', label: 'GDPR', icon: '✓', color: 'var(--green)' },
  { key: 'DataResidency', label: 'Data Residency', icon: '⌂', color: 'var(--yellow)' },
  { key: 'Internal', label: 'Internal SLA', icon: '◆', color: 'var(--text-2)' },
]

export default function ComplianceDashboardPage() {
  const compliantCount = COMPLIANCE_METRICS.filter(m => m.status === 'compliant').length
  const atRiskCount = COMPLIANCE_METRICS.filter(m => m.status === 'at-risk').length
  const breachedCount = COMPLIANCE_METRICS.filter(m => m.status === 'breached').length
  const overallScore = Math.round((compliantCount / COMPLIANCE_METRICS.length) * 100)

  const activeEscalations = ESCALATION_RULES.filter(r => r.active)
  const complaintsNearDeadline = TASKS.filter(t => {
    const age = Date.now() - new Date(t.createdAt).getTime()
    const days = Math.floor(age / 86400000)
    return days > 40
  })

  function exportCSV() {
    const headers = ['Framework', 'Metric', 'Status', 'Value', 'Detail', 'Last Checked', 'Trend']
    const rows = COMPLIANCE_METRICS.map(m => [
      m.framework, m.name, m.status, m.value,
      `"${m.detail.replace(/"/g, '""')}"`,
      new Date(m.lastChecked).toLocaleString('en-GB'),
      m.trend,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agentdock-compliance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
            DASHBOARD / COMPLIANCE
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            Compliance Dashboard
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
            Real-time compliance posture · FCA · Ofcom · GDPR · Data Residency
          </div>
        </div>
        <button className="block-card block-card--green" onClick={exportCSV} style={{
          padding: '7px 16px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--green)',
        }}>
          EXPORT COMPLIANCE REPORT
        </button>
      </div>

      {/* Overall Score */}
      <div className={`block-card ${overallScore >= 90 ? 'block-card--green' : overallScore >= 70 ? 'block-card--yellow' : 'block-card--red'}`} style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: `4px solid ${statusColor(overallScore >= 90 ? 'compliant' : overallScore >= 70 ? 'at-risk' : 'breached')}`,
              display: 'grid', placeItems: 'center',
              background: statusBg(overallScore >= 90 ? 'compliant' : overallScore >= 70 ? 'at-risk' : 'breached'),
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: statusColor(overallScore >= 90 ? 'compliant' : overallScore >= 70 ? 'at-risk' : 'breached') }}>
                {overallScore}%
              </span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Overall Compliance Score
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                {compliantCount} of {COMPLIANCE_METRICS.length} checks passing
                {atRiskCount > 0 && <span style={{ color: 'var(--yellow)' }}> · {atRiskCount} at risk</span>}
                {breachedCount > 0 && <span style={{ color: 'var(--red)' }}> · {breachedCount} breached</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--green)' }}>{compliantCount}</div>
              <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>COMPLIANT</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--yellow)' }}>{atRiskCount}</div>
              <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>AT RISK</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--red)' }}>{breachedCount}</div>
              <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>BREACHED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert: Complaints Near Deadline */}
      {complaintsNearDeadline.length > 0 && (
        <div className="block-card block-card--yellow" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="status-led led-yellow led-pulse" />
          <span style={{ fontSize: 12, color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            DEADLINE ALERT
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
            {complaintsNearDeadline.length} complaint{complaintsNearDeadline.length > 1 ? 's' : ''} approaching FCA 8-week deadline:
          </span>
          <span style={{ fontSize: 12, color: 'var(--blue)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            {complaintsNearDeadline.map(t => t.sourceRef).join(', ')}
          </span>
        </div>
      )}

      {/* Framework Sections */}
      {frameworks.map(fw => {
        const metrics = COMPLIANCE_METRICS.filter(m => m.framework === fw.key)
        if (metrics.length === 0) return null
        const fwCompliant = metrics.filter(m => m.status === 'compliant').length

        return (
          <div key={fw.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: fw.color }}>{fw.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                {fw.label}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                {fwCompliant}/{metrics.length} passing
              </span>
              <div style={{ flex: 1, height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  width: `${(fwCompliant / metrics.length) * 100}%`,
                  height: '100%',
                  background: fwCompliant === metrics.length ? 'var(--green)' : 'var(--yellow)',
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
              {metrics.map(metric => (
                <div key={metric.id} className="block-card" style={{
                  padding: '14px 16px',
                  borderLeft: `3px solid ${statusColor(metric.status)}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.4 }}>
                      {metric.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                      <span style={{ fontSize: 10, color: trendColor(metric.trend) }}>{trendIcon(metric.trend)}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 4,
                        background: statusBg(metric.status), color: statusColor(metric.status),
                        border: `1px solid ${statusBorder(metric.status)}`,
                      }}>
                        {metric.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: statusColor(metric.status), marginBottom: 6 }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 6 }}>
                    {metric.detail}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Last checked: {formatRelative(metric.lastChecked)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Escalation Rules */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--red)' }}>⚑</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
            ESCALATION RULES
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
            {activeEscalations.length} active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          {activeEscalations.map(rule => (
            <div key={rule.id} className="block-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="status-led led-green" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{rule.name}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                Escalate after <strong style={{ color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace" }}>{rule.thresholdHours}h</strong> to{' '}
                <strong style={{ color: 'var(--blue)' }}>{rule.escalateTo}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Residency Status */}
      <div className="block-card block-card--green" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="status-led led-green" />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
            DATA RESIDENCY — UK
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>REGION</div>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>AWS eu-west-2 (London)</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>ENCRYPTION AT REST</div>
            <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>AES-256 Enabled</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>ENCRYPTION IN TRANSIT</div>
            <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>TLS 1.3</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>CROSS-BORDER TRANSFERS</div>
            <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>None detected</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>AUDIT RETENTION</div>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>1 year (configurable)</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 4 }}>TOKEN STORAGE</div>
            <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>Encrypted</div>
          </div>
        </div>
      </div>
    </div>
  )
}
