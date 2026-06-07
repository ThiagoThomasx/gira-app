import { describe, it, expect } from 'vitest'
import { templates } from '../../data/templates'
import { personalities } from '../../data/personalities'
import type { GameMode, TemplateCategory } from '../../types'

const VALID_GAME_MODES: GameMode[] = ['classic', 'best_of_3', 'veto', 'elimination']

const VALID_CATEGORIES: TemplateCategory[] = [
  'daily', 'couple', 'work', 'friends', 'selfcare',
  'food', 'entertainment', 'chores', 'challenges', 'random',
]

describe('templates data', () => {
  it('contains exactly 10 templates', () => {
    expect(templates).toHaveLength(10)
  })

  it('each template has at least 2 default options', () => {
    for (const t of templates) {
      expect(t.defaultOptions.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('each template has non-empty name, description and tagline', () => {
    for (const t of templates) {
      expect(t.name.trim()).not.toBe('')
      expect(t.description.trim()).not.toBe('')
      expect(t.tagline.trim()).not.toBe('')
    }
  })

  it('each template has a valid category', () => {
    for (const t of templates) {
      expect(VALID_CATEGORIES).toContain(t.category)
    }
  })

  it('each template has a valid recommendedGameMode', () => {
    for (const t of templates) {
      expect(VALID_GAME_MODES).toContain(t.recommendedGameMode)
    }
  })

  it('each template recommendedPersonality matches a known personality', () => {
    const knownIds = personalities.map((p) => p.id)
    for (const t of templates) {
      expect(knownIds).toContain(t.recommendedPersonality)
    }
  })

  it('each default option has a non-empty label and weight >= 1', () => {
    for (const t of templates) {
      for (const opt of t.defaultOptions) {
        expect(opt.label.trim()).not.toBe('')
        expect(opt.weight).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('template ids are unique', () => {
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
