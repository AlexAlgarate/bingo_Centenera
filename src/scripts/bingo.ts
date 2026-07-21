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
  const bola = document.getElementById('bola')!;
  bola.classList.remove('girar');
  void bola.offsetWidth;
  bola.classList.add('girar');
}

function render(): void {
  const state = getState();
  const bola = document.getElementById('bola')!;
  const btnSacar = document.getElementById('btn-sacar') as HTMLButtonElement;
  const salidos = document.getElementById('salidos')!;
  const grilla = document.getElementById('grilla')!;

  const allOut = isGameOver(state);
  bola.textContent =
    state.lastNumber !== null ? String(state.lastNumber) : allOut ? 'Fin' : '-';
  btnSacar.disabled = allOut;

  const sorted = [...state.drawnNumbers].sort((a, b) => a - b);
  let html = '';
  for (let fila = 0; fila < 5; fila++) {
    html += '<div>';
    for (let i = fila * 20; i < (fila + 1) * 20 && i < sorted.length; i++) {
      html += `<span class="numero bg-success text-white">${sorted[i]}</span>`;
    }
    html += '</div>';
  }
  salidos.innerHTML = html;

  html = '';
  for (let num = 1; num <= 99; num++) {
    const cls = state.drawnNumbers.includes(num)
      ? 'bg-success text-white'
      : 'bg-secondary text-white';
    html += `<div class="col-1 numero ${cls}">${num}</div>`;
  }
  grilla.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-sacar')!.addEventListener('click', drawNumber);
  document.getElementById('btn-reiniciar')!.addEventListener('click', resetGame);
  render();
});
