import type { EmancipationRow, Kid } from '../types'

/** Age in whole years from a YYYY-MM birthdate. */
export const ageOf = (kid: Kid, now = new Date()): number => {
  const [y, m] = kid.birthdate.split('-').map(Number)
  if (!y) return 0
  let age = now.getFullYear() - y
  if (now.getMonth() + 1 < (m || 1)) age--
  return Math.max(0, age)
}

/** Age in whole years at a given ISO date (YYYY-MM-DD). */
export const ageAt = (kid: Kid, iso: string): number => ageOf(kid, new Date(iso + 'T12:00:00'))

/** Approximate graduation: June of the year the kid turns eighteen. */
export const graduationDate = (kid: Kid): Date => {
  const [y] = kid.birthdate.split('-').map(Number)
  return new Date((y || 2000) + 18, 5, 1)
}

/** The date a row's freedoms arrive for this kid (override-aware). */
export const rowArrival = (
  kid: Kid,
  row: EmancipationRow,
  overrides: Record<string, number | 'graduation'>,
): Date => {
  const age = overrides[row.id] ?? row.defaultAge
  if (age === 'graduation') return graduationDate(kid)
  const [y, m] = kid.birthdate.split('-').map(Number)
  return new Date((y || 2000) + age, (m || 1) - 1, 1)
}

export const fmtMonth = (d: Date): string =>
  d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
