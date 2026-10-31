import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { Spinner } from '@/shared/components/Spinner'
import HomePage from '@/pages/HomePage'
import ReportPage from '@/pages/ReportPage'

const LOADER_MS = 2000
const SAMPLE_REPORT = '/report/eddiedev14/linknest'

function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <img src={logo} alt="" className="size-8" />
      <span>
        Scan <span className="font-mono font-medium text-accent">my</span> Repo
      </span>
    </span>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-button px-3 py-2 text-sm transition duration-200 ${isActive ? 'bg-surface-2 text-text' : 'text-muted hover:text-text'}`

export default function App() {
  const { pathname } = useLocation()
  // Hay loader mientras la ruta mostrada no alcanza a la actual (no aplica a la carga inicial)
  const [shownPath, setShownPath] = useState(pathname)
  const loading = shownPath !== pathname

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setShownPath(pathname), LOADER_MS)
    return () => clearTimeout(t)
  }, [loading, pathname])

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Scan my Repo, inicio">
            <Logo />
          </Link>
          <nav className="flex gap-1" aria-label="Principal">
            <NavLink to="/" end className={navClass}>
              Inicio
            </NavLink>
            <NavLink to={SAMPLE_REPORT} className={navClass}>
              Reporte
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {loading ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6" aria-live="polite">
            <Logo className="text-xl" />
            <Spinner className="size-10" />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report/:owner/:repo" element={<ReportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  )
}
