import { useState } from 'react'
import { Cpu, ChevronRight } from 'lucide-react'
import ModelViewer from './ModelViewer'

const BASE = import.meta.env.BASE_URL

export default function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false)
  const modelUrl = `${BASE}models/${project.modelFile}`

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.15)'
          : '0 4px 12px rgba(0,0,0,0.3)',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      aria-label={`View ${project.title}`}
    >
      {/* 3D Preview — auto-rotates, no controls */}
      <div
        className="relative overflow-hidden"
        style={{ height: 220, background: 'var(--bg-secondary)' }}
      >
        <ModelViewer url={modelUrl} interactive={false} />

        {/* "Click to explore" hint on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            background: 'rgba(10,10,15,0.45)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <span
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            Explore <ChevronRight size={14} />
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {/* Software pills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.software?.map((sw) => (
            <span
              key={sw}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs"
              style={{
                background: 'rgba(79,142,247,0.08)',
                border: '1px solid rgba(79,142,247,0.2)',
                color: 'var(--accent)',
              }}
            >
              <Cpu size={10} />
              {sw}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
