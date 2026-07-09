/**
 * Top-right notification stack — max 3 visible, queued by engine.
 * Location: client/src/notifications/NotificationContainer.jsx
 */
import { useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import { subscribe } from './notificationEngine';
import './notifications.css';

const NotificationContainer = () => {
  const [items, setItems] = useState([]);

  useEffect(() => subscribe(setItems), []);

  if (!items.length) return null;

  return (
    <div className="sioa-notify-container" aria-label="Notifications">
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NotificationContainer;
