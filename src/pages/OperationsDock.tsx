import AgentCard from '../components/AgentCard'
import TaskCard from '../components/TaskCard'
import { AGENTS, TASKS } from '../data/seed'

function StatBlock({
  label,
  value,
  highlight,
}: {
  label: string
  value: number | string
  highlight?: 'yellow' | 'green' | 'red'
}) {
  const variantClass = highlight ? `block-card block-card--${highlight}` : 'block-card'
  const valueColor = highlight ? `var(--${highlight})` : 'var(--text)'
  return (
    <div className={variantClass} style={{ padding: '16px 20px', flex: 1, minWidth: 140 }}>
      <div style={{
        fontSize: 9,
        color: 'var(--text-3)',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 36,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        color: valueColor,
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  )
}

export default function OperationsDock() {
  const activeAgents = AGENTS.filter(a => a.status === 'running').length
  const inProgress = TASKS.filter(t => t.status === 'in-progress').length
  const awaitingApproval = TASKS.filter(t => t.status === 'awaiting-approval').length
  const resolvedToday = TASKS.filter(t => t.status === 'resolved').length

  const activeTasks = TASKS.filter(t =>
    t.status === 'in-progress' || t.status === 'awaiting-approval' || t.status === 'triaged'
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          OPERATIONS DOCK
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          Live Service Floor
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatBlock label="ACTIVE AGENTS" value={activeAgents} highlight="green" />
        <StatBlock label="TASKS IN PROGRESS" value={inProgress} />
        <StatBlock
          label="AWAITING APPROVAL"
          value={awaitingApproval}
          highlight={awaitingApproval > 0 ? 'yellow' : undefined}
        />
        <StatBlock label="RESOLVED TODAY" value={resolvedToday} />
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.08em', marginBottom: 10 }}>
            AGENT BOARD
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {AGENTS.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.08em', marginBottom: 10 }}>
            ACTIVE TASKS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeTasks.map(task => {
              const agent = AGENTS.find(a => a.id === task.assignedAgentId)
              return <TaskCard key={task.id} task={task} agent={agent} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
