import { useEffect } from 'react'
import './BurnEffect.css'

function BurnEffect({ text, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 5500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="burn-effect">
      <div className="burn-effect__paper">
        <div className="burn-effect__text">{text}</div>
      </div>
      <div className="burn-effect__flame"></div>
    </div>
  )
}

export default BurnEffect
