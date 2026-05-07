import AgentCard from '../components/AgentCard'
import { AGENTS } from '../data/seed'

export default function AgentBoardPage() {
  const activeCount = AGENTS.filter(a => a.status === 'running').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          DASHBOARD / AGENTS
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          AGENT BOARD
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace', marginTop: 4 }}>
          {activeCount} of {AGENTS.length} agents active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {AGENTS.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
