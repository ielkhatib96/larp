import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

// The strip at the top of every page: the LARP name, the light/dark switch, and a Log in link.
// min-h-12 / size-12 = 48px, a comfortable size to tap with a thumb.
function TopBar() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
      <Link to="/" className="inline-flex min-h-12 items-center font-display text-3xl font-medium tracking-tight">
        LARP
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/login"
          className="inline-flex min-h-12 items-center rounded-full border border-ink/15 px-5 font-medium transition hover:bg-brand-pale dark:border-white/25 dark:hover:bg-white/10"
        >
          Log in
        </Link>
      </div>
    </header>
  )
}

export default TopBar
