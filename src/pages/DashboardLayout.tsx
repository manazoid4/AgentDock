import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import { CONNECTORS, TASKS } from '../data/seed'

export default function DashboardLayout() {
  const pendingApprovals = TASKS.filter(t => t.status === 'awaiting-approval').length
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <TopNav pendingApprovals={pendingApprovals} connectors={CONNECTORS} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
