import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import ProjectCard from './components/ProjectCard'
import ProjectModal from './components/ProjectModal'
import projectsData from './data/projects.json'
import './index.css'

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Derive filtered + searched list
  const visibleProjects = useMemo(() => {
    let list = [...projectsData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    if (activeFilter !== 'All') {
      list = list.filter((p) => p.software?.includes(activeFilter))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.software?.some((s) => s.toLowerCase().includes(q))
      )
    }

    return list
  }, [activeFilter, searchQuery])

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg-primary)' }}>
      {/* ── Header / About ─────────────────────────────────────────────── */}
      <Header />

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Section heading + filter bar */}
        <div className="mb-8">
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.2px' }}
          >
            Projects
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            {projectsData.length} model{projectsData.length !== 1 ? 's' : ''} · click any card to explore in 3D
          </p>

          <FilterBar
            projects={projectsData}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Card grid */}
        {visibleProjects.length > 0 ? (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
          >
            <p className="text-lg mb-1">No projects match your filter</p>
            <button
              onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
              className="text-sm mt-3 underline"
              style={{ color: 'var(--accent)' }}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="text-center py-8 mt-10 border-t text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        Built with React + Three.js · Hosted on GitHub Pages
      </footer>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}
