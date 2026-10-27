import './PrivacyBadges.css'

const BADGES = [
  {
    title: 'Ephemeral by Design',
    body: 'Nothing is persisted to databases, cookies, or local cache storage.',
    icon: ScrollGlyph,
  },
  {
    title: 'Zero-Knowledge State',
    body: 'The note lives only in memory and is destroyed the moment the flame settles.',
    icon: ShieldGlyph,
  },
  {
    title: 'Pure Combustion',
    body: 'Once the flame settles, your keystrokes are irreversibly dissolved.',
    icon: FlameResetGlyph,
  },
]

function PrivacyBadges() {
  return (
    <div className="badges">
      {BADGES.map(({ title, body, icon: Glyph }) => (
        <div key={title} className="badges__card">
          <Glyph />
          <div>
            <h4 className="badges__title">{title}</h4>
            <p className="badges__body">{body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PrivacyBadges

function ScrollGlyph() {
  return (
    <svg
      className="badges__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19 5c-1.5-1.3-2.3-1.5-3-1.5H7a2.5 2.5 0 0 0 0 5h9a2.5 2.5 0 0 1 0 5H7a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5h8a3 3 0 0 0 3-3V6.5c0-.6-.4-1-1-1.5Z" />
    </svg>
  )
}

function ShieldGlyph() {
  return (
    <svg
      className="badges__icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5 4.5 5.5V11c0 4.8 3.2 8.6 7.5 10.3 4.3-1.7 7.5-5.5 7.5-10.3V5.5L12 2.5Z" />
    </svg>
  )
}

function FlameResetGlyph() {
  return (
    <svg
      className="badges__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5c.6 2.5-2.2 3.6-2.2 6.2 0 1.1.8 2 1.7 2 .9 0 1.5-.6 1.6-1.5 1.4 1.5 2.4 3.2 2.4 5.1 0 2.7-2 4.7-4.2 4.7" />
      <path d="M17.5 9.5c2 1 3 2.7 3 4.8 0 3.6-3 6.5-8.5 6.5S4 18.3 4 14.3c0-2.6 1.8-4.3 3.3-6" />
    </svg>
  )
}
