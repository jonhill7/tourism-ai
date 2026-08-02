import { useState } from 'react'
import { emancipation, expectations, expectationsIntro } from '../lib/content'
import { useAppState, setEmancipationAge } from '../lib/store'
import { ageOf, fmtMonth, graduationDate, rowArrival } from '../lib/age'

export default function EmancipationView() {
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null
  const [editing, setEditing] = useState(false)
  const now = new Date()

  return (
    <div className="emancipation">
      <header className="page-head">
        <h1>🗓 The Emancipation Track</h1>
        <p className="lead">{emancipation.intro}</p>
      </header>

      <section className="rules-grid">
        {emancipation.rules.map((r, i) => (
          <div className="rule-card" key={i}>
            <span className="rule-num">{i + 1}</span>
            <p>{r}</p>
          </div>
        ))}
      </section>

      <section className="calendar">
        <div className="calendar-head">
          <h2 className="section-title">The calendar {kid && <span className="muted-note">— for {kid.name}</span>}</h2>
          <button className="ghost-btn" onClick={() => setEditing((e) => !e)}>
            {editing ? 'done editing' : '✎ edit ages'}
          </button>
        </div>
        {!kid && (
          <p className="muted">
            <a href="#/family">Add your kids</a> to see when each freedom arrives for them.
          </p>
        )}
        <ol className="calendar-list">
          {emancipation.rows.map((row) => {
            const effAge = state.emancipationAges[row.id] ?? row.defaultAge
            const arrival = kid ? rowArrival(kid, row, state.emancipationAges) : null
            const arrived = arrival ? arrival <= now : false
            return (
              <li key={row.id} className={`calendar-row ${arrived ? 'arrived' : ''}`}>
                <div className="calendar-age">
                  {editing && row.defaultAge !== 'graduation' ? (
                    <span className="age-edit">
                      ~
                      <input
                        type="number"
                        min={8}
                        max={19}
                        value={typeof effAge === 'number' ? effAge : 18}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10)
                          if (!Number.isNaN(v)) setEmancipationAge(row.id, v)
                        }}
                      />
                      {state.emancipationAges[row.id] !== undefined && (
                        <button
                          className="ghost-btn tiny"
                          title="reset to default"
                          onClick={() => setEmancipationAge(row.id, null)}
                        >
                          ↺
                        </button>
                      )}
                    </span>
                  ) : (
                    <strong>{effAge === 'graduation' ? '🎓 graduation' : `~${effAge}`}</strong>
                  )}
                </div>
                <div className="calendar-body">
                  <h3>
                    {row.title}
                    {row.valuesLoaded && (
                      <span className="values-flag" title="A values decision — this age is the family's to set on purpose">
                        family call
                      </span>
                    )}
                  </h3>
                  <ul className="freedom-list">
                    {row.freedoms.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <p className="muted small">{row.notes}</p>
                  {kid && arrival && (
                    <p className={`arrival ${arrived ? 'arrived' : ''}`}>
                      {arrived
                        ? `Already ${kid.name}'s — no longer up to you.`
                        : `Arrives for ${kid.name}: ${fmtMonth(arrival)} — announce it now.`}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="sorting-test">
        <h2 className="section-title">The sorting test</h2>
        <p className="lead">“{emancipation.sortingTest.question}”</p>
        <div className="sort-grid">
          {emancipation.sortingTest.answers.map((a, i) => (
            <div className="sort-card" key={i}>
              <p className="sort-answer">{a.answer}</p>
              <p className="sort-verdict">{a.verdict}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="expectations">
        <h2 className="section-title">Expectations & consequences — a starter list</h2>
        <p className="muted">{expectationsIntro}</p>
        <div className="expectation-list">
          {expectations.map((e) => (
            <div className="expectation-card" key={e.id}>
              <p className="exp-text">📹 {e.expectation}</p>
              <p className="exp-consequence">↳ {e.consequence}</p>
            </div>
          ))}
        </div>
        <p className="muted small">{emancipation.companions.expectations}</p>
      </section>

      {kid && (
        <section className="adulthood">
          <h2 className="section-title">The declared adulthood date</h2>
          <p>
            {kid.adulthoodDate
              ? `${kid.name}'s declared adulthood date: ${fmtMonth(new Date(kid.adulthoodDate + '-15'))}.`
              : `${kid.name} is ${ageOf(kid)}; graduation lands around ${fmtMonth(graduationDate(kid))}. Declare an adulthood date in the Family page and tell them years in advance.`}{' '}
            {emancipation.companions.adulthoodDate}
          </p>
        </section>
      )}
    </div>
  )
}
