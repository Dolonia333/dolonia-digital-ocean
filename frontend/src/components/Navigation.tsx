import { Link } from 'react-router-dom'
import doloniaLogo from '@/assets/dolonia-logo.png'

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 shrink-0 border-b border-[var(--line)] bg-[var(--deep)]">
      <div className="flex h-16 items-center px-6 md:pr-[calc(var(--tools-width)+1.5rem)]">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Dolonia, back to the surface">
          <img src={doloniaLogo} alt="" className="h-9 w-9" />
          <span className="leading-tight">
            <span className="ocean-display block text-lg">Dolonia</span>
            <span className="ocean-kicker">Data Tech</span>
          </span>
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
