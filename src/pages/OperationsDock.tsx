import { useState, useRef, useCallback, useEffect } from 'react'
import AgentCard from '../components/AgentCard'
import TaskCard from '../components/TaskCard'
import { AGENTS, TASKS } from '../data/seed'
import type { AuditLogEntry, P1Ticket, DemoApproval } from '../types'

const P1_STAGES = [
  { label: 'TRIGGER', desc: 'Ticket lands in ServiceNow' },
  { label: 'TRIAGE', desc: 'Agent classifies severity' },
  { label: 'DRAFT', desc: 'Response prepared from policy' },
  { label: 'REVIEW', desc: 'Human checkpoint' },
  { label: 'SEND', desc: 'Approved action executes' },
  { label: 'LOG', desc: 'Audit trail locked' },
]

const P1_FLOW = [
  {
    phase: 0,
    stage: 'TRIGGER',
    agentId: 'agent-001',
    event: 'P1 ticket SN-22104 received — "Complete fibre outage, 47 business customers down"',
    audit: { action: 'Ticket received', detail: 'SN-22104: Fibre backbone failure — 47 B2B customers affected. Auto-flagged P1 by ServiceNow SLA policy.', severity: 'critical' as const },
  },
  {
    phase: 1,
    stage: 'TRIAGE',
    agentId: 'agent-001',
    event: 'Triage: Confirmed P1. VIP flag set. 47 B2B accounts impacted. SLA clock: 4 hours.',
    audit: { action: 'Triage complete', detail: 'Reclassified from P2 to P1. Impact: 47 B2B customers across London SE1-SE4. VIP accounts: 8. SLA breach window: 4 hours. Recommended: immediate engineer dispatch + mass customer notification.', severity: 'critical' as const },
  },
  {
    phase: 2,
    stage: 'DRAFT',
    agentId: 'agent-002',
    event: 'Draft Agent: First response + mass notification drafted. Awaiting approval.',
    audit: { action: 'Response drafted', detail: 'Two drafts prepared: (1) Individual response to each affected B2B account with incident ref and ETA placeholder. (2) Mass notification template for status page. Tone: factual, no ETA commitment until engineer assessment complete.', severity: 'warning' as const },
  },
  {
    phase: 3,
    stage: 'REVIEW',
    agentId: 'agent-002',
    event: '⚑ REVIEW GATE: Mass notification requires human approval before sending to 47 customers.',
    audit: { action: 'Review gate triggered', detail: 'Mass customer notification requires approval. 47 B2B accounts will receive this message. Risk: incorrect ETA or overpromise could trigger contract penalties.', severity: 'warning' as const, requiresApproval: true },
  },
  {
    phase: 4,
    stage: 'SEND',
    agentId: 'agent-002',
    event: 'Approved. Notifications sent to 47 affected accounts. Status page updated.',
    audit: { action: 'Notifications sent', detail: '47 individual B2B notifications delivered via ServiceNow. Status page updated with incident banner. All messages logged with timestamp. Approved by: demo@agentdock.io', severity: 'info' as const },
  },
  {
    phase: 5,
    stage: 'TRIAGE',
    agentId: 'agent-003',
    event: 'Escalation Agent: Dispatched 2 senior engineers. ETA 45 min to exchange.',
    audit: { action: 'Engineers dispatched', detail: '2 senior fibre engineers assigned: R. Patel (SE1-SE3 zone), M. Khan (SE4 zone). Dispatched from London Bridge depot. ETA 45 minutes. Fault likely at Holborn exchange — cross-connect panel failure suspected.', severity: 'info' as const },
  },
  {
    phase: 6,
    stage: 'DRAFT',
    agentId: 'agent-004',
    event: 'Compliance Agent: FCA clock check — all 47 complaints logged within SLA window.',
    audit: { action: 'Compliance check passed', detail: 'All 47 B2B complaints logged within 3 minutes of P1 trigger. FCA DISP 1.4 compliance: prompt handling confirmed. ADR deadline tracking started for each account. 8-week clock: Day 0 of 56.', severity: 'info' as const },
  },
  {
    phase: 7,
    stage: 'SEND',
    agentId: 'agent-003',
    event: 'Engineers on-site. Root cause identified: failed cross-connect at Holborn exchange.',
    audit: { action: 'Root cause identified', detail: 'Engineers confirmed: cross-connect panel failure at Holborn exchange. Replacement parts en route from Croydon depot. Estimated repair: 90 minutes. Update to be sent to affected customers.', severity: 'info' as const },
  },
  {
    phase: 8,
    stage: 'REVIEW',
    agentId: 'agent-002',
    event: '⚑ REVIEW GATE: Customer update with 90-min repair ETA requires approval.',
    audit: { action: 'Review gate triggered', detail: 'Customer update drafted with repair ETA of 90 minutes. Requires approval before sending — ETA commitment carries contractual risk if missed.', severity: 'warning' as const, requiresApproval: true },
  },
  {
    phase: 9,
    stage: 'LOG',
    agentId: 'agent-004',
    event: 'P1 resolved. Full audit trail exported. 47 complaints closed. Compliance: PASSED.',
    audit: { action: 'Incident resolved', detail: 'Fibre restored at 11:34. Total outage: 2h 17m. All 47 customer complaints resolved. Audit trail: 12 entries, CSV exported. FCA compliance: all deadlines met. Average response time: 4.2 min.', severity: 'info' as const },
  },
]

function useClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ${m % 60}m ago`
}

export default function OperationsDock() {
  const clock = useClock()
  const [demoMode, setDemoMode] = useState(false)
  const [demoAgents, setDemoAgents] = useState(AGENTS)
  const [demoEvent, setDemoEvent] = useState<string | null>(null)
  const [p1Ticket, setP1Ticket] = useState<P1Ticket | null>(null)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pendingApproval, setPendingApproval] = useState<DemoApproval | null>(null)
  const [metrics, setMetrics] = useState({
    ticketsProcessed: 23,
    avgResolutionMin: 18,
    approvalRate: 94,
    complianceScore: 97,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef(0)
  const auditIdRef = useRef(100)

  const tick = useCallback(() => {
    const idx = phaseRef.current % P1_FLOW.length
    const step = P1_FLOW[idx]

    setDemoEvent(`${step.stage}: ${step.event}`)

    setDemoAgents(prev =>
      prev.map(a =>
        a.id === step.agentId
          ? { ...a, lastAction: step.event, lastActionAt: new Date().toISOString(), status: step.stage === 'REVIEW' ? 'waiting' as const : 'running' as const }
          : a
      )
    )

    if (idx === 0) {
      setP1Ticket({
        id: 'P1-001',
        ref: 'SN-22104',
        title: 'Complete fibre outage — 47 business customers down',
        stage: step.stage,
        stageIndex: idx,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } else if (p1Ticket) {
      setP1Ticket(prev => prev ? { ...prev, stage: step.stage, stageIndex: idx, updatedAt: new Date().toISOString() } : null)
    }

    const newEntry: AuditLogEntry = {
      id: `AUDIT-${auditIdRef.current++}`,
      timestamp: new Date().toISOString(),
      agentId: step.agentId,
      agentName: demoAgents.find(a => a.id === step.agentId)?.name ?? 'Unknown',
      taskId: 'P1-001',
      taskRef: 'SN-22104',
      action: step.audit.action,
      detail: step.audit.detail,
      approvalRequired: step.audit.requiresApproval ?? false,
      severity: step.audit.severity,
    }
    setAuditLog(prev => [newEntry, ...prev].slice(0, 50))

    if (step.audit.requiresApproval) {
      setPendingApproval({
        taskId: 'P1-001',
        taskRef: 'SN-22104',
        title: step.event.replace('⚑ REVIEW GATE: ', ''),
        action: step.audit.action,
        detail: step.audit.detail,
        agentName: demoAgents.find(a => a.id === step.agentId)?.name ?? 'Unknown',
        timestamp: new Date().toISOString(),
      })
    }

    if (idx === 4 || idx === 8) {
      setMetrics(prev => ({
        ...prev,
        ticketsProcessed: prev.ticketsProcessed + 1,
        avgResolutionMin: Math.round((prev.avgResolutionMin * (prev.ticketsProcessed - 1) + 22) / prev.ticketsProcessed),
      }))
    }

    if (idx === 9) {
      setMetrics(prev => ({
        ...prev,
        approvalRate: Math.min(100, prev.approvalRate + 1),
        complianceScore: Math.min(100, prev.complianceScore + 1),
      }))
      setTimeout(() => {
        setP1Ticket(null)
        setPendingApproval(null)
      }, 3000)
    }

    phaseRef.current += 1
  }, [demoAgents, p1Ticket])

  function startDemo() {
    setDemoMode(true)
    phaseRef.current = 0
    setAuditLog([])
    setMetrics({ ticketsProcessed: 23, avgResolutionMin: 18, approvalRate: 94, complianceScore: 97 })
    tick()
    intervalRef.current = setInterval(tick, 5000)
  }

  function stopDemo() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDemoMode(false)
    setDemoAgents(AGENTS)
    setDemoEvent(null)
    setP1Ticket(null)
    setAuditLog([])
    setPendingApproval(null)
    phaseRef.current = 0
  }

  function handleApprove() {
    setPendingApproval(null)
    setMetrics(prev => ({ ...prev, approvalRate: Math.min(100, prev.approvalRate + 1) }))
  }

  function handleReject() {
    setPendingApproval(null)
  }

  const activeAgents = demoAgents.filter(a => a.status === 'running').length
  const awaitingApproval = TASKS.filter(t => t.status === 'awaiting-approval').length

  const activeTasks = TASKS.filter(t =>
    t.status === 'in-progress' || t.status === 'awaiting-approval' || t.status === 'triaged'
  )

  const complianceColor = metrics.complianceScore >= 95 ? 'green' : metrics.complianceScore >= 80 ? 'yellow' : 'red'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Command Centre Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
              OPERATIONS DOCK
            </span>
            {demoMode && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(63,185,80,0.12)', border: '1px solid var(--green-dark)',
                borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700,
                color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
              }}>
                <span className="status-led led-green led-pulse" />
                LIVE DEMO
              </span>
            )}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            Command Centre
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
            {formatTime(clock)} UTC · {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <button
          className={`block-card ${demoMode ? 'block-card--green' : 'block-card--blue'}`}
          onClick={demoMode ? stopDemo : startDemo}
          style={{
            padding: '8px 18px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em', cursor: 'pointer', border: 'none', background: 'none',
            color: demoMode ? 'var(--green)' : 'var(--blue)', whiteSpace: 'nowrap',
          }}
        >
          {demoMode ? '■ STOP DEMO' : '▶ PLAY P1 SCENARIO'}
        </button>
      </div>

      {/* Live Event Ticker */}
      {demoMode && demoEvent && (
        <div className={`block-card ${demoEvent.includes('REVIEW GATE') ? 'block-card--yellow' : 'block-card--green'}`} style={{
          padding: '10px 16px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
          color: demoEvent.includes('REVIEW GATE') ? 'var(--yellow)' : 'var(--green)',
          display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.5,
        }}>
          <span className={`status-led ${demoEvent.includes('REVIEW GATE') ? 'led-yellow led-pulse' : 'led-green led-pulse'}`} />
          <span style={{ color: 'var(--text-3)', marginRight: 2, fontSize: 10 }}>LIVE</span>
          {demoEvent}
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        <MetricCard label="TICKETS PROCESSED" value={metrics.ticketsProcessed} icon="◆" color="var(--green)" />
        <MetricCard label="AVG RESOLUTION" value={`${metrics.avgResolutionMin}m`} icon="◷" color="var(--blue)" />
        <MetricCard label="APPROVAL RATE" value={`${metrics.approvalRate}%`} icon="⚑" color="var(--yellow)" />
        <MetricCard label="COMPLIANCE SCORE" value={`${metrics.complianceScore}%`} icon="✓" color={`var(--${complianceColor})`} />
        <MetricCard label="ACTIVE AGENTS" value={activeAgents} icon="⬡" color="var(--green)" />
        <MetricCard label="AWAITING REVIEW" value={awaitingApproval + (pendingApproval ? 1 : 0)} icon="⚑" color={awaitingApproval > 0 ? 'var(--yellow)' : 'var(--text-3)'} />
      </div>

      {/* P1 Pipeline Tracker */}
      {p1Ticket && (
        <div className="block-card block-card--red" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="status-led led-red led-pulse" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--red)', fontWeight: 700, letterSpacing: '0.08em' }}>
                P1 INCIDENT
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                {p1Ticket.ref}
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
              Updated {formatRelative(p1Ticket.updatedAt)}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5 }}>
            {p1Ticket.title}
          </div>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {P1_STAGES.map((stage, i) => {
              const isActive = i === p1Ticket.stageIndex
              const isComplete = i < p1Ticket.stageIndex
              return (
                <div key={stage.label} style={{
                  flex: 1, minWidth: 90, padding: '8px 10px', borderRadius: 6, textAlign: 'center',
                  background: isActive ? 'rgba(248,81,73,0.15)' : isComplete ? 'rgba(63,185,80,0.1)' : 'var(--bg-3)',
                  border: `1px solid ${isActive ? 'var(--red)' : isComplete ? 'var(--green-dark)' : 'var(--border)'}`,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.1em', color: isActive ? 'var(--red)' : isComplete ? 'var(--green)' : 'var(--text-3)',
                    marginBottom: 4,
                  }}>
                    {isComplete ? '✓ ' : ''}{stage.label}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', lineHeight: 1.3 }}>
                    {stage.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Approval Gate Modal */}
      {pendingApproval && (
        <div onClick={handleReject} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="block-card block-card--yellow" onClick={e => e.stopPropagation()} style={{
            width: 520, maxWidth: '90vw', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 16 }}>⚑</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: 'var(--yellow)', letterSpacing: '0.1em', flex: 1 }}>
                APPROVAL REQUIRED
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                {pendingApproval.taskRef}
              </span>
            </div>
            <div style={{ padding: '18px 18px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, lineHeight: 1.5 }}>
                {pendingApproval.title}
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>AGENT</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                    {pendingApproval.agentName}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>ACTION</div>
                  <div style={{ fontSize: 12, color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: 'uppercase' }}>
                    {pendingApproval.action}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>DETAILS</div>
                <div style={{
                  fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6,
                  background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 4, padding: '10px 12px',
                }}>
                  {pendingApproval.detail}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '12px 18px 16px', borderTop: '1px solid var(--border)' }}>
              <button className="block-card block-card--green" onClick={handleApprove} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--green)',
              }}>
                ✓ APPROVE & SEND
              </button>
              <button className="block-card block-card--red" onClick={handleReject} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--red)',
              }}>
                ✕ REJECT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Agent Board */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
              AGENT BOARD
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
              {activeAgents}/{demoAgents.length} active
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {demoAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Active Tasks + Audit Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 10, display: 'block' }}>
              ACTIVE TASKS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeTasks.map(task => {
                const agent = demoAgents.find(a => a.id === task.assignedAgentId)
                return <TaskCard key={task.id} task={task} agent={agent} />
              })}
            </div>
          </div>

          {/* Live Audit Feed */}
          {auditLog.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
                  LIVE AUDIT FEED
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {auditLog.length} entries
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflow: 'auto' }}>
                {auditLog.slice(0, 8).map(entry => (
                  <div key={entry.id} className="block-card" style={{
                    padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: 10,
                    borderLeft: `3px solid ${entry.severity === 'critical' ? 'var(--red)' : entry.severity === 'warning' ? 'var(--yellow)' : 'var(--green)'}`,
                  }}>
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-3)',
                      whiteSpace: 'nowrap', marginTop: 2, minWidth: 50,
                    }}>
                      {new Date(entry.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600, marginBottom: 2 }}>
                        {entry.action}
                      </div>
                      <div style={{
                        fontSize: 10, color: 'var(--text-3)', lineHeight: 1.4,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {entry.detail}
                      </div>
                    </div>
                    {entry.approvalRequired && (
                      <span style={{
                        fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        color: 'var(--yellow)', whiteSpace: 'nowrap',
                      }}>
                        PENDING
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="block-card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 10, color }}>{icon}</span>
        <span style={{
          fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
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
