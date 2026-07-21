import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  drawNumber,
  isGameOver,
  getRemainingNumbers,
  TOTAL_NUMBERS,
} from './game';

describe('createInitialState', () => {
  it('returns empty drawnNumbers and null lastNumber', () => {
    const state = createInitialState();
    expect(state.drawnNumbers).toEqual([]);
    expect(state.lastNumber).toBeNull();
  });
});

describe('drawNumber', () => {
  it('returns a number between 1 and 99', () => {
    const state = createInitialState();
    const newState = drawNumber(state);
    expect(newState.drawnNumbers).toHaveLength(1);
    expect(newState.lastNumber).toBeGreaterThanOrEqual(1);
    expect(newState.lastNumber).toBeLessThanOrEqual(99);
    expect(newState.drawnNumbers[0]).toBe(newState.lastNumber);
  });

  it('produces no duplicate numbers across 99 draws', () => {
    let state = createInitialState();
    const drawn = new Set<number>();
    for (let i = 0; i < TOTAL_NUMBERS; i++) {
      state = drawNumber(state);
      expect(state.lastNumber).not.toBeNull();
      expect(drawn.has(state.lastNumber!)).toBe(false);
      drawn.add(state.lastNumber!);
    }
    expect(drawn.size).toBe(TOTAL_NUMBERS);
    expect(isGameOver(state)).toBe(true);
  });

  it('returns the same state when game is already over', () => {
    let state = createInitialState();
    for (let i = 0; i < TOTAL_NUMBERS; i++) {
      state = drawNumber(state);
    }
    const stateAfter = drawNumber(state);
    expect(stateAfter).toBe(state);
  });

  it('gradually fills drawnNumbers on each call', () => {
    let state = createInitialState();
    for (let i = 1; i <= 10; i++) {
      state = drawNumber(state);
      expect(state.drawnNumbers).toHaveLength(i);
    }
  });
});

describe('isGameOver', () => {
  it('returns false for initial state', () => {
    expect(isGameOver(createInitialState())).toBe(false);
  });

  it('returns false when some numbers are drawn', () => {
    let state = createInitialState();
    state = drawNumber(state);
    state = drawNumber(state);
    expect(isGameOver(state)).toBe(false);
  });

  it('returns true when all 99 numbers are drawn', () => {
    let state = createInitialState();
    for (let i = 0; i < TOTAL_NUMBERS; i++) {
      state = drawNumber(state);
    }
    expect(isGameOver(state)).toBe(true);
  });

  it('returns false when lastNumber is null but no draws', () => {
    expect(isGameOver(createInitialState())).toBe(false);
  });
});

describe('getRemainingNumbers', () => {
  it('returns all 99 numbers for initial state', () => {
    const remaining = getRemainingNumbers(createInitialState());
    expect(remaining).toHaveLength(TOTAL_NUMBERS);
    expect(remaining).toEqual(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
  });

  it('excludes drawn numbers from remaining', () => {
    let state = createInitialState();
    state = drawNumber(state);
    state = drawNumber(state);
    const remaining = getRemainingNumbers(state);
    expect(remaining).toHaveLength(TOTAL_NUMBERS - 2);
    for (const n of state.drawnNumbers) {
      expect(remaining).not.toContain(n);
    }
  });

  it('returns empty array when all numbers are drawn', () => {
    let state = createInitialState();
    for (let i = 0; i < TOTAL_NUMBERS; i++) {
      state = drawNumber(state);
    }
    expect(getRemainingNumbers(state)).toEqual([]);
  });
});

describe('edge cases', () => {
  it('drawNumber does not mutate the original state', () => {
    const original = createInitialState();
    const copy = { ...original, drawnNumbers: [...original.drawnNumbers] };
    drawNumber(original);
    expect(original).toEqual(copy);
  });

  it('can draw all 99 numbers in any order (randomness check)', () => {
    let state = createInitialState();
    for (let i = 0; i < TOTAL_NUMBERS; i++) {
      state = drawNumber(state);
    }
    const sorted = [...state.drawnNumbers].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
  });
});
