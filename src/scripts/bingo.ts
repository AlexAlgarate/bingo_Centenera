import { createInitialState, drawNumber as draw, isGameOver } from '../lib/game';
import type { BingoState } from '../lib/game';

const STORAGE_KEY = 'bingo-state';

function getState(): BingoState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return createInitialState();
}

function saveState(state: BingoState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function drawNumber(): void {
  const state = getState();
  const newState = draw(state);
  if (newState === state) return;
  saveState(newState);
  render();
  triggerAnimation();
}

function resetGame(): void {
  saveState(createInitialState());
  render();
}

function triggerAnimation(): void {
  const ball = document.getElementById('ball')!;
  ball.classList.remove('spin');
  void ball.offsetWidth;
  ball.classList.add('spin');
}

function render(): void {
  const state = getState();
  const ball = document.getElementById('ball')!;
  const btnDraw = document.getElementById('btn-draw') as HTMLButtonElement;
  const drawnList = document.getElementById('drawn-list')!;
  const grid = document.getElementById('grid')!;

  const allOut = isGameOver(state);
  ball.textContent =
    state.lastNumber !== null ? String(state.lastNumber) : allOut ? 'End' : '-';
  btnDraw.disabled = allOut;

  const sorted = [...state.drawnNumbers].sort((a, b) => a - b);
  let html = '';
  for (let row = 0; row < 5; row++) {
    html += '<div>';
    for (let i = row * 20; i < (row + 1) * 20 && i < sorted.length; i++) {
      html += `<span class="number drawn">${sorted[i]}</span>`;
    }
    html += '</div>';
  }
  drawnList.innerHTML = html;

  html = '';
  for (let num = 1; num <= 99; num++) {
    const cls = state.drawnNumbers.includes(num)
      ? 'drawn'
      : 'pending';
    html += `<div class="number ${cls}">${num}</div>`;
  }
  grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-draw')!.addEventListener('click', drawNumber);
  document.getElementById('btn-reset')!.addEventListener('click', resetGame);
  render();
});
