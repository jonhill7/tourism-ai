import { getLane } from '../lib/content'
import { useAppState } from '../lib/store'

export default function PrintView({ laneId }: { laneId?: string }) {
  const lane = laneId ? getLane(laneId) : undefined
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null

  if (!lane) return <p className="muted">Lane not found. <a href="#/">Back home</a></p>

  return (
    <div className="print-view">
      <div className="print-toolbar no-print">
        <a href={`#/lane/${lane.id}`}>← back to {lane.name}</a>
        <button className="primary-btn" onClick={() => window.print()}>
          🖨 print
        </button>
      </div>

      <header className="print-head">
        <h1>
          {lane.emoji} {lane.name} — check-in sheet
        </h1>
        <p className="print-sub">
          {kid ? `Kid: ${kid.name}` : 'Kid: ____________________'} · Date: ____________________
        </p>
        <p className="print-note">
          Read each "got it when" together. Three honest answers, no wrong ones: <strong>not yet</strong> is
          fine, <strong>working on it</strong> is normal, <strong>got it</strong> gets recognized on the
          spot. Where you disagree, the description arbitrates — and if it can't, mark the description for
          editing, not the kid.
        </p>
      </header>

      <table className="print-table">
        <thead>
          <tr>
            <th className="col-skill">Skill</th>
            <th className="col-desc">Got it when…</th>
            <th className="col-box">not yet</th>
            <th className="col-box">working</th>
            <th className="col-box">got it</th>
          </tr>
        </thead>
        <tbody>
          {lane.skills.map((s) => (
            <tr key={s.id}>
              <td className="col-skill">
                {s.finale ? '🎉 ' : ''}
                {s.name}
                {s.ageFloor !== undefined && <span className="print-age"> (rarely before ~{s.ageFloor})</span>}
              </td>
              <td className="col-desc">{s.gotItWhen}</td>
              <td className="col-box">☐</td>
              <td className="col-box">☐</td>
              <td className="col-box">☐</td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="print-foot">
        Quest Tree · {lane.name} · {lane.skills.length} skills · notes on the back —{' '}
        <em>what surprised us, what needs rewording, what's next</em>
      </footer>
    </div>
  )
}
