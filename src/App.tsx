import { useEffect, useState } from 'react'
import { useAppState, setActiveKid } from './lib/store'
import { ageOf } from './lib/age'
import HomeView from './views/HomeView'
import LaneView from './views/LaneView'
import EmancipationView from './views/EmancipationView'
import FamilyView from './views/FamilyView'
import GuideView from './views/GuideView'
import PrintView from './views/PrintView'
import RecognitionView from './views/RecognitionView'

const useHashRoute = (): string[] => {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export default function App() {
  const parts = useHashRoute()
  const state = useAppState()
  const [route] = parts

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [parts.join('/')])

  if (route === 'print') return <PrintView laneId={parts[1]} />

  const nav = (
    <header className="app-header">
      <a className="wordmark" href="#/">
        <span className="wordmark-emoji">🌳</span>
        <span>
          <strong>Quest Tree</strong>
          <small>a field guide to launching</small>
        </span>
      </a>
      <nav className="app-nav">
        <a href="#/" className={!route ? 'active' : ''}>Skill Tree</a>
        <a href="#/emancipation" className={route === 'emancipation' ? 'active' : ''}>Emancipation</a>
        <a href="#/guide" className={route === 'guide' ? 'active' : ''}>The Guide</a>
        <a href="#/family" className={route === 'family' ? 'active' : ''}>Family</a>
      </nav>
      {state.kids.length > 0 && (
        <div className="kid-switcher" role="tablist" aria-label="Choose a kid">
          {state.kids.map((k) => (
            <button
              key={k.id}
              role="tab"
              aria-selected={state.activeKidId === k.id}
              className={`kid-chip ${state.activeKidId === k.id ? 'active' : ''}`}
              onClick={() => setActiveKid(k.id)}
            >
              {k.name} <span className="kid-age">{ageOf(k)}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  )

  return (
    <div className="app">
      {nav}
      <main className="app-main">
        {route === 'lane' ? (
          <LaneView laneId={parts[1]} skillId={parts[2]} />
        ) : route === 'emancipation' ? (
          <EmancipationView />
        ) : route === 'family' ? (
          <FamilyView />
        ) : route === 'guide' ? (
          <GuideView />
        ) : route === 'recognition' ? (
          <RecognitionView />
        ) : (
          <HomeView />
        )}
      </main>
      <footer className="app-footer">
        <p>
          Nothing here has to be <em>right</em> — it has to be <em>started and visible</em>, then adjusted
          against real kids. Customize it; don't obey it.
        </p>
      </footer>
    </div>
  )
}
