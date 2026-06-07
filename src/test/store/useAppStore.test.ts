import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import type { SpinResult, RouletteOption } from '../../types'

// Reset store state before each test so cases don't bleed into each other.
beforeEach(() => {
  useAppStore.setState({
    roulettes: [],
    history: [],
    dailyDestiny: undefined,
    preferences: {
      defaultPersonality: 'cute',
      hasCompletedOnboarding: false,
    },
  })
})

// ─── helpers ──────────────────────────────────────────────────────────────────

const sampleOption = (): RouletteOption => ({
  id: 'opt-1',
  label: 'Opção A',
  weight: 1,
  color: '#E07B54',
})

const sampleSpinResult = (): SpinResult => ({
  id: 'result-1',
  rouletteId: 'r-1',
  rouletteName: 'Teste',
  selectedOption: sampleOption(),
  personalityId: 'cute',
  gameMode: 'classic',
  spunAt: new Date().toISOString(),
})

// ─── createRoulette ───────────────────────────────────────────────────────────

describe('createRoulette', () => {
  it('adds a roulette to the store', () => {
    const { createRoulette } = useAppStore.getState()
    createRoulette({
      name: 'Minha Roleta',
      options: [sampleOption()],
      personalityId: 'cute',
      gameMode: 'classic',
    })
    expect(useAppStore.getState().roulettes).toHaveLength(1)
  })

  it('assigns an id, createdAt and updatedAt', () => {
    const { createRoulette } = useAppStore.getState()
    const roulette = createRoulette({
      name: 'Roleta com ID',
      options: [sampleOption()],
      personalityId: 'honest',
      gameMode: 'classic',
    })
    expect(roulette.id).toBeTruthy()
    expect(roulette.createdAt).toBeTruthy()
    expect(roulette.updatedAt).toBeTruthy()
  })

  it('returns the created roulette', () => {
    const { createRoulette } = useAppStore.getState()
    const roulette = createRoulette({
      name: 'Retornada',
      options: [sampleOption()],
      personalityId: 'dramatic',
      gameMode: 'best_of_3',
    })
    expect(roulette.name).toBe('Retornada')
  })

  it('prepends to the list so newest appears first', () => {
    const { createRoulette } = useAppStore.getState()
    createRoulette({ name: 'Primeira', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    createRoulette({ name: 'Segunda', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    const { roulettes } = useAppStore.getState()
    expect(roulettes[0].name).toBe('Segunda')
  })
})

// ─── updateRoulette ───────────────────────────────────────────────────────────

describe('updateRoulette', () => {
  it('updates name of an existing roulette', () => {
    const { createRoulette, updateRoulette } = useAppStore.getState()
    const created = createRoulette({
      name: 'Antes',
      options: [sampleOption()],
      personalityId: 'cute',
      gameMode: 'classic',
    })
    updateRoulette(created.id, { name: 'Depois' })
    const updated = useAppStore.getState().roulettes.find((r) => r.id === created.id)
    expect(updated?.name).toBe('Depois')
  })

  it('sets updatedAt to a valid ISO date string after update', () => {
    const { createRoulette, updateRoulette } = useAppStore.getState()
    const created = createRoulette({
      name: 'Ts Test',
      options: [sampleOption()],
      personalityId: 'cute',
      gameMode: 'classic',
    })
    updateRoulette(created.id, { name: 'Ts Updated' })
    const updated = useAppStore.getState().roulettes.find((r) => r.id === created.id)
    expect(updated?.updatedAt).toBeTruthy()
    expect(() => new Date(updated!.updatedAt)).not.toThrow()
    expect(isNaN(new Date(updated!.updatedAt).getTime())).toBe(false)
  })

  it('does not affect other roulettes', () => {
    const { createRoulette, updateRoulette } = useAppStore.getState()
    const r1 = createRoulette({ name: 'R1', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    createRoulette({ name: 'R2', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    updateRoulette(r1.id, { name: 'R1 Updated' })
    const r2 = useAppStore.getState().roulettes.find((r) => r.name === 'R2')
    expect(r2).toBeDefined()
  })
})

// ─── deleteRoulette ───────────────────────────────────────────────────────────

describe('deleteRoulette', () => {
  it('removes the roulette from the store', () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState()
    const created = createRoulette({
      name: 'Para deletar',
      options: [sampleOption()],
      personalityId: 'villain',
      gameMode: 'classic',
    })
    deleteRoulette(created.id)
    expect(useAppStore.getState().roulettes).toHaveLength(0)
  })

  it('keeps other roulettes intact', () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState()
    const r1 = createRoulette({ name: 'Fica', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    const r2 = createRoulette({ name: 'Some', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    deleteRoulette(r2.id)
    const remaining = useAppStore.getState().roulettes
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe(r1.id)
  })

  it('is a no-op for an unknown id', () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState()
    createRoulette({ name: 'Sobrevive', options: [sampleOption()], personalityId: 'cute', gameMode: 'classic' })
    deleteRoulette('id-inexistente')
    expect(useAppStore.getState().roulettes).toHaveLength(1)
  })
})

// ─── addHistory ──────────────────────────────────────────────────────────────

describe('addHistory', () => {
  it('prepends the result to history', () => {
    const { addHistory } = useAppStore.getState()
    addHistory(sampleSpinResult())
    expect(useAppStore.getState().history).toHaveLength(1)
  })

  it('newest result is first', () => {
    const { addHistory } = useAppStore.getState()
    addHistory({ ...sampleSpinResult(), id: 'first' })
    addHistory({ ...sampleSpinResult(), id: 'second' })
    expect(useAppStore.getState().history[0].id).toBe('second')
  })

  it('caps history at 100 entries', () => {
    const { addHistory } = useAppStore.getState()
    for (let i = 0; i < 105; i++) {
      addHistory({ ...sampleSpinResult(), id: `result-${i}` })
    }
    expect(useAppStore.getState().history).toHaveLength(100)
  })
})

// ─── clearHistory ─────────────────────────────────────────────────────────────

describe('clearHistory', () => {
  it('empties the history array', () => {
    const { addHistory, clearHistory } = useAppStore.getState()
    addHistory(sampleSpinResult())
    addHistory(sampleSpinResult())
    clearHistory()
    expect(useAppStore.getState().history).toHaveLength(0)
  })

  it('is a no-op when history is already empty', () => {
    useAppStore.getState().clearHistory()
    expect(useAppStore.getState().history).toHaveLength(0)
  })
})

// ─── updatePreferences ────────────────────────────────────────────────────────

describe('updatePreferences', () => {
  it('updates defaultPersonality', () => {
    useAppStore.getState().updatePreferences({ defaultPersonality: 'villain' })
    expect(useAppStore.getState().preferences.defaultPersonality).toBe('villain')
  })

  it('updates hasCompletedOnboarding', () => {
    useAppStore.getState().updatePreferences({ hasCompletedOnboarding: true })
    expect(useAppStore.getState().preferences.hasCompletedOnboarding).toBe(true)
  })

  it('partial update preserves other preference fields', () => {
    useAppStore.getState().updatePreferences({ hasCompletedOnboarding: true })
    useAppStore.getState().updatePreferences({ defaultPersonality: 'dramatic' })
    const prefs = useAppStore.getState().preferences
    expect(prefs.hasCompletedOnboarding).toBe(true)
    expect(prefs.defaultPersonality).toBe('dramatic')
  })
})
