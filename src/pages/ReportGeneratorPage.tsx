import { useState } from 'react'
import { COMPLIANCE_METRICS, APPROVAL_RECORDS, AGENTS, TASKS, HANDOFFS } from '../data/seed'

type ReportType = 'monthly' | 'incident' | 'agent-performance' | 'custom'

const REPORT_TEMPLATES = [
  {
    type: 'monthly' as ReportType,
    title: 'Monthly Compliance Report',
    icon: '◈',
    desc: 'FCA DISP, Ofcom GC, GDPR status for the reporting period. Includes all metrics, trends, and exceptions.',
    color: 'var(--blue)',
  },
  {
    type: 'incident' as ReportType,
    title: 'Incident Summary Report',
    icon: '⚑',
    desc: 'All incidents handled in the period. Resolution times, escalation paths, and compliance outcomes.',
    color: 'var(--red)',
  },
  {
    type: 'agent-performance' as ReportType,
    title: 'Agent Performance Report',
    icon: '⬡',
    desc: 'Per-agent metrics: actions taken, approval rates, response times, and error counts.',
    color: 'var(--green)',
  },
  {
    type: 'custom' as ReportType,
    title: 'Custom Report',
    icon: '◆',
    desc: 'Build a custom report with selected metrics, date range, and export format.',
    color: 'var(--purple)',
  },
]

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ReportGeneratorPage() {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)
  const [dateFrom, setDateFrom] = useState('2026-04-01')
  const [dateTo, setDateTo] = useState('2026-05-01')
  const [generated, setGenerated] = useState(false)

  const compliantCount = COMPLIANCE_METRICS.filter(m => m.status === 'compliant').length
  const atRiskCount = COMPLIANCE_METRICS.filter(m => m.status === 'at-risk').length
  const totalApprovals = APPROVAL_RECORDS.length
  const approvedApprovals = APPROVAL_RECORDS.filter(a => a.decision === 'approved').length
  const rejectedApprovals = APPROVAL_RECORDS.filter(a => a.decision === 'rejected').length

  function generateReport() {
    setGenerated(true)
    setTimeout(() => setGenerated(false), 5000)
  }

  function exportCSV() {
    let headers: string[] = []
    let rows: string[][] = []

    if (selectedType === 'monthly') {
      headers = ['Framework', 'Metric', 'Status', 'Value', 'Detail', 'Last Checked', 'Trend']
      rows = COMPLIANCE_METRICS.map(m => [
        m.framework, m.name, m.status, m.value,
        `"${m.detail.replace(/"/g, '""')}"`,
        formatDate(m.lastChecked), m.trend,
      ])
    } else if (selectedType === 'incident') {
      headers = ['Task Ref', 'Title', 'Priority', 'Status', 'Created', 'Updated', 'Source']
      rows = TASKS.map(t => [
        t.sourceRef, `"${t.title.replace(/"/g, '""')}"`, t.priority, t.status,
        formatDateTime(t.createdAt), formatDateTime(t.updatedAt), t.sourceSystem,
      ])
    } else if (selectedType === 'agent-performance') {
      headers = ['Agent', 'Role', 'Status', 'Last Action', 'Last Action At', 'Connected System']
      rows = AGENTS.map(a => [
        a.name, a.role, a.status,
        `"${(a.lastAction ?? '').replace(/"/g, '""')}"`,
        a.lastActionAt ? formatDateTime(a.lastActionAt) : 'N/A',
        a.connectedSystem ?? 'N/A',
      ])
    } else {
      headers = ['ID', 'Timestamp', 'Agent', 'Task Ref', 'Action', 'Summary', 'Approval']
      rows = HANDOFFS.map(h => [
        h.id, formatDateTime(h.createdAt), h.agentId, h.taskId, h.action,
        `"${h.summary.replace(/"/g, '""')}"`,
        h.approvalRequired ? (h.approvedBy ? 'Approved' : 'Pending') : 'Auto',
      ])
    }

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agentdock-report-${selectedType}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const template = REPORT_TEMPLATES.find(t => t.type === selectedType)

    printWindow.document.write(`<!DOCTYPE html><html><head><title>AgentDock Report</title>
<style>
body{font-family:'Inter',system-ui,sans-serif;background:#0D1117;color:#E6EDF3;padding:40px;font-size:12px}
h1{font-size:22px;margin:0 0 4px;color:#58A6FF;font-family:'JetBrains Mono',monospace}
h2{font-size:16px;margin:24px 0 12px;color:#E6EDF3;font-family:'JetBrains Mono',monospace;border-bottom:1px solid #30363D;padding-bottom:8px}
.meta{color:#8B949E;font-size:11px;margin-bottom:24px;font-family:'JetBrains Mono',monospace}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:16px 0}
.stat{text-align:center;padding:16px;background:#161B22;border:1px solid #30363D;border-radius:6px}
.stat-val{font-size:28px;font-weight:700;font-family:'JetBrains Mono',monospace}
.stat-label{font-size:9px;color:#8B949E;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px;font-family:'JetBrains Mono',monospace}
table{width:100%;border-collapse:collapse;margin-top:12px}
th{text-align:left;padding:8px 10px;border-bottom:2px solid #30363D;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#8B949E;font-family:'JetBrains Mono',monospace}
td{padding:8px 10px;border-bottom:1px solid #21262D;font-size:11px}
.green{color:#3FB950}.yellow{color:#D29922}.red{color:#F85149}.blue{color:#58A6FF}
.footer{margin-top:32px;padding-top:16px;border-top:1px solid #30363D;color:#484F58;font-size:10px;font-family:'JetBrains Mono',monospace}
</style></head><body>`)

    printWindow.document.write(`<h1>AgentDock — ${template?.title ?? 'Report'}</h1>`)
    printWindow.document.write(`<div class="meta">Generated: ${new Date().toLocaleString('en-GB')} · Period: ${formatDate(dateFrom)} to ${formatDate(dateTo)}</div>`)

    if (selectedType === 'monthly') {
      printWindow.document.write(`<div class="stat-grid">
        <div class="stat"><div class="stat-val green">${compliantCount}</div><div class="stat-label">Compliant</div></div>
        <div class="stat"><div class="stat-val yellow">${atRiskCount}</div><div class="stat-label">At Risk</div></div>
        <div class="stat"><div class="stat-val blue">${totalApprovals}</div><div class="stat-label">Approvals</div></div>
        <div class="stat"><div class="stat-val green">${Math.round((approvedApprovals/totalApprovals)*100)}%</div><div class="stat-label">Approval Rate</div></div>
      </div>`)
      printWindow.document.write('<h2>Compliance Metrics</h2>')
      printWindow.document.write('<table><thead><tr><th>Framework</th><th>Metric</th><th>Status</th><th>Value</th><th>Detail</th></tr></thead><tbody>')
      COMPLIANCE_METRICS.forEach(m => {
        const cls = m.status === 'compliant' ? 'green' : m.status === 'at-risk' ? 'yellow' : 'red'
        printWindow.document.write(`<tr><td>${m.framework}</td><td>${m.name}</td><td class="${cls}">${m.status.toUpperCase()}</td><td>${m.value}</td><td>${m.detail}</td></tr>`)
      })
      printWindow.document.write('</tbody></table>')
    } else if (selectedType === 'incident') {
      printWindow.document.write('<h2>Incidents</h2>')
      printWindow.document.write('<table><thead><tr><th>Ref</th><th>Title</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead><tbody>')
      TASKS.forEach(t => {
        const pcls = t.priority === 'critical' ? 'red' : t.priority === 'high' ? 'yellow' : t.priority === 'medium' ? 'blue' : ''
        printWindow.document.write(`<tr><td class="blue">${t.sourceRef}</td><td>${t.title}</td><td class="${pcls}">${t.priority.toUpperCase()}</td><td>${t.status}</td><td>${formatDateTime(t.createdAt)}</td></tr>`)
      })
      printWindow.document.write('</tbody></table>')
    } else if (selectedType === 'agent-performance') {
      printWindow.document.write('<h2>Agent Performance</h2>')
      printWindow.document.write('<table><thead><tr><th>Agent</th><th>Role</th><th>Status</th><th>Last Action</th><th>System</th></tr></thead><tbody>')
      AGENTS.forEach(a => {
        const scls = a.status === 'running' ? 'green' : a.status === 'waiting' ? 'yellow' : ''
        printWindow.document.write(`<tr><td>${a.name}</td><td>${a.role}</td><td class="${scls}">${a.status.toUpperCase()}</td><td>${a.lastAction ?? 'N/A'}</td><td>${a.connectedSystem ?? 'N/A'}</td></tr>`)
      })
      printWindow.document.write('</tbody></table>')
    }

    printWindow.document.write(`<div class="footer">AgentDock v0.1.0 · Self-hosted · UK region · Immutable audit trail · Generated ${new Date().toISOString()}</div>`)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / REPORTS
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
          Report Generator
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
          Generate compliance-ready reports for auditors and management
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 10 }}>
          SELECT REPORT TYPE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {REPORT_TEMPLATES.map(t => (
            <button key={t.type} onClick={() => { setSelectedType(t.type); setGenerated(false) }}
              className={`block-card ${selectedType === t.type ? 'block-card--blue' : ''}`}
              style={{
                padding: '16px 18px', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none',
                display: 'flex', flexDirection: 'column', gap: 10,
                borderColor: selectedType === t.type ? 'var(--blue-dark)' : undefined,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, color: t.color }}>{t.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{t.title}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>
                {t.desc}
              </p>
              {selectedType === t.type && (
                <span style={{ fontSize: 9, color: 'var(--blue)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.06em' }}>
                  SELECTED
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Report Config */}
      {selectedType && (
        <div className="block-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            REPORT CONFIGURATION
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                REPORTING PERIOD FROM
              </label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                REPORTING PERIOD TO
              </label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                EXPORT FORMAT
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="block-card block-card--green" onClick={exportCSV} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--green)',
                }}>
                  CSV
                </button>
                <button className="block-card block-card--blue" onClick={exportPDF} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--blue)',
                }}>
                  PDF
                </button>
              </div>
            </div>
          </div>
          <button onClick={generateReport} className="block-card block-card--blue" style={{
            padding: '10px 0', fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--blue)',
            marginTop: 4,
          }}>
            GENERATE REPORT
          </button>
        </div>
      )}

      {/* Generated Confirmation */}
      {generated && (
        <div className="block-card block-card--green" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="status-led led-green led-pulse" />
          <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            REPORT GENERATED
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
            Use the export buttons above to download in your preferred format.
          </span>
        </div>
      )}

      {/* Quick Stats Preview */}
      {selectedType === 'monthly' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          <div className="block-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--green)' }}>{compliantCount}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 4 }}>COMPLIANT CHECKS</div>
          </div>
          <div className="block-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--yellow)' }}>{atRiskCount}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 4 }}>AT RISK</div>
          </div>
          <div className="block-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--blue)' }}>{totalApprovals}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 4 }}>TOTAL APPROVALS</div>
          </div>
          <div className="block-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--green)' }}>{Math.round((approvedApprovals / totalApprovals) * 100)}%</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 4 }}>APPROVAL RATE</div>
          </div>
          <div className="block-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--red)' }}>{rejectedApprovals}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 4 }}>REJECTED</div>
          </div>
        </div>
      )}
    </div>
  )
}
