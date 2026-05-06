# AgentDock Launch Scenarios

Updated: 6 May 2026

Structure adapted from the JobFilter launch-scenario discipline, but the scenarios below are specific to AgentDock.

## Purpose

Run these simulations to find where AgentDock breaks, misleads, or fails to deliver value for service managers, customer service heads, finance teams, field operations, and compliance reviewers.

Each scenario exposes a product weakness. Fix the gap, not just the demo.

| # | Situation | Run | Product Question | Recommended Proof |
|---:|---|---|---|---|
| 1 | Major connectivity outage hits multiple enterprise customers. SLA clocks are already running. | Detect duplicate tickets, group incidents, open priority bridge, draft customer updates, route field ops. | Can AgentDock stop teams losing time during live outages? | SLA countdown, grouped incidents, bridge handoff, customer update draft. |
| 2 | VIP customer complains after repeated missed engineer visits. | Pull history from Zendesk/ServiceNow, flag complaint risk, prepare timeline, send to review. | Can AgentDock give managers the full story before response? | Complaint timeline, missed-visit chain, human approval gate. |
| 3 | Finance disputes a credit note linked to downtime compensation. | Match SLA breach data, invoice records, ticket history, and approval policy. | Can AgentDock reduce finance back-and-forth on service credits? | SLA breach proof, dispute packet, audit trail. |
| 4 | Hundreds of slow-speed tickets arrive after a regional fault. | Cluster tickets by postcode, circuit, supplier, and root cause; recommend bulk handling. | Can AgentDock separate real faults from duplicate noise? | Cluster view, duplicate suppression, bulk response workflow. |
| 5 | Service manager needs Monday morning risk view across open accounts. | Rank accounts by SLA exposure, complaint risk, revenue impact, and stalled handoffs. | Can AgentDock show which accounts need action first? | Account risk dashboard with SLA, finance, complaint, ops status. |
| 6 | Field engineer marks job complete, but customer says service still down. | Reopen handoff, compare engineer notes, test results, and customer response. | Can AgentDock catch broken field-ops closures? | Engineer note mismatch, reopen action log. |
| 7 | Complaint team must respond within regulated timescales. | Track complaint clock, draft response, require manager approval before send. | Can AgentDock stop complaint deadlines being missed? | Complaint SLA timer, draft response, approval history. |
| 8 | Customer asks why they are billed during an outage. | Gather outage window, billing period, SLA terms, and credit eligibility. | Can AgentDock give support a clean answer without finance escalation? | Billing dispute summary, credit recommendation, source links. |
| 9 | Network ops updates Jira, but customer service works in Zendesk. | Sync status, translate technical notes into customer-safe language, log changes. | Can AgentDock stop teams working from different truths? | Jira-to-Zendesk sync, translated update, audit log. |
| 10 | High-value account threatens to leave after slow responses. | Flag churn risk, summarise pain points, recommend immediate actions. | Can AgentDock help save accounts before escalation? | Churn-risk account card, action list, executive-ready summary. |
| 11 | Supplier blames customer equipment, customer blames network provider. | Collect diagnostics, supplier notes, engineer evidence, and customer timeline. | Can AgentDock build a defensible fault position? | Evidence pack, source references, dispute timeline. |
| 12 | Ticket passes between five teams with no ownership. | Detect handoff loop, assign accountable owner, escalate with context. | Can AgentDock stop internal ticket tennis? | Handoff chain, owner recommendation, escalation note. |
| 13 | ServiceNow incident is missing fields needed for SLA reporting. | Identify missing data, request completion, block closure until reviewed. | Can AgentDock protect reporting quality? | Required-field checker, closure block, manager review gate. |
| 14 | Customer demands compensation after intermittent faults over weeks. | Reconstruct impact from multiple tickets, outage logs, and engineer visits. | Can AgentDock prove recurring fault patterns? | Multi-ticket timeline, downtime total, compensation recommendation. |
| 15 | Contact centre receives angry calls before ops posts an update. | Monitor ops systems, draft holding statement, push approved update into Zendesk. | Can AgentDock keep frontline teams ahead of complaints? | Live ops signal, approved customer message, publish log. |
| 16 | Field ops needs clear job notes before attending site. | Condense ticket history, access details, tests, impact, and priority. | Can AgentDock make engineer handoffs cleaner? | Engineer brief, access notes, test history, customer impact. |
| 17 | Audit team asks who approved a customer-facing outage statement. | Show draft, reviewer, approval time, connector source, and final message. | Can AgentDock prove who approved what? | Immutable audit log, version history, reviewer record. |
| 18 | Multiple tools disagree on ticket priority. | Compare SLA, customer tier, complaint status, and revenue value. | Can AgentDock create one priority view across systems? | Priority reasoning panel, source data, override log. |
| 19 | Enterprise customer requests a formal incident report. | Generate chronology, root-cause notes, actions, SLA impact, pending actions. | Can AgentDock produce reports without manual digging? | Downloadable report, source-backed timeline, review gate. |
| 20 | Finance wants proof before approving goodwill credit. | Link complaint severity, service failure evidence, account value, and prior credits. | Can AgentDock make goodwill decisions consistent? | Credit approval workflow, policy match, finance decision log. |
| 21 | Zendesk ticket should become a Jira issue, but context gets lost. | Convert customer problem into technical issue with evidence and acceptance criteria. | Can AgentDock improve support-to-engineering handoffs? | Zendesk-to-Jira connector flow, generated Jira issue, linked audit trail. |
| 22 | Manager needs to know which automation actions require human sign-off. | Separate low-risk updates from complaint, credit, SLA, and legal-risk actions. | Can AgentDock automate without losing control? | Human review queue, risk labels, approve/reject buttons. |

