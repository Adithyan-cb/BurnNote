import './BurnButton.css'

function BurnButton({ disabled, onBurn }) {
  return (
    <button
      className="burn-button"
      disabled={disabled}
      onClick={onBurn}
      type="button"
    >
      Burn
    </button>
  )
}

export default BurnButton
