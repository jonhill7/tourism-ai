import { clusters, lanes, outcomes, totalSkills } from '../lib/content'
import { useAppState } from '../lib/store'
import type { Lane } from '../types'

const LaneCard = ({ lane, kidId }: { lane: Lane; kidId: string | null }) => {
  const state = useAppState()
  const progress = kidId ? state.progress[kidId] ?? {} : {}
  const got = lane.skills.filter((s) => progress[s.id]?.state === 'got-it').length
  const working = lane.skills.filter((s) => progress[s.id]?.state === 'working').length
  const pct = Math.round((got / lane.skills.length) * 100)
  return (
    <a className={`lane-card ${lane.kind}`} href={`#/lane/${lane.id}`}>
      <div className="lane-card-head">
        <span className="lane-emoji">{lane.emoji}</span>
        <div>
          <h3>{lane.name}</h3>
          <p className="lane-tagline">{lane.tagline}</p>
        </div>
      </div>
      <div className="lane-card-foot">
        {lane.kind === 'character' ? (
          <span className="kind-badge character">character</span>
        ) : (
          <span className="kind-badge">competence</span>
        )}
        <span className="lane-counts">
          {got}/{lane.skills.length} got it{working > 0 && <em> · {working} working</em>}
        </span>
      </div>
      <div className="progress-rail" aria-hidden>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </a>
  )
}

export default function HomeView() {
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null
  const progress = kid ? state.progress[kid.id] ?? {} : {}
  const gotTotal = Object.values(progress).filter((p) => p.state === 'got-it').length
  const workingTotal = Object.values(progress).filter((p) => p.state === 'working').length

  return (
    <div className="home">
      {state.kids.length === 0 && (
        <section className="welcome-card">
          <h2>Welcome to your family's Quest Tree</h2>
          <p>
            Two tracks toward one goal: kids who are genuinely ready to leave home. <strong>Track A</strong> is
            this skill tree — real capabilities, earned freedom. <strong>Track B</strong> is the{' '}
            <a href="#/emancipation">Emancipation Track</a> — freedoms handed over by age, unconditionally.
          </p>
          <p>
            Start by <a href="#/family">adding your kids</a>, then open a lane and mark what's already true —
            plenty will be. Read <a href="#/guide">the Guide</a> for the whole philosophy.
          </p>
        </section>
      )}

      {kid && (
        <section className="kid-summary">
          <h2>
            {kid.name}'s tree
            <span className="kid-summary-stats">
              {gotTotal} of {totalSkills} skills · {workingTotal} in progress
            </span>
          </h2>
          <p className="muted">
            Three states, no failing: <strong>not yet</strong> · <strong>working on it</strong> ·{' '}
            <strong>got it</strong>. Mark anything already true — recognition, not busywork.
          </p>
        </section>
      )}

      <section className="outcomes-strip">
        <h2 className="section-title">The nine outcomes — what "launched" means</h2>
        <div className="outcomes-row">
          {outcomes.map((o) => (
            <div className="outcome-pill" key={o.id} title={o.note}>
              <span>{o.emoji}</span> {o.name}
            </div>
          ))}
        </div>
      </section>

      {clusters.map((c) => (
        <section key={c.id} className="cluster">
          <h2 className="section-title">{c.id}</h2>
          <div className="lane-grid">
            {c.lanes.map((id) => {
              const lane = lanes.find((l) => l.id === id)
              return lane ? <LaneCard key={id} lane={lane} kidId={kid?.id ?? null} /> : null
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
