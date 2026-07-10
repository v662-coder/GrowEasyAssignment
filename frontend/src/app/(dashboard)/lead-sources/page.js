'use client'

import { useState } from 'react'
import CSVImport from '@/components/LeadSources/CSVImport'

export default function LeadSourcesPage() {
  const [sources] = useState([
    { name: 'Facebook Ads', status: 'Not Connected', active: false },
    { name: 'Google Ads', status: 'Not Connected', active: false },
    { name: 'hony', status: 'Not Connected', active: false }
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
        <p className="text-gray-500">Connect, manage, and control all your lead channels from one dashboard.</p>
      </div>
      <div className="space-y-6">
        <CSVImport />
      </div>
    </div>
  )
}
