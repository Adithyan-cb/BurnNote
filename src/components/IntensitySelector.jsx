const INTENSITIES = [
  { id: 'gentle', label: 'Gentle Ember' },
  { id: 'inferno', label: 'Roaring Inferno' },
  { id: 'dissolve', label: 'Slow Dissolve' },
]

function IntensitySelector({ value, onChange }) {
  return (
    <div className="intensity">
      <span className="intensity__label">Pyre Flame Velocity</span>
      <div
        className="intensity__options"
        role="group"
        aria-label="Burn intensity"
      >
        {INTENSITIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`intensity__btn${value === id ? ' intensity__btn--active' : ''}`}
            aria-pressed={value === id}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default IntensitySelector
