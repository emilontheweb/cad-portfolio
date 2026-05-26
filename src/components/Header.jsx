import { Mail, ExternalLink, GitBranch, Box } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

/**
 * Edit the constants below to personalise the header.
 * Profile picture: drop your photo into public/ and update PROFILE_IMG.
 */
const NAME        = 'Your Name'
const TITLE       = 'Mechanical Design Engineer'
const BIO         = 'I design precise, manufacturable parts using Fusion 360 and SolidWorks. This portfolio showcases my 3D modelling work — feel free to rotate and explore every model.'
const EMAIL       = 'your@email.com'
const LINKEDIN    = 'https://linkedin.com/in/yourhandle'
const GITHUB      = 'https://github.com/yourusername'
const PROFILE_IMG = null   // e.g. `${BASE}profile.jpg`  — set to null to show initials instead

export default function Header() {
  return (
    <header
      className="w-full border-b"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">

        {/* Avatar */}
        <div
          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold"
          style={{
            width: 96,
            height: 96,
            background: 'linear-gradient(135deg, #1a2a4a 0%, #2563eb 100%)',
            border: '3px solid var(--border-hover)',
            color: '#fff',
            letterSpacing: '-1px',
          }}
        >
          {PROFILE_IMG
            ? <img src={PROFILE_IMG} alt={NAME} className="w-full h-full object-cover" />
            : NAME.split(' ').map(w => w[0]).join('').slice(0, 2)
          }
        </div>

        {/* Text block */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <Box size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--accent)', letterSpacing: '0.12em' }}>
              CAD Portfolio
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-1"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}
          >
            {NAME}
          </h1>

          <p className="text-base mb-4" style={{ color: 'var(--accent)' }}>
            {TITLE}
          </p>

          <p
            className="text-sm leading-relaxed mb-6 max-w-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            {BIO}
          </p>

          {/* Links */}
          <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: 'var(--accent)',
                color: '#fff',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-dim)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
            >
              <Mail size={14} /> Get in touch
            </a>

            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <ExternalLink size={14} /> LinkedIn
            </a>

            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <GitBranch size={14} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
