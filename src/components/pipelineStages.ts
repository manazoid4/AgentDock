import type { TaskStatus } from '../types'

export const PIPELINE_STAGES: { label: string; status: TaskStatus }[] = [
  { label: 'TRIGGER',  status: 'triggered' },
  { label: 'TRIAGE',   status: 'triaged' },
  { label: 'DRAFT',    status: 'in-progress' },
  { label: 'REVIEW',   status: 'awaiting-approval' },
  { label: 'RESOLVED', status: 'resolved' },
  { label: 'LOG',      status: 'logged' },
]
