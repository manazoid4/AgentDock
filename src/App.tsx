import './App.css'

const departments = [
  {
    name: 'Service Desk',
    system: 'ServiceNow',
    status: '37 live cases',
    tone: 'working',
    copy: 'Broadband faults, SLA timers, field updates, and frustrated customers.',
  },
  {
    name: 'Complaints',
    system: 'Zendesk',
    status: '6 first replies',
    tone: 'review',
    copy: 'First responses drafted from policy before the customer gets colder.',
  },
  {
    name: 'Finance',
    system: 'Xero / ERP',
    status: '4 disputes',
    tone: 'money',
    copy: 'Invoice queries, credits, payment promises, and contract checks.',
  },
  {
    name: 'Field Ops',
    system: 'Jira',
    status: '12 engineer jobs',
    tone: 'route',
    copy: 'Install delays, access notes, handbacks, and missed appointment risk.',
  },
]

const targetAudiences = [
  {
    title: 'Head of Customer Service',
    pain: 'Needs complaint risk, repeat contact, and first-response quality visible before the weekly numbers look ugly.',
  },
  {
    title: 'Service Manager',
    pain: 'Owns SLA clocks, field handoffs, billing noise, and the customer who keeps coming back angry.',
  },
  {
    title: 'Operations Lead',
    pain: 'Wants fewer “who owns this?” moments across ServiceNow, Zendesk, Jira, finance, and field teams.',
  },
  {
    title: 'Compliance / QA Manager',
    pain: 'Needs evidence, approvals, complaint clocks, and clean audit logs without reading five systems.',
  },
]

const agentRuns = [
  {
    agent: 'Complaint First Response',
    route: 'Complaints -> Meeting Room -> Review Gate',
    action: 'Drafts a calm first response for a VIP outage complaint.',
    impact: 'Response ready in 4 minutes',
  },
  {
    agent: 'Finance Dispute',
    route: 'Finance -> Service Desk -> Review Gate',
    action: 'Checks invoice dispute against contract and open service credits.',
    impact: 'GBP 1,240 risk flagged',
  },
  {
    agent: 'Field Handoff',
    route: 'Service Desk -> Field Ops -> Audit Log',
    action: 'Summarises a fault ticket for the engineer without losing context.',
    impact: 'No repeat customer questions',
  },
  {
    agent: 'SLA Watch',
    route: 'Service Desk -> Meeting Room',
    action: 'Finds stuck P1 cases before the service manager gets blindsided.',
    impact: '2 breaches prevented',
  },
]

const workflow = [
  'Signal lands',
  'Agent reads context',
  'Risk is scored',
  'Draft is prepared',
  'Human approves',
  'System updates',
  'Audit trail locks',
]

const trustTokens = [
  'Human approval before risky updates',
  'Read-only demo mode',
  'Immutable audit trail design',
  'GDPR-ready data handling posture',
  'No source system replacement',
  'ServiceNow-first connector plan',
  'Exportable logs roadmap',
  'Clear Founding 10 terms',
]

const scenarioTests = [
  'P1 complaint from a high-value account is misclassified as normal.',
  'Same customer complains by email and ticket within 10 minutes.',
  'Finance credit request exceeds policy without manager approval.',
  'Engineer arrives without access notes and the visit fails.',
  'ServiceNow API is down while approvals are waiting.',
  'Complaint reaches day 50 with no final-response owner.',
]

const complianceTimers = [
  {
    label: 'FCA quick resolution',
    clock: 'Close of 3 business days',
    detail:
      'Resolved financial-service complaints need a summary resolution communication, not a buried note.',
  },
  {
    label: 'FCA final response',
    clock: '8 weeks',
    detail:
      'Standard regulated complaints need a final response or clear escalation route to the Ombudsman.',
  },
  {
    label: 'Payments / e-money',
    clock: '15 business days',
    detail:
      'Payment-service complaints normally need a final response faster, with an outer 35-business-day limit where delays are explained.',
  },
  {
    label: 'Telecom ADR risk',
    clock: '8 weeks or deadlock',
    detail:
      'UK telecom complaints can move toward ADR when unresolved or deadlocked. The manager needs warning before that point.',
  },
]

const competitors = [
  'ServiceNow',
  'Zendesk',
  'Salesforce',
  'Atlassian',
  'Freshworks',
  'Intercom',
  'Ada',
  'UiPath',
  'Bright Pattern',
  'Genesys',
  'NICE',
  'Five9',
  'Dify',
  'LangGraph',
]

const scenarios = [
  {
    title: 'A resident has had no broadband since Friday.',
    detail:
      'The complaint agent drafts the first reply, links the ServiceNow incident, checks SLA exposure, and sends it to review.',
  },
  {
    title: 'Finance sees a credit request with weak evidence.',
    detail:
      'The finance agent checks contract notes, service downtime, previous credits, and flags what a manager must approve.',
  },
  {
    title: 'Field ops says the visit failed because access was missing.',
    detail:
      'The handoff agent pulls the customer notes into the engineer job and logs the missed context for audit.',
  },
]

function App() {
  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="AgentDock home">
          <span className="brand-mark">AD</span>
          <span>AgentDock</span>
        </a>
        <div className="nav-links">
          <a href="#office">Office</a>
          <a href="#manager">Manager</a>
          <a href="#trust">Trust</a>
          <a href="#research">Research</a>
        </div>
      </nav>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Warm control for messy service work</p>
          <h1>The calm office for complaint chaos.</h1>
          <p className="hero-sub">
            AgentDock gives every service agent a desk, a route, and a human
            checkpoint. Complaints, finance queries, field handoffs, and SLA
            risk stop drifting through chat windows and start moving like work.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#office">
              Open the office
            </a>
            <a className="secondary-button" href="#manager">
              See the service story
            </a>
          </div>
          <div className="signal-row" aria-label="Trust signals">
            <span>Read-only demo available</span>
            <span>ServiceNow-first</span>
            <span>Human review gates</span>
            <span>Audit trail by design</span>
          </div>
        </div>
        <OfficeMap />
      </section>

      <section className="section manager" id="manager">
        <div className="manager-copy">
          <p className="eyebrow">Example buyer</p>
          <h2>Picture a Glide-style connectivity operator on a rough Tuesday.</h2>
          <p>
            Managed Wi-Fi complaints are climbing across student accommodation,
            business sites, and build-to-rent buildings. Finance is asking why
            credits are being offered. Field ops says the notes are missing.
            The customer team wants a first response now. The manager does not
            want another dashboard. They want control.
          </p>
        </div>
        <div className="scenario-stack">
          {scenarios.map((scenario) => (
            <article className="scenario-card" key={scenario.title}>
              <h3>{scenario.title}</h3>
              <p>{scenario.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section audience">
        <div className="section-heading">
          <p className="eyebrow">Target audience</p>
          <h2>Built for department managers who get blamed when handoffs fail.</h2>
          <p>
            These buyers do not need a mascot or another automation canvas. They
            need the expensive exceptions surfaced early, explained clearly, and
            routed to the right person.
          </p>
        </div>
        <div className="audience-grid">
          {targetAudiences.map((audience) => (
            <article className="audience-card" key={audience.title}>
              <span>For</span>
              <h3>{audience.title}</h3>
              <p>{audience.pain}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section compliance">
        <div className="section-heading">
          <p className="eyebrow">Complaint clocks</p>
          <h2>Some complaints are not just annoying. They have timers.</h2>
          <p>
            AgentDock should track complaint age, regulator-relevant deadlines,
            deadlock risk, and missing evidence before the service manager is
            forced into a rushed final response.
          </p>
        </div>
        <div className="timer-grid">
          {complianceTimers.map((timer) => (
            <article className="timer-card" key={timer.label}>
              <span>{timer.label}</span>
              <strong>{timer.clock}</strong>
              <p>{timer.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section flow">
        <div className="section-heading">
          <p className="eyebrow">The operating loop</p>
          <h2>Fast work, visible risk, no mystery autonomy.</h2>
          <p>
            AgentDock does not ask a manager to trust a black box. It shows the
            work moving through stages, who owns it, what changed, and what must
            be approved.
          </p>
        </div>
        <div className="workflow-strip">
          {workflow.map((step, index) => (
            <div className="workflow-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section scenarios">
        <div className="scenario-copy">
          <p className="eyebrow">Scenario tested</p>
          <h2>Designed against real failure modes, not demo theatre.</h2>
          <p>
            The launch scenarios are adapted from the JobFilter discipline:
            find the breakpoints, then build the product proof around them.
          </p>
        </div>
        <div className="test-list">
          {scenarioTests.map((test) => (
            <div className="test-item" key={test}>
              <span />
              <p>{test}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section agents" id="office">
        <div className="section-heading">
          <p className="eyebrow">Department agents</p>
          <h2>The agents do useful office work, not party tricks.</h2>
          <p>
            Each agent owns a small operational job. The service manager sees
            where it is working, where it is waiting, and what needs a human
            decision.
          </p>
        </div>
        <div className="agent-run-grid">
          {agentRuns.map((run) => (
            <article className="agent-run-card" key={run.agent}>
              <div>
                <span>{run.route}</span>
                <h3>{run.agent}</h3>
                <p>{run.action}</p>
              </div>
              <strong>{run.impact}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section trust" id="trust">
        <div className="trust-panel">
          <p className="eyebrow">Trust tokens</p>
          <h2>Early-stage, but not careless.</h2>
          <p>
            The site should earn trust without pretending to have enterprise
            certifications it does not have yet. These are practical controls a
            buyer can understand before a pilot.
          </p>
        </div>
        <div className="token-grid">
          {trustTokens.map((token) => (
            <div className="token" key={token}>
              {token}
            </div>
          ))}
        </div>
      </section>

      <section className="section research" id="research">
        <div>
          <p className="eyebrow">Competitive angle</p>
          <h2>30+ competitors reviewed. The gap is still control.</h2>
          <p>
            ServiceNow, Zendesk, Bright Pattern, Genesys, NICE, Salesforce,
            UiPath, Dify, LangGraph, and the rest prove demand. Most build,
            automate, or deflect. AgentDock gives a department manager a warm,
            inspectable control room for the risky work between systems.
          </p>
        </div>
        <div className="competitor-cloud" aria-label="Competitors researched">
          {competitors.map((competitor) => (
            <span key={competitor}>{competitor}</span>
          ))}
        </div>
      </section>

      <section className="section proof">
        <div className="proof-grid">
          <article>
            <span>01</span>
            <h3>No rented logo wall.</h3>
            <p>
              Early buyers get the product, the controls, the docs, and the
              terms. No fake enterprise theatre.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Start read-only.</h3>
            <p>
              AgentDock can show what it would do before it is allowed to send,
              update, credit, escalate, or close anything.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Approve before action.</h3>
            <p>
              Sensitive actions stop for a human. Agents prepare the work. Your
              team makes the call.
            </p>
          </article>
        </div>
      </section>

      <section className="section close">
        <div className="close-card">
          <p className="eyebrow">Founding 10</p>
          <h2>Bring one messy workflow. We turn it into an agent office.</h2>
          <p>
            First target: complaint management with ServiceNow. Then finance
            disputes, field operations, customer support, and management reports.
          </p>
          <a className="primary-button" href="mailto:hello@agentdock.co">
            Request a pilot
          </a>
        </div>
      </section>

      <footer className="footer">
        <strong>AgentDock</strong>
        <span>Keep your systems. See every agent. Control every action.</span>
      </footer>
    </main>
  )
}

function OfficeMap() {
  return (
    <div className="office-shell" aria-label="AgentDock virtual office preview">
      <div className="office-titlebar">
        <span>Live service floor</span>
        <strong>Managed connectivity demo</strong>
      </div>
      <div className="office-map">
        {departments.map((department) => (
          <section className={`room ${department.tone}`} key={department.name}>
            <div>
              <span>{department.system}</span>
              <h3>{department.name}</h3>
            </div>
            <p>{department.copy}</p>
            <strong>{department.status}</strong>
          </section>
        ))}

        <section className="room meeting-room">
          <span>Meeting Room</span>
          <h3>Risk stand-up</h3>
          <p>Agents bring the ugly cases here before the manager hears about them late.</p>
        </section>

        <section className="room kitchen">
          <span>Kitchen</span>
          <h3>Human break room</h3>
          <p>The agents do not get tea. They do get queued for approval.</p>
        </section>

        <section className="review-gate">
          <span>Review Gate</span>
          <h3>Approve before it hits the customer.</h3>
          <p>First replies, credits, escalations, and system updates stop here.</p>
        </section>

        <div className="agent-dot dot-one">
          <span>Complaint</span>
        </div>
        <div className="agent-dot dot-two">
          <span>Finance</span>
        </div>
        <div className="agent-dot dot-three">
          <span>SLA</span>
        </div>
      </div>
    </div>
  )
}

export default App
