'use client'

import StatsCards from '@/components/Dashboard/StatsCards'
import RecentActivity from '@/components/Dashboard/RecentActivity'
import LeadChart from '@/components/Dashboard/LeadChart'

export default function DashboardPage() {
  const stats = {
    totalLeads: 124,
    newLeads: 18,
    converted: 42,
    active: 64
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Monitor your lead performance and activities</p>
      </div>
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LeadChart />
        <RecentActivity />
      </div>
    </div>
  )
}
