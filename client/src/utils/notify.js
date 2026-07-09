/**
 * Public notification API — backed by custom engine (no react-toastify).
 * Location: client/src/utils/notify.js
 */
import notifyEngine from '../notifications/notificationEngine';

export { NOTIFY_HOLD_MS as TOAST_DURATION_MS } from '../notifications/constants';

const notify = {
  success: (message) => notifyEngine.success(message),
  error: (message) => notifyEngine.error(message),
  warning: (message) => notifyEngine.warning(message),
  info: (message) => notifyEngine.info(message),
  loading: (message) => notifyEngine.loading(message),
  updateSuccess: (id, message) => notifyEngine.updateSuccess(id, message),
  updateError: (id, message) => notifyEngine.updateError(id, message),
  dismiss: (id) => notifyEngine.dismiss(id),
  run: (message, asyncFn, options) => notifyEngine.run(message, asyncFn, options),
};

export default notify;
