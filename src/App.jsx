import { useCallback, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WritingArea from './components/WritingArea'
import BurnButton from './components/BurnButton'
import BurnEffect from './components/BurnEffect'
import AfterBurn from './components/AfterBurn'

export default function App() {
  const [phase, setPhase] = useState('writing')
  const [text, setText] = useState('')

  const canBurn = phase === 'writing' && text.trim().length > 0

  const handleBurn = useCallback(() => {
    if (canBurn) {
      setPhase('burning')
    }
  }, [canBurn])

  const handleBurnComplete = useCallback(() => {
    setText('')
    setPhase('aftermath')
  }, [])

  const handleWriteAgain = useCallback(() => {
    setPhase('writing')
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="main">
        {phase === 'writing' && (
          <>
            <WritingArea text={text} onChange={setText} />
            <BurnButton disabled={!canBurn} onBurn={handleBurn} />
          </>
        )}
        {phase === 'burning' && <BurnEffect text={text} onComplete={handleBurnComplete} />}
        {phase === 'aftermath' && <AfterBurn onWriteAgain={handleWriteAgain} />}
      </main>
      <Footer />
    </div>
  )
}
