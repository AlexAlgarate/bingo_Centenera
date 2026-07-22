export interface BingoState {
	drawnNumbers: number[];
	lastNumber: number | null;
}

export const TOTAL_NUMBERS = 90;

export const createInitialState = (): BingoState => ({
	drawnNumbers: [],
	lastNumber: null,
});

export const drawNumber = (state: BingoState): BingoState => {
	if (state.drawnNumbers.length >= TOTAL_NUMBERS) return state;

	const remaining = getRemainingNumbers(state);
	const index = Math.floor(Math.random() * remaining.length);
	const number = remaining[index];

	return {
		drawnNumbers: [...state.drawnNumbers, number],
		lastNumber: number,
	};
};

export const isGameOver = (state: BingoState): boolean => {
	return state.drawnNumbers.length >= TOTAL_NUMBERS;
};

export const getRemainingNumbers = (state: BingoState): number[] => {
	const drawn = new Set(state.drawnNumbers);
	const remaining: number[] = [];
	for (let i = 1; i <= TOTAL_NUMBERS; i++) {
		if (!drawn.has(i)) remaining.push(i);
	}
	return remaining;
};
