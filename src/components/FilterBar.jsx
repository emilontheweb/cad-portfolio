import { Search, X } from 'lucide-react'

export default function FilterBar({ projects, activeFilter, onFilterChange, searchQuery, onSearchChange }) {
  // Collect all unique software tags across all projects
  const allSoftware = ['All', ...new Set(projects.flatMap((p) => p.software ?? []))]

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search projects…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Software filter chips */}
      <div className="flex flex-wrap gap-2">
        {allSoftware.map((sw) => {
          const active = activeFilter === sw
          return (
            <button
              key={sw}
              onClick={() => onFilterChange(sw)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? '#fff' : 'var(--text-secondary)',
                transform: active ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {sw}
            </button>
          )
        })}
      </div>
    </div>
  )
}
