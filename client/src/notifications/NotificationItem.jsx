/**
 * Single notification card with pause-on-hover and manual close.
 * Location: client/src/notifications/NotificationItem.jsx
 */
import { NOTIFY_HOLD_MS } from './constants';
import { dismiss, pause, resume } from './notificationEngine';

const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
  loading: 'bi-arrow-repeat',
};

const NotificationItem = ({ item }) => {
  const { id, type, message, phase, loading, paused, holdKey } = item;
  const phaseClass =
    phase === 'entering' ? 'sioa-notify--entering'
      : phase === 'exiting' ? 'sioa-notify--exiting'
        : 'sioa-notify--holding';

  return (
    <div
      className={`sioa-notify sioa-notify--${type} ${phaseClass}${paused ? ' sioa-notify--paused' : ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      onMouseEnter={() => pause(id)}
      onMouseLeave={() => resume(id)}
    >
      <div className="sioa-notify__icon" aria-hidden="true">
        <i className={`bi ${ICONS[type] || ICONS.info} ${loading ? 'sioa-notify__spinner' : ''}`} />
      </div>

      <p className="sioa-notify__message">{message}</p>

      {!loading && (
        <button
          type="button"
          className="sioa-notify__close"
          onClick={() => dismiss(id)}
          aria-label="Close notification"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}

      {!loading && phase === 'holding' && (
        <div className="sioa-notify__progress-track" aria-hidden="true">
          <div
            key={holdKey ?? id}
            className="sioa-notify__progress-bar"
            style={{ animationDuration: `${NOTIFY_HOLD_MS}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
