# AgentDock Product Overview

## Position

AgentDock is a plug-and-play agent operations platform for service managers running messy cross-department workflows through ServiceNow, Zendesk, Jira, email, finance systems, and field operations tools.

It does not replace those systems. It makes agents visible, reviewable, and auditable inside them.

## Promise

```text
See every agent.
Control every action.
Keep your systems.
```

## Core Workflow

```text
Trigger -> Triage -> Draft -> Review -> Send -> Log
```

## MVP

- Operations Dock dashboard
- Agent Board
- Complaint management pipeline for telecom/service teams
- Manual workflow trigger and assignment
- Review Gate before risky actions
- Handoff Log with audit trail
- ServiceNow connector first
- Support for OpenAI and Anthropic providers
- Seed data for demo mode

## Core Modules

- Operations Dock: main workspace showing agents, workflows, connectors, approvals, and alerts.
- Agent Board: cards for each active agent with role, model, status, system, and last action.
- Pipeline View: workflow stage tracking with owner, source system, blockers, and time in stage.
- Review Gate: human checkpoint for sending, updating, escalating, deleting, or refunding.
- Handoff Log: readable action history with audit evidence.
- System Connectors: ServiceNow, Zendesk, Jira, email, webhook, and custom API connectors.

## Department Agents

### Complaints Agent

Handles customer complaints across ServiceNow, Zendesk, email, and phone logs. It classifies severity, routes to the right team, drafts first responses from approved policy, requires human approval, sends only after approval, and logs the outcome.

### Finance Agent

Supports invoice discrepancies, payment follow-ups, budget variance checks, and expense validation. It validates against purchase orders or contracts, flags mismatches, drafts follow-up messages, and waits for approval before contacting customers or suppliers.

### Sales Agent

Qualifies inbound leads, drafts proposals, updates CRM records, and schedules follow-ups. It works with Salesforce, HubSpot, email, and LinkedIn-style sources.

### HR Agent

Handles leave requests, onboarding questions, routine policy queries, and employee routing. Routine replies can be drafted from approved policy, while sensitive issues route to HR.

### IT Support Agent

Classifies service desk tickets, handles routine access or password workflows where connected, routes non-routine tickets, and writes resolution notes for the service desk.

### Report Generation Agent

Pulls from connected systems to prepare weekly summaries, compliance reports, and management packs. Human approval is required before distribution.

## First Connector: ServiceNow

ServiceNow is the first serious connector because it anchors enterprise complaint, ITSM, CSM, and case workflows.

Connector responsibilities:

- Authenticate with the ServiceNow REST API.
- Read incidents, cases, and changes.
- Map ServiceNow records into AgentDock tasks.
- Update records after approval.
- Receive webhooks for real-time workflow triggers.
- Write audit references back to the source record where appropriate.

## Service Manager Buyer Story

The first buyer is a service manager inside a telecom, broadband, managed Wi-Fi, or network services company.

They own the ugly middle:

- Customers shouting about downtime.
- Billing disputes after package changes or failed provisioning.
- SLA timers running while teams argue ownership.
- Field engineers missing notes, parts, access, or handover detail.
- Account managers warning that a customer is about to leave.
- Finance asking whether a credit is valid.

AgentDock should give them the cases that need action today, not another queue to babysit.

## Service Risk Signals

AgentDock prioritises:

- SLA risk
- Complaint risk
- Churn risk
- Billing dispute risk
- Repeat ticket volume
- Credit leakage
- Avoidable engineer rework
- Stuck handoffs between support, finance, field ops, and account management

## Complaint Clock Tracking

AgentDock should track complaint age and deadline risk by configured rule set:

- FCA-regulated complaint route
- Payment services / e-money complaint route
- UK telecom ADR route
- Irish telecom complaint route
- Internal SLA route
- Contract-specific customer SLA route

Sensitive actions such as final responses, credits, deadlock letters, and customer-facing complaint updates must pass through Review Gate.

## Technical Direction

- Frontend: React, TypeScript, Vite
- Backend: Node.js service with connector plugins
- Storage: Postgres for SaaS, SQLite for local dev
- Agent execution: provider APIs and CLI agents managed by AgentDock
- Security: encrypted API keys, immutable logs, authenticated approval actions
