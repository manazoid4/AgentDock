import './App.css'

const agents = [
  {
    name: 'Complaint Triage',
    role: 'Classifies severity and routes tickets',
    system: 'ServiceNow',
    status: 'Working',
    metric: 'P1 flagged',
  },
  {
    name: 'Response Draft',
    role: 'Writes replies from approved policy',
    system: 'Zendesk',
    status: 'Waiting',
    metric: '3 reviews',
  },
  {
    name: 'Escalation',
    role: 'Moves risk to the right owner',
    system: 'Jira',
    status: 'Working',
    metric: '12m SLA',
  },
  {
    name: 'Audit Logger',
    role: 'Records every action and approval',
    system: 'Postgres',
    status: 'Idle',
    metric: '100% logged',
  },
]

const pipeline = ['Trigger', 'Triage', 'Draft', 'Review', 'Send', 'Log']

const handoffs = [
  'COM-1042 classified critical: customer threatening churn on GBP 50k account.',
  'Draft response prepared from refund policy v4. Human approval required.',
  'Duplicate Zendesk ticket matched to ServiceNow incident INC-8821.',
]

const connectors = ['ServiceNow', 'Zendesk', 'Jira', 'Email', 'Webhook']

const businessAgents = [
  {
    team: 'Complaints',
    job: 'Classifies severity, drafts first responses, routes risk, and logs every decision.',
    flow: 'Complaint arrives -> severity check -> draft response -> human approval -> send -> audit log',
  },
  {
    team: 'Finance',
    job: 'Checks invoice disputes, payment follow-ups, PO mismatches, and budget variance notes.',
    flow: 'Invoice issue -> validate against PO -> flag discrepancy -> draft follow-up -> approval',
  },
  {
    team: 'Sales',
    job: 'Qualifies inbound leads, drafts proposals, updates CRM records, and schedules follow-ups.',
    flow: 'Lead arrives -> qualify -> draft proposal -> approve -> send -> CRM update',
  },
  {
    team: 'HR',
    job: 'Handles leave requests, onboarding questions, policy queries, and employee routing.',
    flow: 'Employee query -> classify -> approved answer or route -> log decision',
  },
  {
    team: 'IT Support',
    job: 'Routes tickets, diagnoses routine issues, and prepares resolution notes for approval.',
    flow: 'Ticket arrives -> classify -> resolve routine issue or route -> update system',
  },
  {
    team: 'Reports',
    job: 'Pulls system data into weekly summaries, compliance reports, and management packs.',
    flow: 'Scheduled run -> gather data -> compile report -> review -> distribute',
  },
]

function App() {
  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="AgentDock home">
          <span className="brand-mark">A</span>
          AgentDock
        </a>
        <div className="nav-links">
          <a href="#dock">Dock</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
        </div>
      </nav>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Enterprise agent operations</p>
          <h1>You keep your systems. Agents do the work.</h1>
          <p className="hero-sub">
            AgentDock drops agents into ServiceNow, Zendesk, Jira, email, and
            custom workflows. One dashboard shows every action, every handoff,
            and every approval before anything critical happens.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#dock">
              See the dock
            </a>
            <a className="secondary-button" href="#pricing">
              Founding 10
            </a>
          </div>
          <div className="trust-row" aria-label="Product principles">
            <span>No hidden autonomy</span>
            <span>Human approval gates</span>
            <span>Audit-ready logs</span>
          </div>
        </div>

        <OperationsMockup />
      </section>

      <section className="section split" id="dock">
        <div>
          <p className="eyebrow">Operations Dock</p>
          <h2>See every agent without opening logs.</h2>
          <p>
            The dock is the main workspace. It shows active agents, connected
            systems, approval queue, handoff log, and workflow health in one
            readable view.
          </p>
        </div>
        <div className="agent-grid">
          {agents.map((agent) => (
            <article className="agent-card" key={agent.name}>
              <div className="card-topline">
                <span className={`status-dot ${agent.status.toLowerCase()}`} />
                <span>{agent.status}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
              <div className="card-meta">
                <span>{agent.system}</span>
                <strong>{agent.metric}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow" id="workflow">
        <div className="section-heading">
          <p className="eyebrow">Control layer</p>
          <h2>Trigger, triage, draft, review, send, log.</h2>
          <p>
            Built first around complaint management: high-risk tickets,
            response drafts, escalation handling, and audit trails.
          </p>
        </div>
        <div className="pipeline">
          {pipeline.map((stage, index) => (
            <div className="stage" key={stage}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stage}</strong>
            </div>
          ))}
        </div>
        <div className="workflow-panels">
          <article>
            <h3>Review Gate</h3>
            <p>
              Critical actions stop for approve, reject, or modify. Routine
              work stays fast, risky work stays controlled.
            </p>
          </article>
          <article>
            <h3>Handoff Log</h3>
            <p>
              Every agent action records source, decision, output, system
              update, timestamp, and human approval.
            </p>
          </article>
          <article>
            <h3>System Connectors</h3>
            <p>
              ServiceNow first. Zendesk, Jira, email, and generic webhooks next.
              Keep the stack you already use.
            </p>
          </article>
        </div>
      </section>

      <section className="section evidence">
        <div className="handoff-panel">
          <div className="panel-header">
            <p className="eyebrow">Live handoffs</p>
            <span>Audit trail active</span>
          </div>
          {handoffs.map((item) => (
            <div className="handoff" key={item}>
              <span />
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="connector-panel">
          <p className="eyebrow">Plug in</p>
          <h2>Works with the tools already inside the business.</h2>
          <div className="connector-list">
            {connectors.map((connector) => (
              <span key={connector}>{connector}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section teams">
        <div className="section-heading">
          <p className="eyebrow">Business agents</p>
          <h2>Built around real departments, not generic bot tricks.</h2>
          <p>
            The first wedge is complaint management through ServiceNow. The same
            control layer then extends into finance, sales, HR, IT support, and
            reporting.
          </p>
        </div>
        <div className="team-grid">
          {businessAgents.map((agent) => (
            <article className="team-card" key={agent.team}>
              <span>{agent.team}</span>
              <h3>{agent.team} Agent</h3>
              <p>{agent.job}</p>
              <small>{agent.flow}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Founding 10</p>
          <h2>Lifetime Business pricing for the first 10 customers.</h2>
          <p>
            Built for businesses that want agents in production without losing
            control, compliance, or visibility.
          </p>
        </div>
        <div className="price-grid">
          <PriceCard
            title="Starter"
            price="GBP 99/mo"
            description="One connected system, three active agents, two workflows."
          />
          <PriceCard
            featured
            title="Business"
            price="GBP 349/mo"
            description="Five systems, fifteen agents, all templates, one-year audit log."
          />
          <PriceCard
            title="Enterprise"
            price="Custom"
            description="Unlimited systems, SSO, custom compliance, audit export, onboarding."
          />
        </div>
      </section>

      <footer className="footer">
        <strong>AgentDock</strong>
        <span>See every agent. Control every action. Keep your systems.</span>
      </footer>
    </main>
  )
}

function OperationsMockup() {
  return (
    <div className="mockup" aria-label="AgentDock operations dashboard preview">
      <div className="mockup-toolbar">
        <span />
        <span />
        <span />
        <strong>Operations Dock</strong>
      </div>
      <div className="office-grid">
        {agents.map((agent) => (
          <div className={`desk ${agent.status.toLowerCase()}`} key={agent.name}>
            <span className="desk-light" />
            <strong>{agent.name}</strong>
            <small>{agent.system}</small>
          </div>
        ))}
        <div className="review-desk">
          <strong>Review Gate</strong>
          <small>3 items waiting for human approval</small>
        </div>
      </div>
    </div>
  )
}

function PriceCard({
  title,
  price,
  description,
  featured = false,
}: {
  title: string
  price: string
  description: string
  featured?: boolean
}) {
  return (
    <article className={`price-card ${featured ? 'featured' : ''}`}>
      <h3>{title}</h3>
      <strong>{price}</strong>
      <p>{description}</p>
    </article>
  )
}

export default App
