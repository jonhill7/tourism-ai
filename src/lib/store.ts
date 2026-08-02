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
    return {
      ...s,
      kids,
      progress,
      unlocksGranted,
      activeKidId: s.activeKidId === id ? (kids[0]?.id ?? null) : s.activeKidId,
    }
  })

export const setActiveKid = (id: string) => setState((s) => ({ ...s, activeKidId: id }))

export const setSkillState = (kidId: string, skillId: string, next: SkillState) =>
  setState((s) => {
    const kidProgress = { ...(s.progress[kidId] ?? {}) }
    if (next === 'not-yet') delete kidProgress[skillId]
    else {
      const entry: ProgressEntry = { state: next }
      if (next === 'got-it') entry.date = new Date().toISOString().slice(0, 10)
      kidProgress[skillId] = entry
    }
    return { ...s, progress: { ...s.progress, [kidId]: kidProgress } }
  })

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

export const importJson = (raw: string): string | null => {
  try {
    const parsed = JSON.parse(raw) as AppState
    if (parsed.version !== 1 || !Array.isArray(parsed.kids)) return 'Not a Quest Tree backup file.'
    setState(() => ({ ...emptyState(), ...parsed }))
    return null
  } catch {
    return 'That file is not valid JSON.'
  }
}
