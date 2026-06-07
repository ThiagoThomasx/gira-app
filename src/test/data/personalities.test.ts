import { describe, it, expect } from 'vitest'
import { personalities } from '../../data/personalities'
import type { PersonalityId } from '../../types'

const ALL_IDS: PersonalityId[] = [
  'dramatic', 'snarky', 'cute', 'honest',
  'villain', 'advisor', 'chaotic', 'professional',
]

describe('personalities data', () => {
  it('contains exactly 8 personalities', () => {
    expect(personalities).toHaveLength(8)
  })

  it('covers every PersonalityId', () => {
    const ids = personalities.map((p) => p.id)
    for (const id of ALL_IDS) {
      expect(ids).toContain(id)
    }
  })

  it('each personality has non-empty name and description', () => {
    for (const p of personalities) {
      expect(p.name.trim()).not.toBe('')
      expect(p.description.trim()).not.toBe('')
    }
  })

  it('each personality has at least 1 phrase in before, during and after', () => {
    for (const p of personalities) {
      expect(p.phrases.before.length).toBeGreaterThanOrEqual(1)
      expect(p.phrases.during.length).toBeGreaterThanOrEqual(1)
      expect(p.phrases.after.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('all phrases are non-empty strings', () => {
    for (const p of personalities) {
      const all = [...p.phrases.before, ...p.phrases.during, ...p.phrases.after]
      for (const phrase of all) {
        expect(typeof phrase).toBe('string')
        expect(phrase.trim()).not.toBe('')
      }
    }
  })

  it('each personality has at least 1 bestFor entry', () => {
    for (const p of personalities) {
      expect(p.bestFor.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('ids are unique', () => {
    const ids = personalities.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
