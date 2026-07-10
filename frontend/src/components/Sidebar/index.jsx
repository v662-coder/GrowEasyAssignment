// src/components/Sidebar/index.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiLayout, 
  FiUsers, 
  FiUserPlus, 
  FiMessageSquare,
  FiUsers as FiTeam,
  FiLink,
  FiGlobe,
  FiMessageCircle,
  FiPhone,
  FiSettings,
  FiCode,
  FiBriefcase,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [controlOpen, setControlOpen] = useState(true)

  const menuItems = {
    main: [
      { name: 'Dashboard', href: '/dashboard', icon: FiLayout },
      { name: 'Generate Leads', href: '/generate-leads', icon: FiUserPlus },
      { name: 'Manage Leads', href: '/manage-leads', icon: FiUsers },
      { name: 'Engage Leads', href: '/engage-leads', icon: FiMessageSquare },
    ],
    control: [
      { name: 'Team Members', href: '/team-members', icon: FiTeam },
      { name: 'Lead Sources', href: '/lead-sources', icon: FiLink },
      { name: 'Ad Accounts', href: '/ad-accounts', icon: FiGlobe },
      { name: 'WhatsApp Account', href: '/whatsapp-account', icon: FiMessageCircle },
      { name: 'Tele Calling', href: '/tele-calling', icon: FiPhone },
      { name: 'CRM Fields', href: '/crm-fields', icon: FiSettings },
      { name: 'API Center', href: '/api-center', icon: FiCode },
      { name: 'Business Center', href: '/business-center', icon: FiBriefcase },
    ]
  }

  const isActive = (path) => pathname === path

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600">GrowEasy</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</p>
          {menuItems.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all duration-200 ${
                isActive(item.href) ? 'bg-indigo-50 text-indigo-600 font-medium' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        <div>
          <button
            onClick={() => setControlOpen(!controlOpen)}
            className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
          >
            <span>Control Center</span>
            {controlOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
          </button>
          
          {controlOpen && (
            <div>
              {menuItems.control.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all duration-200 ${
                    isActive(item.href) ? 'bg-indigo-50 text-indigo-600 font-medium' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}