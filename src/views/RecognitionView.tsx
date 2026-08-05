import { lanes, isScored } from '../lib/content'
import { useAppState } from '../lib/store'
import { ageOf } from '../lib/age'
import { StateButtons } from './StateButtons'

/**
 * The recognition pass: every lane's starting nodes in one place, so the first
 * session is a fast "mark what's already true" — recognition, not a 202-node slog.
 * Character lanes and light-touch nodes stay out on purpose: they're read together,
 * never triaged.
 */
export default function RecognitionView() {
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null

  if (!kid)
    return (
      <div className="recognition">
        <header className="page-head">
          <h1>✅ The recognition pass</h1>
          <p className="lead">
            <a href="#/family">Add your kids</a> first — then come back and mark what's already true.
          </p>
        </header>
      </div>
    )

  const kidAge = ageOf(kid)
  const sections = lanes
    .filter((l) => l.kind === 'competence' && !state.hiddenLanes.includes(l.id))
    .map((lane) => ({
      lane,
      starters: lane.skills.filter(
        (s) =>
          isScored(s, lane) &&
          s.comesAfter.length === 0 &&
          (s.ageFloor === undefined || s.ageFloor <= kidAge),
      ),
    }))
    .filter((x) => x.starters.length > 0)

  const progress = state.progress[kid.id] ?? {}
  const total = sections.reduce((n, x) => n + x.starters.length, 0)
  const marked = sections.reduce(
    (n, x) => n + x.starters.filter((s) => progress[s.id]?.state === 'got-it').length,
    0,
  )

  return (
    <div className="recognition">
      <header className="page-head">
        <h1>✅ The recognition pass</h1>
        <p className="lead">
          Every lane's starting nodes, one screen, for {kid.name}. First session rule: mark what's{' '}
          <em>already true</em> — plenty will be. This should feel like recognition, not assignment;
          anything genuinely new can wait for a lane focus.
        </p>
        <p className="muted">
          {marked} of {total} starters marked "got it" so far. Character lanes aren't here — read those{' '}
          <em>with</em> your kid, they're never triaged.
        </p>
      </header>

      {sections.map(({ lane, starters }) => (
        <section key={lane.id} className="recognition-lane">
          <h2 className="section-title">
            <a href={`#/lane/${lane.id}`}>
              {lane.emoji} {lane.name}
            </a>
          </h2>
          <div className="recognition-list">
            {starters.map((skill) => (
              <div className="recognition-row" key={skill.id}>
                <div className="recognition-text">
                  <a className="recognition-name" href={`#/lane/${lane.id}/${skill.id}`}>
                    {skill.name}
                  </a>
                  <p className="muted small">{skill.gotItWhen}</p>
                </div>
                <StateButtons kidId={kid.id} skill={skill} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
