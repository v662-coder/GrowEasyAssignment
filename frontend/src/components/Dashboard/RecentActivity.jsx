'use client'

export default function RecentActivity() {
  const activities = [
    { text: 'New lead imported from CSV', time: '2 mins ago' },
    { text: 'Lead status updated to Sale Done', time: '15 mins ago' },
    { text: 'New lead added via Facebook Ads', time: '1 hour ago' },
    { text: 'Lead qualified as Good Lead', time: '2 hours ago' }
  ]

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-sm text-gray-600">{activity.text}</span>
            <span className="text-xs text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
