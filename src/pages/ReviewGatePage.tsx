import { useState } from 'react'
import ReviewGateModal from '../components/ReviewGateModal'
import { TASKS, HANDOFFS, AGENTS, APPROVAL_RECORDS, ESCALATION_RULES } from '../data/seed'
import type { Task, Handoff } from '../types'

function waitingTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ${mins % 60}m`
  return `${Math.floor(hrs / 24)}d`
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function isEscalated(taskUpdatedAt: string, thresholdHours: number): boolean {
  const diffMs = Date.now() - new Date(taskUpdatedAt).getTime()
  const diffHours = diffMs / 3600000
  return diffHours >= thresholdHours
}

export default function ReviewGatePage() {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeHandoff, setActiveHandoff] = useState<Handoff | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [approvalReason, setApprovalReason] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)

  const pendingTasks = TASKS.filter(t => t.status === 'awaiting-approval')
  const approvalThreshold = ESCALATION_RULES.find(r => r.name === 'Approval Pending > 4 Hours')?.thresholdHours ?? 4

  function openReview(task: Task) {
    const handoff = HANDOFFS.find(h => h.taskId === task.id && h.approvalRequired && !h.approvedBy)
    if (handoff) {
      setActiveTask(task)
      setActiveHandoff(handoff)
      setApprovalReason('')
      setRejectionReason('')
    }
  }

  function closeModal() {
    setActiveTask(null)
    setActiveHandoff(null)
    setShowApproveModal(false)
    setShowRejectModal(false)
    setApprovalReason('')
    setRejectionReason('')
  }

  function handleApprove() {
    if (!approvalReason.trim()) return
    closeModal()
  }

  function handleReject() {
    if (!rejectionReason.trim()) return
    closeModal()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>
            DASHBOARD / REVIEW GATE
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            Review Gate
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
            {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} awaiting approval · Escalation after {approvalThreshold}h
          </div>
        </div>
        <button className="block-card" onClick={() => setShowHistory(!showHistory)} style={{
          padding: '7px 16px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--text-2)',
        }}>
          {showHistory ? 'HIDE' : 'SHOW'} APPROVAL HISTORY
        </button>
      </div>

      {/* Escalation Rules Summary */}
      <div className="block-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--red)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          ESCALATION RULES
        </span>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        {ESCALATION_RULES.filter(r => r.active).slice(0, 3).map(rule => (
          <span key={rule.id} style={{ fontSize: 11, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace" }}>{rule.thresholdHours}h</strong> → {rule.escalateTo}
          </span>
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
          ({ESCALATION_RULES.filter(r => r.active).length} active)
        </span>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length === 0 && (
        <div className="block-card block-card--green" style={{ padding: 24, textAlign: 'center', color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          <span className="status-led led-green" style={{ marginRight: 8 }} />
          NO PENDING REVIEWS — ALL CLEAR
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pendingTasks.map(task => {
          const agent = AGENTS.find(a => a.id === task.assignedAgentId)
          const waiting = waitingTime(task.updatedAt)
          const escalated = isEscalated(task.updatedAt, approvalThreshold)
          const escalationRule = ESCALATION_RULES.find(r => r.name === 'Approval Pending > 4 Hours')

          return (
            <div
              key={task.id}
              className={`block-card ${escalated ? 'block-card--red' : 'block-card--yellow'}`}
              style={{ padding: '16px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 100 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`status-led ${escalated ? 'led-red led-pulse' : 'led-yellow led-pulse'}`} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                      {task.sourceRef}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: escalated ? 'var(--red)' : 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    waiting {waiting}
                    {escalated && ' · ESCALATED'}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                    {task.title}
                  </div>
                  {agent && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                      {agent.name} — {agent.role}
                    </div>
                  )}
                  {escalated && escalationRule && (
                    <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      Escalated to: {escalationRule.escalateTo}
                    </div>
                  )}
                </div>

                <button
                  className="block-card block-card--yellow"
                  onClick={() => openReview(task)}
                  style={{
                    padding: '7px 16px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    color: 'var(--yellow)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚑ REVIEW
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Approval History */}
      {showHistory && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 10 }}>
            APPROVAL HISTORY — {APPROVAL_RECORDS.length} RECORDS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {APPROVAL_RECORDS.map(record => (
              <div key={record.id} className={`block-card ${record.decision === 'approved' ? 'block-card--green' : 'block-card--red'}`} style={{
                padding: '14px 16px',
                borderLeft: `3px solid ${record.decision === 'approved' ? 'var(--green)' : 'var(--red)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
                      {record.taskRef}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em',
                      padding: '2px 8px', borderRadius: 4,
                      background: record.decision === 'approved' ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)',
                      color: record.decision === 'approved' ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${record.decision === 'approved' ? 'var(--green-dark)' : 'var(--red-dark)'}`,
                    }}>
                      {record.decision.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDateTime(record.timestamp)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>APPROVER</div>
                    <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>{record.approverName}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{record.role}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>REASON</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>{record.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {activeTask && activeHandoff && !showApproveModal && !showRejectModal && (
        <ReviewGateModal
          task={activeTask}
          handoff={activeHandoff}
          onApprove={() => setShowApproveModal(true)}
          onReject={() => setShowRejectModal(true)}
          onClose={closeModal}
        />
      )}

      {/* Approve Reason Modal */}
      {showApproveModal && activeTask && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001,
        }}>
          <div className="block-card block-card--green" onClick={e => e.stopPropagation()} style={{
            width: 480, maxWidth: '90vw', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 16 }}>✓</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: 'var(--green)', letterSpacing: '0.1em', flex: 1 }}>
                CONFIRM APPROVAL
              </span>
            </div>
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                You are approving the action for <strong style={{ color: 'var(--blue)', fontFamily: "'JetBrains Mono', monospace" }}>{activeTask.sourceRef}</strong>.
                This decision will be recorded in the audit trail.
              </div>
              <div>
                <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  APPROVAL REASON *
                </label>
                <textarea
                  value={approvalReason}
                  onChange={e => setApprovalReason(e.target.value)}
                  placeholder="Why are you approving this action? This will be recorded for compliance..."
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 4,
                    border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)',
                    fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '12px 18px 16px', borderTop: '1px solid var(--border)' }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-2)', borderRadius: 4,
              }}>
                CANCEL
              </button>
              <button onClick={handleApprove} disabled={!approvalReason.trim()} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: approvalReason.trim() ? 'pointer' : 'not-allowed',
                border: 'none', borderRadius: 4,
                background: approvalReason.trim() ? 'var(--green-dark)' : 'var(--bg-3)',
                color: approvalReason.trim() ? 'var(--green)' : 'var(--text-3)',
              }}>
                CONFIRM APPROVAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && activeTask && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001,
        }}>
          <div className="block-card block-card--red" onClick={e => e.stopPropagation()} style={{
            width: 480, maxWidth: '90vw', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 16 }}>✕</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: 'var(--red)', letterSpacing: '0.1em', flex: 1 }}>
                CONFIRM REJECTION
              </span>
            </div>
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                You are rejecting the action for <strong style={{ color: 'var(--blue)', fontFamily: "'JetBrains Mono', monospace" }}>{activeTask.sourceRef}</strong>.
                This decision will be recorded and the agent will be notified.
              </div>
              <div>
                <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  REJECTION REASON *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Why are you rejecting this action? The agent needs clear guidance..."
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 4,
                    border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)',
                    fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '12px 18px 16px', borderTop: '1px solid var(--border)' }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-2)', borderRadius: 4,
              }}>
                CANCEL
              </button>
              <button onClick={handleReject} disabled={!rejectionReason.trim()} style={{
                flex: 1, padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.08em', cursor: rejectionReason.trim() ? 'pointer' : 'not-allowed',
                border: 'none', borderRadius: 4,
                background: rejectionReason.trim() ? 'var(--red-dark)' : 'var(--bg-3)',
                color: rejectionReason.trim() ? 'var(--red)' : 'var(--text-3)',
              }}>
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
