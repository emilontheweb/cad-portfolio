import { useEffect, useRef } from 'react'
import { X, Cpu, Calendar } from 'lucide-react'
import ModelViewer from './ModelViewer'

const BASE = import.meta.env.BASE_URL

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const modelUrl = `${BASE}models/${project.modelFile}`

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* 3D Viewer — full interactive mode */}
        <div style={{ height: 380, background: 'var(--bg-secondary)' }}>
          <ModelViewer url={modelUrl} interactive={true} />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <h2
            className="text-2xl font-semibold mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.3px' }}
          >
            {project.title}
          </h2>

          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-3">
            {project.software?.map((sw) => (
              <span
                key={sw}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background: 'rgba(79,142,247,0.1)',
                  border: '1px solid rgba(79,142,247,0.25)',
                  color: 'var(--accent)',
                }}
              >
                <Cpu size={12} />
                {sw}
              </span>
            ))}
          </div>

          {/* Controls hint */}
          <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            🖱 Drag to rotate · Scroll to zoom · Right-click drag to pan
          </p>
        </div>
      </div>
    </div>
  )
}
