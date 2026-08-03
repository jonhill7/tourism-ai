import { useSyncExternalStore } from 'react'
import type { AppState, Kid, ProgressEntry, SkillState } from '../types'

const KEY = 'quest-tree-v1'

const emptyState = (): AppState => ({
  version: 1,
  kids: [],
  activeKidId: null,
  progress: {},
  unlocksGranted: {},
  emancipationAges: {},
  focus: {},
  announced: {},
})

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as AppState
    if (parsed.version !== 1) return emptyState()
    return { ...emptyState(), ...parsed }
  } catch {
    return emptyState()
  }
}

let state: AppState = load()
const listeners = new Set<() => void>()

const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — the in-memory state still works this session
  }
}

export const getState = () => state

export const setState = (updater: (prev: AppState) => AppState) => {
  state = updater(state)
  persist()
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useAppState = (): AppState => useSyncExternalStore(subscribe, getState)

// ---- actions ----

export const addKid = (name: string, birthdate: string) => {
  const id = `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const kid: Kid = { id, name, birthdate }
  setState((s) => ({ ...s, kids: [...s.kids, kid], activeKidId: s.activeKidId ?? id }))
}

export const updateKid = (id: string, patch: Partial<Kid>) =>
  setState((s) => ({ ...s, kids: s.kids.map((k) => (k.id === id ? { ...k, ...patch } : k)) }))

export const removeKid = (id: string) =>
  setState((s) => {
    const kids = s.kids.filter((k) => k.id !== id)
    const { [id]: _p, ...progress } = s.progress
    const { [id]: _u, ...unlocksGranted } = s.unlocksGranted
    const { [id]: _f, ...focus } = s.focus
    const { [id]: _a, ...announced } = s.announced
    return {
      ...s,
      kids,
      progress,
      unlocksGranted,
      focus,
      announced,
      activeKidId: s.activeKidId === id ? (kids[0]?.id ?? null) : s.activeKidId,
    }
  })

export const setActiveKid = (id: string) => setState((s) => ({ ...s, activeKidId: id }))

const today = () => new Date().toISOString().slice(0, 10)

export const setSkillState = (kidId: string, skillId: string, next: SkillState) =>
  setState((s) => {
    const kidProgress = { ...(s.progress[kidId] ?? {}) }
    const prev = kidProgress[skillId]
    if (next === 'not-yet' && !prev?.note && !prev?.firstGot) {
      // nothing worth keeping — a clean reset
      delete kidProgress[skillId]
    } else {
      const entry: ProgressEntry = { ...prev, state: next, date: today() }
      // the first got-it survives every later revisit — regression is the ladder continuing
      if (next === 'got-it' && !entry.firstGot) entry.firstGot = entry.date
      kidProgress[skillId] = entry
    }
    return { ...s, progress: { ...s.progress, [kidId]: kidProgress } }
  })

export const setSkillNote = (kidId: string, skillId: string, note: string) =>
  setState((s) => {
    const kidProgress = { ...(s.progress[kidId] ?? {}) }
    const prev = kidProgress[skillId] ?? { state: 'not-yet' as SkillState }
    const entry: ProgressEntry = { ...prev }
    if (note.trim()) entry.note = note
    else delete entry.note
    if (entry.state === 'not-yet' && !entry.note && !entry.firstGot) delete kidProgress[skillId]
    else kidProgress[skillId] = entry
    return { ...s, progress: { ...s.progress, [kidId]: kidProgress } }
  })

export const setSkillBy = (kidId: string, skillId: string, by: 'kid' | 'parent') =>
  setState((s) => {
    const kidProgress = { ...(s.progress[kidId] ?? {}) }
    const prev = kidProgress[skillId]
    if (!prev) return s
    kidProgress[skillId] = { ...prev, by }
    return { ...s, progress: { ...s.progress, [kidId]: kidProgress } }
  })

export const setFocus = (kidId: string, laneId: string | null) =>
  setState((s) => {
    const focus = { ...s.focus }
    if (laneId === null) delete focus[kidId]
    else focus[kidId] = { laneId, started: today() }
    return { ...s, focus }
  })

export const setAnnounced = (kidId: string, rowId: string, value: boolean) =>
  setState((s) => ({
    ...s,
    announced: {
      ...s.announced,
      [kidId]: { ...(s.announced[kidId] ?? {}), [rowId]: value },
    },
  }))

export const grantUnlock = (kidId: string, skillId: string, granted: boolean) =>
  setState((s) => ({
    ...s,
    unlocksGranted: {
      ...s.unlocksGranted,
      [kidId]: { ...(s.unlocksGranted[kidId] ?? {}), [skillId]: granted },
    },
  }))

export const setEmancipationAge = (rowId: string, age: number | 'graduation' | null) =>
  setState((s) => {
    const emancipationAges = { ...s.emancipationAges }
    if (age === null) delete emancipationAges[rowId]
    else emancipationAges[rowId] = age
    return { ...s, emancipationAges }
  })

export const skillStateFor = (s: AppState, kidId: string | null, skillId: string): SkillState =>
  (kidId && s.progress[kidId]?.[skillId]?.state) || 'not-yet'

// ---- backup ----

export const exportJson = (): string => JSON.stringify(state, null, 2)

export const importJson = (raw: string, mode: 'replace' | 'merge' = 'replace'): string | null => {
  try {
    const parsed = JSON.parse(raw) as AppState
    if (parsed.version !== 1 || !Array.isArray(parsed.kids)) return 'Not a Quest Tree backup file.'
    if (mode === 'replace') {
      setState(() => ({ ...emptyState(), ...parsed }))
      return null
    }
    // merge — for two parents keeping separate browsers in step: union kids,
    // newest entry wins per skill, grants and announcements accumulate.
    const incoming = { ...emptyState(), ...parsed }
    setState((s) => {
      const kids = [...s.kids]
      for (const k of incoming.kids) if (!kids.some((mine) => mine.id === k.id)) kids.push(k)

      const progress = { ...s.progress }
      for (const [kidId, theirs] of Object.entries(incoming.progress)) {
        const mine = { ...(progress[kidId] ?? {}) }
        for (const [skillId, theirEntry] of Object.entries(theirs)) {
          const myEntry = mine[skillId]
          const newer =
            !myEntry || (theirEntry.date ?? '') > (myEntry.date ?? '') ? theirEntry : myEntry
          const older = newer === theirEntry ? myEntry : theirEntry
          mine[skillId] = {
            ...newer,
            // never lose the earliest first-got or the only note
            firstGot:
              [myEntry?.firstGot, theirEntry.firstGot].filter(Boolean).sort()[0] ?? newer.firstGot,
            note: newer.note ?? older?.note,
          }
        }
        progress[kidId] = mine
      }

      const unlocksGranted = { ...s.unlocksGranted }
      for (const [kidId, theirs] of Object.entries(incoming.unlocksGranted))
        unlocksGranted[kidId] = { ...theirs, ...(unlocksGranted[kidId] ?? {}) }

      const announced = { ...s.announced }
      for (const [kidId, theirs] of Object.entries(incoming.announced))
        announced[kidId] = { ...theirs, ...(announced[kidId] ?? {}) }

      return {
        ...s,
        kids,
        progress,
        unlocksGranted,
        announced,
        emancipationAges: { ...incoming.emancipationAges, ...s.emancipationAges },
        activeKidId: s.activeKidId ?? kids[0]?.id ?? null,
      }
    })
    return null
  } catch {
    return 'That file is not valid JSON.'
  }
}
