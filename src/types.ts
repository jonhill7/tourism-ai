export type AssessmentMode = 'self-check' | 'debrief' | 'observed'
export type LaneKind = 'competence' | 'character'
export type SkillState = 'not-yet' | 'working' | 'got-it'

export interface Unlock {
  text: string
  coSign?: boolean
}

export interface Skill {
  id: string
  name: string
  gotItWhen: string
  looksLike: string[]
  waysToBuild: string[]
  comesAfter: string[]
  ageFloor?: number
  assessment: AssessmentMode
  /** A disposition node in a competence lane: character-grade handling — never a gate, never scored. */
  touch?: 'light'
  unlock?: Unlock
  finale?: boolean
  outcomes: string[]
}

export interface Lane {
  id: string
  name: string
  emoji: string
  cluster: string
  kind: LaneKind
  tagline: string
  skills: Skill[]
}

export interface Outcome {
  id: string
  emoji: string
  name: string
  note: string
}

export interface Cluster {
  id: string
  lanes: string[]
}

export interface EmancipationRow {
  id: string
  defaultAge: number | 'graduation'
  title: string
  freedoms: string[]
  valuesLoaded: boolean
  notes: string
}

export interface EmancipationData {
  intro: string
  rules: string[]
  sortingTest: {
    question: string
    answers: { answer: string; verdict: string }[]
  }
  rows: EmancipationRow[]
  companions: { expectations: string; adulthoodDate: string }
}

export interface ExpectationItem {
  id: string
  expectation: string
  consequence: string
}

export interface Kid {
  id: string
  name: string
  birthdate: string // YYYY-MM
  adulthoodDate?: string // YYYY-MM, declared in advance
}

export interface ProgressEntry {
  state: SkillState
  date?: string // ISO date this state was last set
  firstGot?: string // ISO date of the FIRST got-it — kept through revisits; regression is the ladder, not a demotion
  note?: string // private notes & evidence — what you saw, when, what's left
  by?: 'kid' | 'parent' // who marked it (self-check belongs to the kid)
}

export interface FocusEntry {
  laneId: string
  started: string // ISO date the fortnight began
}

export interface AppState {
  version: 1
  kids: Kid[]
  activeKidId: string | null
  progress: Record<string, Record<string, ProgressEntry>>
  unlocksGranted: Record<string, Record<string, boolean>>
  emancipationAges: Record<string, number | 'graduation'>
  /** Per-kid current focus: one kid, one lane, two weeks. */
  focus: Record<string, FocusEntry>
  /** Per-kid, per-emancipation-row: "we announced this before it arrives". */
  announced: Record<string, Record<string, boolean>>
}
