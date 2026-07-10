'use client'

export default function LeadFilters() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input 
        type="text" 
        placeholder="Search leads..." 
        className="input-field max-w-xs"
      />
      <select className="input-field max-w-xs">
        <option>All Status</option>
        <option>Not Dialled</option>
        <option>Good Lead</option>
        <option>Sale Done</option>
        <option>Hot Lead</option>
        <option>Cold Lead</option>
      </select>
      <select className="input-field max-w-xs">
        <option>All Sources</option>
        <option>Facebook Ads</option>
        <option>Google Ads</option>
        <option>CSV Import</option>
      </select>
    </div>
  )
}
