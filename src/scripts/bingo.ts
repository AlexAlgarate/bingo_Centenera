import {
  createInitialState,
  drawNumber as draw,
  isGameOver,
  TOTAL_NUMBERS,
} from '../lib/game';
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

let equationAnswer = 0;

function generateEquation(): string {
  const isSimple = Math.random() < 0.35;
  if (isSimple) {
    const a = Math.floor(Math.random() * 40) + 3;
    const b = Math.floor(Math.random() * 25) + 2;
    const opIx = Math.floor(Math.random() * 3);
    const ops = ['+', '−', '·'];
    const op = ops[opIx];
    let result: number;
    if (op === '+') result = a + b;
    else if (op === '−') { result = a > b ? a - b : b - a; }
    else result = a * b;
    const hideLeft = Math.random() < 0.5;
    if (op === '−') {
      if (a > b) {
        equationAnswer = hideLeft ? a : b;
        return hideLeft ? `x − ${b} = ${result}` : `${a} − x = ${result}`;
      } else {
        equationAnswer = hideLeft ? b : a;
        return hideLeft ? `x − ${a} = ${result}` : `${b} − x = ${result}`;
      }
    } else {
      equationAnswer = hideLeft ? a : b;
      return hideLeft ? `x ${op} ${b} = ${result}` : `${a} ${op} x = ${result}`;
    }
  } else {
    const a = Math.floor(Math.random() * 8) + 2;
    const x = Math.floor(Math.random() * 25) + 2;
    const add = Math.random() < 0.5;
    let b: number, result: number;
    if (add) {
      b = Math.floor(Math.random() * 40) + 1;
      result = a * x + b;
    } else {
      b = Math.floor(Math.random() * (a * x - 1)) + 1;
      result = a * x - b;
    }
    const op = add ? '+' : '−';
    equationAnswer = x;
    return `${a}x ${op} ${b} = ${result}`;
  }
}

function openResetModal(): void {
  const overlay = document.getElementById('modal-overlay')!;
  const equation = document.getElementById('equation')!;
  const input = document.getElementById('equation-answer') as HTMLInputElement;
  const error = document.getElementById('equation-error')!;

  equation.textContent = generateEquation();
  input.value = '';
  error.classList.add('hidden');
  overlay.classList.remove('hidden');
  input.focus();
}

function closeResetModal(): void {
  document.getElementById('modal-overlay')!.classList.add('hidden');
}

function confirmReset(): void {
  const input = document.getElementById('equation-answer') as HTMLInputElement;
  const error = document.getElementById('equation-error')!;

  if (Number(input.value) !== equationAnswer) {
    error.classList.remove('hidden');
    input.focus();
    input.select();
    return;
  }

  closeResetModal();
  saveState(createInitialState());
  render();
}

function resetGame(): void {
  openResetModal();
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

  let html = '';
  const sorted = [...state.drawnNumbers].sort((a, b) => a - b);
  for (const num of sorted) {
    html += `<span class="number drawn">${num}</span>`;
  }
  drawnList.innerHTML = html;

  html = '';
  for (let num = 1; num <= TOTAL_NUMBERS; num++) {
    if (!state.drawnNumbers.includes(num)) {
      html += `<div class="number">${num}</div>`;
    }
  }
  grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-draw')!.addEventListener('click', drawNumber);
  document.getElementById('btn-reset')!.addEventListener('click', resetGame);
  document.getElementById('btn-modal-confirm')!.addEventListener('click', confirmReset);
  document
    .getElementById('btn-modal-cancel')!
    .addEventListener('click', closeResetModal);
  document.getElementById('modal-overlay')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeResetModal();
  });
  document.getElementById('equation-answer')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmReset();
    if (e.key === 'Escape') closeResetModal();
  });
  render();
});
