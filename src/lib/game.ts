export interface BingoState {
  drawnNumbers: number[];
  lastNumber: number | null;
}

export const TOTAL_NUMBERS = 90;

export function createInitialState(): BingoState {
  return { drawnNumbers: [], lastNumber: null };
}

export function drawNumber(state: BingoState): BingoState {
  if (state.drawnNumbers.length >= TOTAL_NUMBERS) return state;

  const remaining = getRemainingNumbers(state);
  const index = Math.floor(Math.random() * remaining.length);
  const number = remaining[index];

  return {
    drawnNumbers: [...state.drawnNumbers, number],
    lastNumber: number,
  };
}

export function isGameOver(state: BingoState): boolean {
  return state.drawnNumbers.length >= TOTAL_NUMBERS;
}

export function getRemainingNumbers(state: BingoState): number[] {
  const remaining: number[] = [];
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    if (!state.drawnNumbers.includes(i)) remaining.push(i);
  }
  return remaining;
}
