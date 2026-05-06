# AgentDock

AgentDock is a visual command centre for enterprise agent operations.

It drops agents into existing systems like ServiceNow, Zendesk, Jira, email, and custom workflows without replacing them.

Core promise:

```text
You keep your systems. Agents do the work. You see and control everything.
```

## Product Position

AgentDock is not a chatbot, not a task board, and not a developer-only agent framework.

It is the control layer between humans, agents, and business systems:

- See every active agent.
- Track every workflow stage.
- Review critical actions before they execute.
- Keep immutable handoff and audit logs.
- Connect to the systems businesses already use.

## First Workflow

The first product workflow is complaint management:

```text
Trigger -> Triage -> Draft -> Review -> Send -> Log
```

The MVP focuses on ServiceNow first, then Zendesk, Jira, email, and generic webhooks.

## Site

This repo currently contains the public AgentDock website built with React, TypeScript, and Vite.

```bash
npm install
npm run dev
npm run build
```

Production output is written to `dist`.

## Source Notes

The product copy and structure were populated from the local Obsidian vault:

- `AgentDock Product Overview.md`
- `Project Outline - AgentDock.md`
- `MVP Scope.md`
- `Pricing.md`
- `Launch Checklist.md`
- `Competitor Research.md`

## Repo Structure

```text
src/
  App.tsx       Main product site
  App.css       Visual system and responsive layout
  index.css     Global base styles
docs/
  product.md    Product overview and MVP scope
  launch.md     Launch checklist and pricing direction
  competitive-research.md  Competitor scan and positioning gap
```
