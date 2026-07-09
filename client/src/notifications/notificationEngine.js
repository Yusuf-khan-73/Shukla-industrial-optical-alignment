/**
 * Imperative notification engine — no third-party toast library.
 * Timers live here (outside React) so route changes and re-renders cannot reset them.
 * Location: client/src/notifications/notificationEngine.js
 */
import {
  NOTIFY_ENTER_MS,
  NOTIFY_EXIT_MS,
  NOTIFY_HOLD_MS,
  NOTIFY_MAX_VISIBLE,
} from './constants';

/** @typedef {'success'|'error'|'warning'|'info'|'loading'} NotifyType */
/** @typedef {'queued'|'entering'|'holding'|'exiting'} NotifyPhase */

let nextId = 0;
/** @type {Map<string, object>} */
const records = new Map();
/** @type {string[]} */
const activeIds = [];
/** @type {string[]} */
const waitQueue = [];
/** @type {Set<Function>} */
const listeners = new Set();
/** @type {Map<string, { holdTimer?: ReturnType<typeof setTimeout>, exitTimer?: ReturnType<typeof setTimeout>, holdRemaining: number, holdStart: number, paused: boolean }>} */
const timers = new Map();

const generateId = () => {
  nextId += 1;
  return `sioa-notify-${nextId}`;
};

const snapshot = () =>
  activeIds
    .map((id) => records.get(id))
    .filter(Boolean);

const emit = () => {
  listeners.forEach((listener) => listener(snapshot()));
};

const clearHoldTimer = (id) => {
  const timer = timers.get(id);
  if (!timer) return;
  if (timer.holdTimer) clearTimeout(timer.holdTimer);
  timer.holdTimer = undefined;
};

const clearExitTimer = (id) => {
  const timer = timers.get(id);
  if (!timer) return;
  if (timer.exitTimer) clearTimeout(timer.exitTimer);
  timer.exitTimer = undefined;
};

const clearAllTimers = (id) => {
  clearHoldTimer(id);
  clearExitTimer(id);
  timers.delete(id);
};

const startExit = (id) => {
  const record = records.get(id);
  if (!record || record.phase === 'exiting') return;

  clearAllTimers(id);
  record.phase = 'exiting';
  emit();

  const exitTimer = setTimeout(() => {
    finishRemove(id);
  }, NOTIFY_EXIT_MS);

  timers.set(id, { holdRemaining: 0, holdStart: 0, paused: false, exitTimer });
};

const scheduleHold = (id) => {
  const record = records.get(id);
  if (!record || record.loading) return;

  clearHoldTimer(id);

  const state = timers.get(id) ?? {
    holdRemaining: NOTIFY_HOLD_MS,
    holdStart: Date.now(),
    paused: false,
  };

  state.holdStart = Date.now();
  state.paused = false;
  state.holdRemaining = NOTIFY_HOLD_MS;

  state.holdTimer = setTimeout(() => {
    startExit(id);
  }, state.holdRemaining);

  record.holdKey = Date.now();
  record.paused = false;

  timers.set(id, state);
};

const activate = (id) => {
  const record = records.get(id);
  if (!record || record.phase !== 'queued') return;

  record.phase = 'entering';
  activeIds.push(id);
  emit();

  setTimeout(() => {
    const current = records.get(id);
    if (!current || current.phase === 'exiting') return;
    current.phase = 'holding';
    emit();
    if (!current.loading) {
      scheduleHold(id);
    }
  }, NOTIFY_ENTER_MS);
};

const promoteFromQueue = () => {
  while (activeIds.length < NOTIFY_MAX_VISIBLE && waitQueue.length > 0) {
    const id = waitQueue.shift();
    if (records.has(id)) activate(id);
  }
};

const finishRemove = (id) => {
  clearAllTimers(id);
  records.delete(id);
  const index = activeIds.indexOf(id);
  if (index >= 0) activeIds.splice(index, 1);
  emit();
  promoteFromQueue();
};

const enqueue = ({ type, message, loading = false, id = generateId() }) => {
  const record = {
    id,
    type,
    message,
    loading,
    phase: 'queued',
    createdAt: Date.now(),
  };

  records.set(id, record);

  if (activeIds.length < NOTIFY_MAX_VISIBLE) {
    activate(id);
  } else {
    waitQueue.push(id);
    emit();
  }

  return id;
};

const update = (id, type, message) => {
  const record = records.get(id);
  if (!record) return;

  record.type = type;
  record.message = message;
  record.loading = false;

  if (record.phase === 'queued') {
    emit();
    return;
  }

  if (record.phase === 'entering') {
    emit();
    return;
  }

  if (record.phase === 'holding') {
    emit();
    scheduleHold(id);
  }
};

export const subscribe = (listener) => {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
};

export const pause = (id) => {
  const record = records.get(id);
  if (!record || record.loading || record.phase !== 'holding') return;

  const state = timers.get(id);
  if (!state || state.paused) return;

  clearHoldTimer(id);
  state.holdRemaining -= Date.now() - state.holdStart;
  state.paused = true;
  record.paused = true;
  emit();
};

export const resume = (id) => {
  const record = records.get(id);
  if (!record || record.loading || record.phase !== 'holding') return;

  const state = timers.get(id);
  if (!state || !state.paused) return;

  state.paused = false;
  state.holdStart = Date.now();
  state.holdTimer = setTimeout(() => {
    startExit(id);
  }, Math.max(state.holdRemaining, 0));
  record.paused = false;
  emit();
};

export const dismiss = (id) => {
  const record = records.get(id);
  if (!record) return;

  if (record.phase === 'queued') {
    records.delete(id);
    const queueIndex = waitQueue.indexOf(id);
    if (queueIndex >= 0) waitQueue.splice(queueIndex, 1);
    emit();
    return;
  }

  if (record.phase === 'exiting') return;
  startExit(id);
};

export const notifyEngine = {
  success: (message) => enqueue({ type: 'success', message }),

  error: (message) => enqueue({ type: 'error', message }),

  warning: (message) => enqueue({ type: 'warning', message }),

  info: (message) => enqueue({ type: 'info', message }),

  loading: (message) => enqueue({ type: 'loading', message, loading: true }),

  updateSuccess: (id, message) => update(id, 'success', message),

  updateError: (id, message) => update(id, 'error', message),

  dismiss,

  async run(message, asyncFn, { success, error } = {}) {
    const id = notifyEngine.loading(message);
    try {
      const result = await asyncFn();
      notifyEngine.updateSuccess(id, success ?? 'Operation completed successfully');
      return result;
    } catch (err) {
      const errorMessage =
        typeof error === 'function' ? error(err) : error ?? 'Operation failed. Please try again.';
      notifyEngine.updateError(id, errorMessage);
      throw err;
    }
  },
};

export default notifyEngine;
