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
  date?: string // ISO date when marked got-it
}

export interface AppState {
  version: 1
  kids: Kid[]
  activeKidId: string | null
  progress: Record<string, Record<string, ProgressEntry>>
  unlocksGranted: Record<string, Record<string, boolean>>
  emancipationAges: Record<string, number | 'graduation'>
}
