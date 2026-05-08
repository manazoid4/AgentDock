import { useState, useMemo } from 'react'
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
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

const ACTION_TYPES: HandoffAction[] = ['triage', 'draft', 'update', 'escalate', 'resolve', 'log']

export default function HandoffLogPage() {
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterAgent, setFilterAgent] = useState('')
  const [filterTicket, setFilterTicket] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = useMemo(() =>
    [...HANDOFFS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    []
  )

  const filtered = useMemo(() => sorted.filter(h => {
    if (search) {
      const s = search.toLowerCase()
      const agent = AGENTS.find(a => a.id === h.agentId)
      const task = TASKS.find(t => t.id === h.taskId)
      const searchable = [
        h.summary, h.action, h.id,
        agent?.name, agent?.role,
        task?.sourceRef, task?.title,
      ].join(' ').toLowerCase()
      if (!searchable.includes(s)) return false
    }
    if (dateFrom && new Date(h.createdAt) < new Date(dateFrom)) return false
    if (dateTo && new Date(h.createdAt) > new Date(dateTo + 'T23:59:59')) return false
    if (filterAgent && h.agentId !== filterAgent) return false
    if (filterTicket) {
      const task = TASKS.find(t => t.id === h.taskId)
      if (!task?.sourceRef.toLowerCase().includes(filterTicket.toLowerCase())) return false
    }
    if (filterAction && h.action !== filterAction) return false
    return true
  }), [sorted, search, dateFrom, dateTo, filterAgent, filterTicket, filterAction])

  const totalEntries = HANDOFFS.length
  const filteredCount = filtered.length
  const pendingCount = filtered.filter(h => h.approvalRequired && !h.approvedBy).length
  const approvedCount = filtered.filter(h => h.approvedBy).length

  function exportCSV() {
    const headers = ['ID', 'Timestamp', 'Agent', 'Role', 'Task Ref', 'Action', 'Summary', 'Approval Required', 'Approved By', 'Approved At']
    const rows = filtered.map(h => {
      const agent = AGENTS.find(a => a.id === h.agentId)
      const task = TASKS.find(t => t.id === h.taskId)
      return [
        h.id,
        formatDateTime(h.createdAt),
        agent?.name ?? h.agentId,
        agent?.role ?? '',
        task?.sourceRef ?? h.taskId,
        h.action,
        `"${h.summary.replace(/"/g, '""')}"`,
        h.approvalRequired ? 'Yes' : 'No',
        h.approvedBy ?? 'N/A',
        h.approvedAt ? formatDateTime(h.approvedAt) : 'N/A',
      ]
    })
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agentdock-audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`<!DOCTYPE html><html><head><title>AgentDock Audit Log</title>
<style>
body{font-family:'Inter',system-ui,sans-serif;background:#0D1117;color:#E6EDF3;padding:32px;font-size:12px}
h1{font-size:20px;margin:0 0 4px;color:#58A6FF;font-family:'JetBrains Mono',monospace}
.meta{color:#8B949E;font-size:11px;margin-bottom:24px;font-family:'JetBrains Mono',monospace}
table{width:100%;border-collapse:collapse;margin-top:16px}
th{text-align:left;padding:8px 10px;border-bottom:2px solid #30363D;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#8B949E;font-family:'JetBrains Mono',monospace}
td{padding:8px 10px;border-bottom:1px solid #21262D;font-size:11px;color:#E6EDF3}
.critical{color:#F85149;font-weight:700}
.warning{color:#D29922;font-weight:700}
.info{color:#3FB950}
</style></head><body>`)
    printWindow.document.write(`<h1>AgentDock — Audit Log Export</h1>`)
    printWindow.document.write(`<div class="meta">Generated: ${new Date().toLocaleString('en-GB')} · ${filteredCount} entries · Filters: ${search || 'none'}</div>`)
    printWindow.document.write('<table><thead><tr><th>Time</th><th>Agent</th><th>Ref</th><th>Action</th><th>Summary</th><th>Approval</th></tr></thead><tbody>')
    filtered.forEach(h => {
      const agent = AGENTS.find(a => a.id === h.agentId)
      const task = TASKS.find(t => t.id === h.taskId)
      const sevClass = h.action === 'escalate' ? 'critical' : h.action === 'draft' ? 'warning' : 'info'
      printWindow.document.write(`<tr>
        <td style="white-space:nowrap;font-family:'JetBrains Mono',monospace;font-size:10px">${formatDateTime(h.createdAt)}</td>
        <td>${agent?.name ?? h.agentId}<br><span style="color:#8B949E;font-size:10px">${agent?.role ?? ''}</span></td>
        <td style="font-family:'JetBrains Mono',monospace;color:#58A6FF;font-weight:600">${task?.sourceRef ?? h.taskId}</td>
        <td class="${sevClass}" style="text-transform:uppercase;font-size:10px;font-weight:700">${h.action}</td>
        <td style="max-width:300px;line-height:1.4">${h.summary}</td>
        <td style="white-space:nowrap">${h.approvalRequired ? (h.approvedBy ? '<span class="info">APPROVED</span>' : '<span class="warning">PENDING</span>') : '<span style="color:#484F58">AUTO</span>'}</td>
      </tr>`)
    })
    printWindow.document.write('</tbody></table>')
    printWindow.document.write(`<div class="meta" style="margin-top:24px">AgentDock v0.1.0 · Self-hosted · UK region · Immutable audit trail</div>`)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const hasActiveFilters = search || dateFrom || dateTo || filterAgent || filterTicket || filterAction

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
            DASHBOARD / COMPLIANCE AUDIT LOG
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            Audit Log
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
            {totalEntries} total entries · {filteredCount} shown · {pendingCount} pending approval
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="block-card block-card--green" onClick={exportCSV} style={{
            padding: '7px 16px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--green)',
          }}>
            EXPORT CSV
          </button>
          <button className="block-card block-card--blue" onClick={exportPDF} style={{
            padding: '7px 16px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--blue)',
          }}>
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* Compliance Banner */}
      <div className="block-card block-card--green" style={{
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 12, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span className="status-led led-green" />
        <strong>AUDIT TRAIL ACTIVE</strong>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--text-2)' }}>{approvedCount} approved</span>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--yellow)' }}>{pendingCount} pending</span>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--text-2)' }}>Immutable · Tamper-evident</span>
      </div>

      {/* Filters */}
      <div className="block-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            FILTERS
          </span>
          {hasActiveFilters && (
            <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setFilterAgent(''); setFilterTicket(''); setFilterAction('') }}
              style={{ fontSize: 10, color: 'var(--red)', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700 }}>
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search entries — agent, ticket, action, summary..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px', borderRadius: 6,
              border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)',
              fontSize: 12, fontFamily: 'inherit', outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 14 }}>⌕</span>
        </div>

        {/* Filter Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          <div>
            <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              DATE FROM
            </label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              DATE TO
            </label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              AGENT
            </label>
            <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}>
              <option value="">All agents</option>
              {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              TICKET REF
            </label>
            <input type="text" placeholder="e.g. SN-20987" value={filterTicket} onChange={e => setFilterTicket(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              ACTION TYPE
            </label>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}>
              <option value="">All actions</option>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Entries */}
      {filtered.length === 0 && (
        <div className="block-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          NO ENTRIES MATCH YOUR FILTERS
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(handoff => {
          const agent = AGENTS.find(a => a.id === handoff.agentId)
          const task = TASKS.find(t => t.id === handoff.taskId)
          const isExpanded = expandedId === handoff.id

          return (
            <div key={handoff.id}>
              <div
                className={actionVariant(handoff.action)}
                style={{
                  padding: '10px 14px',
                  display: 'grid',
                  gridTemplateColumns: '90px 140px 90px 80px 1fr 100px 30px',
                  gap: 12,
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(isExpanded ? null : handoff.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)', fontWeight: 600 }}>
                    {formatTime(handoff.createdAt)}
                  </span>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-3)' }}>
                    {formatDate(handoff.createdAt)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {agent?.name ?? handoff.agentId}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {agent?.role}
                  </span>
                </div>

                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                  {task?.sourceRef ?? handoff.taskId}
                </span>

                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  color: actionColor(handoff.action),
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: `1px solid ${actionColor(handoff.action)}`,
                  borderRadius: 3,
                  padding: '2px 6px',
                  textAlign: 'center',
                }}>
                  {handoff.action}
                </span>

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

                <div style={{ textAlign: 'right' }}>
                  {handoff.approvalRequired ? (
                    handoff.approvedBy ? (
                      <span style={{ fontSize: 9, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        APPROVED
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        PENDING
                      </span>
                    )
                  ) : (
                    <span style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                      AUTO
                    </span>
                  )}
                </div>

                <span style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center' }}>
                  {isExpanded ? '▾' : '▸'}
                </span>
              </div>

              {isExpanded && (
                <div style={{
                  padding: '12px 14px 12px 24px',
                  background: 'var(--bg-3)',
                  borderLeft: '3px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>FULL TIMESTAMP</div>
                      <div style={{ fontSize: 11, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{formatDateTime(handoff.createdAt)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>ENTRY ID</div>
                      <div style={{ fontSize: 11, color: 'var(--blue)', fontFamily: "'JetBrains Mono', monospace" }}>{handoff.id}</div>
                    </div>
                    {task && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>TASK</div>
                        <div style={{ fontSize: 11, color: 'var(--text)' }}>{task.title}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>FULL SUMMARY</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>{handoff.summary}</div>
                  </div>
                  {handoff.approvedBy && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>APPROVED BY</div>
                        <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{handoff.approvedBy}</div>
                      </div>
                      {handoff.approvedAt && (
                        <div>
                          <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>APPROVED AT</div>
                          <div style={{ fontSize: 11, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{formatDateTime(handoff.approvedAt)}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
