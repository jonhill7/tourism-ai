import { useAppState, setSkillState, skillStateFor } from '../lib/store'
import type { SkillState } from '../types'

export const stateLabel: Record<SkillState, string> = {
  'not-yet': 'not yet',
  working: 'working on it',
  'got-it': 'got it',
}

// only the id is needed, so the capstone (which lives outside every lane) can use these too
export const StateButtons = ({ kidId, skill }: { kidId: string; skill: { id: string } }) => {
  const state = useAppState()
  const current = skillStateFor(state, kidId, skill.id)
  return (
    <div className="state-buttons" role="radiogroup" aria-label="Skill state">
      {(['not-yet', 'working', 'got-it'] as SkillState[]).map((s) => (
        <button
          key={s}
          role="radio"
          aria-checked={current === s}
          className={`state-btn s-${s} ${current === s ? 'active' : ''}`}
          onClick={() => setSkillState(kidId, skill.id, s)}
        >
          {s === 'got-it' ? '✓ ' : ''}
          {stateLabel[s]}
        </button>
      ))}
    </div>
  )
}
