// src/components/LeadSources/SourceList.jsx
'use client'

export default function SourceList({ sources }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Sources</h2>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{source.name}</p>
              <p className="text-sm text-gray-500">{source.status}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              source.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {source.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}