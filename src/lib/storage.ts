import type { BingoState } from './game';
import { createInitialState, TOTAL_NUMBERS } from './game';

const STORAGE_KEY = 'bingo-state';

function isValidState(data: unknown): data is BingoState {
  if (!data || typeof data !== 'object') return false;
  const s = data as Record<string, unknown>;
  if (!Array.isArray(s.drawnNumbers)) return false;
  if (s.drawnNumbers.some((n: unknown) => typeof n !== 'number' || n < 1 || n > TOTAL_NUMBERS || !Number.isInteger(n))) return false;
  if (s.lastNumber !== null && (typeof s.lastNumber !== 'number' || s.lastNumber < 1 || s.lastNumber > TOTAL_NUMBERS || !Number.isInteger(s.lastNumber))) return false;
  if (new Set(s.drawnNumbers).size !== s.drawnNumbers.length) return false;
  if (s.drawnNumbers.length === 0 && s.lastNumber !== null) return false;
  if (s.drawnNumbers.length > 0 && typeof s.lastNumber !== 'number') return false;
  if (typeof s.lastNumber === 'number' && !s.drawnNumbers.includes(s.lastNumber)) return false;
  return true;
}

export function loadState(): BingoState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isValidState(parsed)) return parsed;
    }
  } catch {
  }
  return createInitialState();
}

export function saveState(state: BingoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // La aplicación puede seguir funcionando aunque el almacenamiento no esté disponible.
  }
}
