import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [phase] = useState('writing')

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        {phase === 'writing' && (
          <section className="shell" aria-labelledby="writing-prompt">
            <p className="shell__eyebrow">A quiet place to let go</p>
            <h1 className="shell__prompt" id="writing-prompt">
              What do you want to let go of?
            </h1>
            <p className="shell__hint">
              Write it down. Burn it. Nothing is saved, nothing is sent.
            </p>
            <div className="shell__page" aria-hidden="true" />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
