import {
  clusters,
  lanes,
  outcomes,
  scoredTotal,
  scoredSkillIds,
  coreSkillIds,
  coreTotal,
  capstone,
  skillById,
  getLane,
  emancipation,
} from '../lib/content'
import { useAppState, setFocus, skillStateFor } from '../lib/store'
import { fmtMonth, rowArrival } from '../lib/age'
import { StateButtons } from './StateButtons'
import type { Lane } from '../types'

const STALE_DAYS = 90
const FOCUS_DAYS = 14

const LaneCard = ({ lane, kidId }: { lane: Lane; kidId: string | null }) => {
  const state = useAppState()
  const progress = kidId ? state.progress[kidId] ?? {} : {}

  if (lane.kind === 'character') {
    // shared language for noticing growth with a kid — never a scorecard kept about them
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
          <span className="kind-badge character">character</span>
          <span className="lane-counts muted">noticed together — never scored</span>
        </div>
      </a>
    )
  }

  const scored = lane.skills.filter((s) => s.touch !== 'light')
  const got = scored.filter((s) => progress[s.id]?.state === 'got-it').length
  const working = scored.filter((s) => progress[s.id]?.state === 'working').length
  const pct = Math.round((got / scored.length) * 100)
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
        <span className="kind-badge">competence</span>
        <span className="lane-counts">
          {got}/{scored.length} got it{working > 0 && <em> · {working} working</em>}
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
  const scoredEntries = Object.entries(progress).filter(([id]) => scoredSkillIds.has(id))
  const gotTotal = scoredEntries.filter(([, p]) => p.state === 'got-it').length
  const workingTotal = scoredEntries.filter(([, p]) => p.state === 'working').length
  const coreGot = scoredEntries.filter(([id, p]) => coreSkillIds.has(id) && p.state === 'got-it').length

  const now = new Date()
  const staleCutoff = new Date(now.getTime() - STALE_DAYS * 86400000).toISOString().slice(0, 10)
  const staleWorking = scoredEntries.filter(
    ([, p]) => p.state === 'working' && p.date !== undefined && p.date < staleCutoff,
  ).length

  const focus = kid ? state.focus[kid.id] : undefined
  const focusLane = focus ? getLane(focus.laneId) : undefined
  const focusDay = focus
    ? Math.max(1, Math.floor((now.getTime() - new Date(focus.started + 'T12:00:00').getTime()) / 86400000) + 1)
    : 0

  // every kid's next freedom, soonest first — five kids, staggered birthdays, none forgotten
  const horizonMs = 183 * 86400000
  const upcoming = state.kids
    .flatMap((k) =>
      emancipation.rows.map((row) => ({ kid: k, row, arrival: rowArrival(k, row, state.emancipationAges) })),
    )
    .filter((u) => u.arrival > now && u.arrival.getTime() - now.getTime() < horizonMs)
    .sort((a, b) => a.arrival.getTime() - b.arrival.getTime())

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
            Start by <a href="#/family">adding your kids</a>, then run the{' '}
            <a href="#/recognition">recognition pass</a> — mark what's already true; plenty will be. Read{' '}
            <a href="#/guide">the Guide</a> for the whole philosophy.
          </p>
        </section>
      )}

      {kid && (
        <section className="kid-summary">
          <h2>
            {kid.name}'s tree
            <span className="kid-summary-stats">
              🎯 launch core {coreGot} of {coreTotal} · {gotTotal} of {scoredTotal} skills overall ·{' '}
              {workingTotal} in progress
            </span>
          </h2>
          <p className="muted">
            Three states, no failing: <strong>not yet</strong> · <strong>working on it</strong> ·{' '}
            <strong>got it</strong>. Mark anything already true — start with the{' '}
            <a href="#/recognition">recognition pass</a>. The 🎯 <strong>Launch Core</strong> is the
            three dozen college-critical skills; the other {scoredTotal - coreTotal} are extensions —
            a map to wander, never a checklist to finish.
          </p>
          {staleWorking > 0 && (
            <p className="muted small stale-nudge">
              {staleWorking} skill{staleWorking > 1 ? 's have' : ' has'} been "working on it" for over
              three months — worth a look: still in motion, or just stale?
            </p>
          )}
        </section>
      )}

      {kid && (
        <section className="focus-card">
          {focusLane ? (
            <p>
              ★ <strong>Current focus:</strong> {kid.name} ×{' '}
              <a href={`#/lane/${focusLane.id}`}>
                {focusLane.emoji} {focusLane.name}
              </a>{' '}
              — day {Math.min(focusDay, FOCUS_DAYS)} of {FOCUS_DAYS}
              {focusDay > FOCUS_DAYS && <em> (fortnight's up — check in, then pick the next)</em>}{' '}
              <button className="ghost-btn tiny" onClick={() => setFocus(kid.id, null)}>
                clear
              </button>
            </p>
          ) : (
            <p className="muted">
              ☆ No current focus. The rhythm that works: one kid, one lane, two weeks — open a lane and
              press <em>make this our focus</em>.
            </p>
          )}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="horizon-strip">
          <h2 className="section-title">Freedoms on the horizon</h2>
          <ul className="horizon-list">
            {upcoming.map(({ kid: k, row, arrival }) => {
              const announced = state.announced[k.id]?.[row.id] ?? false
              return (
                <li key={`${k.id}:${row.id}`} className={announced ? 'announced' : ''}>
                  <strong>{k.name}</strong> — “{row.title}” arrives {fmtMonth(arrival)} ·{' '}
                  {announced ? (
                    '✓ announced'
                  ) : (
                    <a href="#/emancipation">announce it now →</a>
                  )}
                </li>
              )
            })}
          </ul>
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

      {clusters.map((c) => {
        const shown = c.lanes.filter((id) => !state.hiddenLanes.includes(id))
        if (shown.length === 0) return null
        return (
          <section key={c.id} className="cluster">
            <h2 className="section-title">{c.id}</h2>
            <div className="lane-grid">
              {shown.map((id) => {
                const lane = lanes.find((l) => l.id === id)
                return lane ? <LaneCard key={id} lane={lane} kidId={kid?.id ?? null} /> : null
              })}
            </div>
          </section>
        )
      })}

      <section className="capstone-card">
        <h2 className="section-title">🏁 The launch capstone — {capstone.name}</h2>
        <p className="muted">{capstone.intro}</p>
        <p>
          <strong>Got it when…</strong> {capstone.gotItWhen}
        </p>
        <div className="prereq-chips">
          {capstone.comesAfter.map((p) => {
            const pre = skillById.get(p)
            if (!pre) return null
            const done = kid ? skillStateFor(state, kid.id, p) === 'got-it' : false
            return (
              <a key={p} className={`prereq-chip cross ${done ? 'done' : ''}`} href={`#/lane/${pre.laneId}/${p}`}>
                {done ? '✓ ' : ''}
                {getLane(pre.laneId)?.emoji} {pre.name}
              </a>
            )
          })}
        </div>
        {kid ? (
          <>
            <StateButtons kidId={kid.id} skill={capstone} />
            <p className="muted small">
              Rarely before ~{capstone.ageFloor} — and it's observed by living through it: one real week,
              ordinary life running, adults strictly on-call.
            </p>
          </>
        ) : (
          <p className="muted small">
            Lane finales prove skills one at a time; this proves them all at once. <a href="#/family">Add
            your kids</a> to track it.
          </p>
        )}
      </section>
    </div>
  )
}
