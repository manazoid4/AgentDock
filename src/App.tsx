import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import DashboardLayout from './pages/DashboardLayout'
import OperationsDock from './pages/OperationsDock'
import AgentBoardPage from './pages/AgentBoardPage'
import PipelineViewPage from './pages/PipelineViewPage'
import HandoffLogPage from './pages/HandoffLogPage'
import ReviewGatePage from './pages/ReviewGatePage'
import ConnectorsPage from './pages/ConnectorsPage'
import ComplianceDashboardPage from './pages/ComplianceDashboardPage'
import ReportGeneratorPage from './pages/ReportGeneratorPage'

const pipelineStages = [
  { num: '01', label: 'TRIGGER', desc: 'Ticket lands in ServiceNow' },
  { num: '02', label: 'TRIAGE', desc: 'Agent classifies, scores risk' },
  { num: '03', label: 'DRAFT', desc: 'Response prepared from policy' },
  { num: '04', label: 'REVIEW', desc: 'Human checkpoint before send' },
  { num: '05', label: 'SEND', desc: 'Approved action executes' },
  { num: '06', label: 'LOG', desc: 'Audit trail locks permanently' },
]

const agentRoles = [
  {
    role: 'Complaint Triage Agent',
    does: 'Reads incoming tickets, classifies severity, flags VIP accounts, scores SLA risk.',
    system: 'ServiceNow',
    status: 'running',
  },
  {
    role: 'Response Draft Agent',
    does: 'Writes first responses from policy templates. Tone-matched, no overpromising.',
    system: 'Zendesk',
    status: 'waiting',
  },
  {
    role: 'Escalation Agent',
    does: 'Detects repeat contacts, missing context, and breached SLAs. Routes to the right person.',
    system: 'ServiceNow',
    status: 'idle',
  },
  {
    role: 'Compliance Agent',
    does: 'Tracks complaint age against FCA clocks, ADR deadlines, and missing evidence.',
    system: 'Zendesk',
    status: 'running',
  },
]

const trustPoints = [
  'Human approval before every critical action',
  'Immutable audit trail — every action timestamped',
  'Read-only demo mode available',
  'No source system replacement required',
  'ServiceNow-first connector architecture',
  'CSV audit export for compliance teams',
  'GDPR-ready data handling posture',
  'Conflict detection when agents overlap',
]

const customerLogos = [
  'BT Group', 'Virgin Media O2', 'TalkTalk', 'Vodafone UK', 'Sky Broadband', 'Hyperoptic',
]

const howItWorks = [
  {
    step: '01',
    title: 'Connect your systems',
    desc: 'Link ServiceNow, Zendesk, Jira, or email in minutes. No code changes to your existing tools. OAuth 2.0 authentication, read-only by default.',
    icon: '⬡',
  },
  {
    step: '02',
    title: 'Deploy your agents',
    desc: 'Choose from pre-built agent roles — Triage, Draft, Escalation, Compliance — or define your own. Each agent owns one job, visible on the board.',
    icon: '◈',
  },
  {
    step: '03',
    title: 'Watch and control',
    desc: 'Every action flows through a visible pipeline. Human approval gates stop critical actions. Full audit trail exports for compliance. You stay in control.',
    icon: '⟶',
  },
]

const scenarios = [
  {
    title: 'P1 broadband outage misclassified as P3',
    detail: 'The triage agent catches the severity mismatch before the SLA clock runs out.',
  },
  {
    title: 'Same customer complains via email and ticket within 10 minutes',
    detail: 'Duplicate detection links both cases. One response, no conflicting replies.',
  },
  {
    title: 'Credit request exceeds policy without manager approval',
    detail: 'The compliance agent flags the gap. Review Gate stops it until a human signs off.',
  },
  {
    title: 'Complaint reaches day 47 with no final-response owner',
    detail: 'The compliance agent triggers an escalation 9 days before the FCA 8-week deadline.',
  },
]

function LandingPage() {
  const [demoEmail, setDemoEmail] = useState('')
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  return (
    <main className="lp">
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-logo">AD</span>
          <span>AgentDock</span>
        </div>
        <div className="lp-nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#agents">Agents</a>
          <a href="#trust">Trust</a>
          <a href="#scenarios">Scenarios</a>
          <Link to="/dashboard" className="lp-btn lp-btn-primary">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero" id="top">
        <div className="lp-hero-content">
          <span className="lp-eyebrow">Visual command centre for multi-agent work</span>
          <h1>
            See every agent.<br />
            Control every action.
          </h1>
          <p className="lp-hero-sub">
            AgentDock drops AI agents into your existing ServiceNow, Zendesk, or Jira workflows — without replacing them. Every action is visible, traceable, and requires human approval before it matters.
          </p>
          <div className="lp-hero-actions">
            <a href="#demo" className="lp-btn lp-btn-primary lp-btn-lg">
              See it in action
            </a>
            <Link to="/dashboard" className="lp-btn lp-btn-outline lp-btn-lg">
              Open Dashboard →
            </Link>
          </div>
          <div className="lp-trust-row">
            <span>ServiceNow-first</span>
            <span>Human review gates</span>
            <span>Audit trail by design</span>
            <span>Read-only demo</span>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-dock-preview">
            <div className="lp-dock-header">
              <span className="lp-dock-dot lp-dot-green" />
              <span className="lp-dock-dot lp-dot-green" />
              <span className="lp-dock-dot lp-dot-yellow" />
              <span>Operations Dock — Live</span>
              <span className="lp-dock-clock">09:41:23</span>
            </div>
            <div className="lp-dock-stats">
              <div className="lp-dock-stat">
                <span>2</span>
                <small>Agents Active</small>
              </div>
              <div className="lp-dock-stat">
                <span>3</span>
                <small>In Progress</small>
              </div>
              <div className="lp-dock-stat lp-stat-warn">
                <span>2</span>
                <small>Awaiting Review</small>
              </div>
              <div className="lp-dock-stat">
                <span>6</span>
                <small>Total Tasks</small>
              </div>
            </div>
            <div className="lp-dock-grid">
              <div className="lp-dock-agent">
                <span className="lp-led lp-led-green lp-led-pulse" />
                <span>Triage Agent</span>
                <small>SN-20987 · Critical</small>
              </div>
              <div className="lp-dock-agent">
                <span className="lp-led lp-led-yellow lp-led-pulse" />
                <span>Draft Agent</span>
                <small>ZD-88412 · Awaiting</small>
              </div>
              <div className="lp-dock-agent">
                <span className="lp-led lp-led-green lp-led-pulse" />
                <span>Compliance Agent</span>
                <small>ZD-87001 · Day 47</small>
              </div>
              <div className="lp-dock-agent lp-dock-idle">
                <span className="lp-led lp-led-grey" />
                <span>Escalation Agent</span>
                <small>Idle</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <section className="lp-section lp-logos">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">Trusted by telecom companies</span>
          <div className="lp-logo-grid">
            {customerLogos.map(name => (
              <div className="lp-logo-item" key={name}>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="lp-section lp-problem">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">The problem</span>
          <h2>Agents are powerful. But they work in the dark.</h2>
          <div className="lp-problem-grid">
            <div className="lp-problem-card">
              <h3>Invisible work</h3>
              <p>Each agent lives in a separate terminal, chat, or script. Managers cannot see progress without reading logs.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Lost context</h3>
              <p>Handoffs between agents drop information. The next agent starts blind, repeating work or making wrong calls.</p>
            </div>
            <div className="lp-problem-card">
              <h3>No audit trail</h3>
              <p>Compliance teams need evidence of what changed, when, and by whom. Agent logs are not built for auditors.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Hidden autonomy</h3>
              <p>Agents can send responses, update records, and escalate without a human checkpoint. That is a risk most businesses will not accept.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-section lp-how" id="how-it-works">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">How it works</span>
          <h2>Three steps. Zero disruption.</h2>
          <p className="lp-section-sub">
            AgentDock connects to your existing systems without replacing them. Your agents work alongside your tools — visible, controlled, and auditable.
          </p>
          <div className="lp-how-grid">
            {howItWorks.map((step) => (
              <div className="lp-how-card" key={step.step}>
                <div className="lp-how-step-num">{step.step}</div>
                <span className="lp-how-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See it in action */}
      <section className="lp-section lp-video">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">See it in action</span>
          <h2>Watch a P1 complaint flow through the pipeline.</h2>
          <p className="lp-section-sub">
            See how AgentDock catches a misclassified P1 broadband outage, drafts a response, routes it through human approval, and logs every action for compliance.
          </p>
          <div className="lp-video-placeholder">
            <div className="lp-video-play-btn">
              <span>▶</span>
            </div>
            <div className="lp-video-label">Product demo — 3 min walkthrough</div>
          </div>
        </div>
      </section>

      {/* Pipeline Strip */}
      <section className="lp-section lp-pipeline-section">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">The pipeline</span>
          <h2>Six stages. Zero mystery.</h2>
          <p className="lp-section-sub">
            Every workflow moves through the same visible pipeline. You always know which stage a task is in, which agent owns it, and what needs your attention.
          </p>
          <div className="lp-pipeline-strip">
            {pipelineStages.map((stage, i) => (
              <div className="lp-pipeline-stage" key={stage.label}>
                <span className="lp-stage-num">{stage.num}</span>
                <strong>{stage.label}</strong>
                <small>{stage.desc}</small>
                {i < pipelineStages.length - 1 && <span className="lp-stage-arrow" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="lp-section lp-agents" id="agents">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">Agent roles</span>
          <h2>Each agent owns one job. You see all of them.</h2>
          <div className="lp-agent-grid">
            {agentRoles.map((a) => (
              <div className="lp-agent-card" key={a.role}>
                <div className="lp-agent-header">
                  <span className={`lp-led lp-led-${a.status === 'running' ? 'green lp-led-pulse' : a.status === 'waiting' ? 'yellow lp-led-pulse' : 'grey'}`} />
                  <span className="lp-agent-status">{a.status.toUpperCase()}</span>
                </div>
                <h3>{a.role}</h3>
                <p>{a.does}</p>
                <div className="lp-agent-system">
                  <span>Connected to</span>
                  <strong>{a.system}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="lp-section lp-scenarios" id="scenarios">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">Scenario tested</span>
          <h2>Built against real failure modes, not demo theatre.</h2>
          <div className="lp-scenario-list">
            {scenarios.map((s) => (
              <div className="lp-scenario-item" key={s.title}>
                <span className="lp-scenario-dot" />
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="lp-section lp-trust" id="trust">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">Trust & compliance</span>
          <h2>Early-stage, but not careless.</h2>
          <p className="lp-section-sub">
            AgentDock earns trust with practical controls, not enterprise theatre. Every action is logged. Every critical action stops for a human.
          </p>
          <div className="lp-trust-grid">
            {trustPoints.map((t) => (
              <div className="lp-trust-item" key={t}>
                <span className="lp-check" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="lp-section lp-demo" id="demo">
        <div className="lp-section-inner">
          <div className="lp-demo-card">
            <span className="lp-eyebrow">Founding 10 — Limited spots</span>
            <h2>Bring one messy workflow. We turn it into an agent office.</h2>
            <p>
              First target: complaint management with ServiceNow. Then finance disputes, field operations, customer support, and management reports.
            </p>
            <div className="lp-demo-actions">
              <Link to="/dashboard" className="lp-btn lp-btn-primary lp-btn-lg">
                Try the live demo →
              </Link>
            </div>
            {!demoSubmitted ? (
              <form
                className="lp-demo-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (demoEmail) setDemoSubmitted(true)
                }}
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  required
                  className="lp-demo-input"
                />
                <button type="submit" className="lp-btn lp-btn-outline lp-btn-lg">
                  Request a pilot
                </button>
              </form>
            ) : (
              <div className="lp-demo-success">
                <span className="lp-check lp-check-lg" />
                <strong>Request received.</strong>
                <p>We will be in touch within 24 hours to schedule your demo.</p>
              </div>
            )}
            <div className="lp-demo-note">
              No credit card. No commitment. Read-only demo mode.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <span className="lp-logo lp-logo-sm">AD</span>
            <strong>AgentDock</strong>
          </div>
          <p>Keep your systems. See every agent. Control every action.</p>
        </div>
      </footer>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OperationsDock />} />
          <Route path="agents" element={<AgentBoardPage />} />
          <Route path="pipeline" element={<PipelineViewPage />} />
          <Route path="logs" element={<HandoffLogPage />} />
          <Route path="review" element={<ReviewGatePage />} />
          <Route path="compliance" element={<ComplianceDashboardPage />} />
          <Route path="reports" element={<ReportGeneratorPage />} />
          <Route path="connectors" element={<ConnectorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
