'use client'

import { useState } from 'react'
import LeadTable from '@/components/Leads/LeadTable'
import LeadFilters from '@/components/Leads/LeadFilters'
import { FiDownload, FiPlus } from 'react-icons/fi'

export default function ManageLeadsPage() {
  const [leads] = useState([
    {
      id: 1,
      name: 'punnnf g',
      email: 'kjgkhv2@ggchc.com',
      contact: '+917894561177',
      dateCreated: 'Jun 23, 2026, 2:37 PM',
      company: '—',
      status: 'Sale Done',
      quality: null,
      level: 'P'
    },
    {
      id: 2,
      name: 'kjkkvkh',
      email: 'jkhkbh@hjf.hfv',
      contact: '+911212121415',
      dateCreated: 'Jun 23, 2026, 12:23 PM',
      company: 'fhft',
      status: 'Not Dialled',
      quality: null,
      level: 'A'
    },
    {
      id: 3,
      name: 'kugkkh',
      email: 'ljgbjg@hgd.hjc',
      contact: '+911212121217',
      dateCreated: 'Jun 23, 2026, 12:17 PM',
      company: 'fhft',
      status: 'Not Dialled',
      quality: null,
      level: 'P'
    },
    {
      id: 4,
      name: 'hjyvj',
      email: 'jfgf@fgd.com',
      contact: '+911515151515',
      dateCreated: 'Jun 23, 2026, 12:16 PM',
      company: 'fhft',
      status: 'Good Lead',
      quality: null,
      level: 'A'
    },
    {
      id: 5,
      name: 'Abhraneel Dhar',
      email: 'abhraneelDhar7@groweasy.com',
      contact: '+919051589728',
      dateCreated: 'Jun 23, 2026, 11:01 AM',
      company: 'groweasy',
      status: 'Good Lead',
      quality: null,
      level: 'A'
    }
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Your Leads</h1>
          <p className="text-gray-500">Monitor lead status, assign tasks, and close deals faster.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FiDownload /> Export
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Lead
          </button>
        </div>
      </div>
      <LeadFilters />
      <LeadTable leads={leads} />
    </div>
  )
}
