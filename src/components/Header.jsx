import { useState } from 'react'
import './Header.css'

function FlameMark() {
  return (
    <svg
      className="header__mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2.2c.8 3.2-2.9 4.7-2.9 8.1 0 1.4 1 2.5 2.2 2.5 1.1 0 1.9-.8 2.1-2 1.8 2 3.2 4.1 3.2 6.7 0 3.6-2.6 6.1-5.6 6.1-3.9 0-6.8-2.7-6.8-6.5 0-3.4 2.4-5.6 4.4-7.9C10.5 7 12 4.6 12 2.2Z"
      />
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  )
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
      <path d="m16.5 9.5 4.5 5" />
      <path d="m21 9.5-4.5 5" />
    </svg>
  )
}

function Header() {
  const [muted, setMuted] = useState(false)

  return (
    <header className="header">
      <div className="header__brand">
        <FlameMark />
        <span className="header__name">BurnNote</span>
      </div>

      <button
        type="button"
        className="header__sound"
        aria-label="Mute sound"
        aria-pressed={muted}
        onClick={() => setMuted((isMuted) => !isMuted)}
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </header>
  )
}

export default Header
