'use client'

import { useState } from 'react'
import { FiMoreVertical, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'

export default function LeadTable({ leads }) {
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const getStatusColor = (status) => {
    const colors = {
      'Not Dialled': 'bg-gray-100 text-gray-800',
      'Good Lead': 'bg-green-100 text-green-800',
      'Sale Done': 'bg-blue-100 text-blue-800',
      'Hot Lead': 'bg-red-100 text-red-800',
      'Cold Lead': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getLevelColor = (level) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-red-100 text-red-800',
      'P': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Lead Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Email</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Contact</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Date Created</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Company</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Quality</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Lev</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{lead.contact}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{lead.dateCreated}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{lead.company}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">—</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getLevelColor(lead.level)}`}>
                    {lead.level}
                  </span>
                </td>
                <td className="py-3 px-4 relative">
                  <button 
                    onClick={() => setDropdownOpen(dropdownOpen === lead.id ? null : lead.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiMoreVertical />
                  </button>
                  
                  {dropdownOpen === lead.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FiEye /> View
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FiEdit /> Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}