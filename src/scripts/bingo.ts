import { createInitialState, drawNumber, isGameOver, TOTAL_NUMBERS } from '../lib/game';
import type { BingoState } from '../lib/game';
import { generateEquation } from '../lib/equations';
import type { Equation } from '../lib/equations';
import { loadState, saveState } from '../lib/storage';

const $ = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el;
};

const $btn = (id: string): HTMLButtonElement => {
  return $(id) as HTMLButtonElement;
};

const $inp = (id: string): HTMLInputElement => {
  return $(id) as HTMLInputElement;
};

let currentEquation: Equation | null = null;
let previousFocus: HTMLElement | null = null;
let isDrawing = false;

const handleDrawClick = (): void => {
  if (isDrawing) return;
  isDrawing = true;

  const state = loadState();
  const newState = drawNumber(state);
  if (newState === state) {
    isDrawing = false;
    return;
  }
  saveState(newState);
  render(newState);
  triggerAnimation();
  $btn('btn-draw').disabled = true;

  setTimeout(() => {
    isDrawing = false;
    $btn('btn-draw').disabled = isGameOver(loadState());
  }, 300);
};

const openResetModal = (): void => {
  previousFocus = document.activeElement as HTMLElement;
  const overlay = $('modal-overlay');
  const eq = generateEquation();
  currentEquation = eq;
  $('equation').textContent = eq.text;
  const input = $inp('equation-answer');
  input.value = '';
  input.className = 'modal-input';
  input.setAttribute('aria-invalid', 'false');
  $('equation-error').classList.add('hidden');
  overlay.classList.remove('hidden');
  input.focus();
};

const closeResetModal = (): void => {
  $('modal-overlay').classList.add('hidden');
  currentEquation = null;
  previousFocus?.focus();
  previousFocus = null;
};

const handleConfirmReset = (): void => {
  const input = $inp('equation-answer');
  const error = $('equation-error');

  const answer = input.value.trim();
  const isValidAnswer =
    /^\d+$/.test(answer) &&
    currentEquation !== null &&
    Number(answer) === currentEquation.answer;

  if (!isValidAnswer) {
    input.className = 'modal-input error';
    input.setAttribute('aria-invalid', 'true');
    error.classList.remove('hidden');
    input.focus();
    input.select();
    return;
  }

  closeResetModal();
  const newState = createInitialState();
  saveState(newState);
  render(newState);
};

const handleNewEquation = (): void => {
  const eq = generateEquation();
  currentEquation = eq;
  $('equation').textContent = eq.text;
  const input = $inp('equation-answer');
  input.value = '';
  input.className = 'modal-input';
  input.setAttribute('aria-invalid', 'false');
  $('equation-error').classList.add('hidden');
  input.focus();
};

const triggerAnimation = (): void => {
  const ball = $('ball');
  ball.classList.remove('spin');
  void ball.offsetWidth;
  ball.classList.add('spin');
};

const render = (state: BingoState): void => {
  const ball = $('ball');
  const btnDraw = $btn('btn-draw');
  const drawnList = $('drawn-list');
  const grid = $('grid');
  const gameOverMsg = $('game-over-msg');

  const allOut = isGameOver(state);
  ball.textContent = allOut
    ? 'End'
    : state.lastNumber !== null
      ? String(state.lastNumber)
      : '-';
  btnDraw.disabled = allOut;

  if (allOut) {
    gameOverMsg.textContent = '¡Juego terminado!';
    gameOverMsg.classList.remove('hidden');
  } else {
    gameOverMsg.classList.add('hidden');
  }

  const drawn = new Set(state.drawnNumbers);
  let html = '';
  const sorted = [...state.drawnNumbers].sort((a: number, b: number) => a - b);
  for (const num of sorted) {
    html += `<span class="number drawn" aria-label="Número ${num}">${num}</span>`;
  }
  drawnList.innerHTML = html;

  html = '';
  for (let num = 1; num <= TOTAL_NUMBERS; num++) {
    if (!drawn.has(num)) {
      html += `<div class="number" aria-label="Número ${num} pendiente">${num}</div>`;
    }
  }
  grid.innerHTML = html;
};

const trapFocus = (e: KeyboardEvent): void => {
  const overlay = $('modal-overlay');
  if (overlay.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeResetModal();
    return;
  }
  if (e.key !== 'Tab') return;

  const focusable = overlay.querySelectorAll<HTMLElement>(
    'button, input, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (!overlay.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
    return;
  }

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  $btn('btn-draw').addEventListener('click', handleDrawClick);
  $btn('btn-reset').addEventListener('click', openResetModal);
  $btn('btn-modal-confirm').addEventListener('click', handleConfirmReset);
  $btn('btn-modal-cancel').addEventListener('click', closeResetModal);
  $btn('btn-new-equation').addEventListener('click', handleNewEquation);
  $('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeResetModal();
  });
  $inp('equation-answer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmReset();
    }
  });
  document.addEventListener('keydown', trapFocus);
  render(loadState());
});
