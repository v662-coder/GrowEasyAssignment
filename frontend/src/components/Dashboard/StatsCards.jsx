'use client'

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Leads', value: stats.totalLeads, color: 'bg-blue-50 text-blue-600' },
    { label: 'New Leads', value: stats.newLeads, color: 'bg-green-50 text-green-600' },
    { label: 'Converted', value: stats.converted, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active', value: stats.active, color: 'bg-orange-50 text-orange-600' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
